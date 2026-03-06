#import "RNNetworkLoggerURLProtocol.h"
#import "RNNetworkLoggerNativeTransport.h"
#import <objc/runtime.h>

static NSString *const kHandledKey = @"RNNetworkLoggerHandled";

typedef NSURLSessionConfiguration *(*SessionConfigGetter)(id, SEL);

static BOOL isSwizzled = NO;
static IMP originalDefaultIMP = NULL;
static IMP originalEphemeralIMP = NULL;

static NSURLSessionConfiguration *rnlogger_swizzledDefault(id self, SEL _cmd)
{
  NSURLSessionConfiguration *config = nil;
  if (originalDefaultIMP != NULL) {
    config = ((SessionConfigGetter)originalDefaultIMP)(self, _cmd);
  }
  if (config == nil) {
    config = [NSURLSessionConfiguration defaultSessionConfiguration];
  }

  NSMutableArray *protocols = [config.protocolClasses mutableCopy] ?: [NSMutableArray array];
  if (![protocols containsObject:[RNNetworkLoggerURLProtocol class]]) {
    [protocols insertObject:[RNNetworkLoggerURLProtocol class] atIndex:0];
    config.protocolClasses = protocols;
  }
  return config;
}

static NSURLSessionConfiguration *rnlogger_swizzledEphemeral(id self, SEL _cmd)
{
  NSURLSessionConfiguration *config = nil;
  if (originalEphemeralIMP != NULL) {
    config = ((SessionConfigGetter)originalEphemeralIMP)(self, _cmd);
  }
  if (config == nil) {
    config = [NSURLSessionConfiguration ephemeralSessionConfiguration];
  }

  NSMutableArray *protocols = [config.protocolClasses mutableCopy] ?: [NSMutableArray array];
  if (![protocols containsObject:[RNNetworkLoggerURLProtocol class]]) {
    [protocols insertObject:[RNNetworkLoggerURLProtocol class] atIndex:0];
    config.protocolClasses = protocols;
  }
  return config;
}

@interface RNNetworkLoggerURLProtocol () <NSURLSessionDataDelegate>
@property(nonatomic, strong) NSURLSessionDataTask *task;
@property(nonatomic, strong) NSMutableData *responseData;
@property(nonatomic, strong) NSString *requestId;
@property(nonatomic, strong) NSURLResponse *capturedResponse;
@end

@implementation RNNetworkLoggerURLProtocol

+ (void)installInterception
{
  if (isSwizzled) {
    return;
  }

  Class configClass = [NSURLSessionConfiguration class];

  Method defaultMethod = class_getClassMethod(configClass, @selector(defaultSessionConfiguration));
  Method ephemeralMethod = class_getClassMethod(configClass, @selector(ephemeralSessionConfiguration));

  if (defaultMethod != NULL) {
    originalDefaultIMP = method_getImplementation(defaultMethod);
    method_setImplementation(defaultMethod, (IMP)rnlogger_swizzledDefault);
  }

  if (ephemeralMethod != NULL) {
    originalEphemeralIMP = method_getImplementation(ephemeralMethod);
    method_setImplementation(ephemeralMethod, (IMP)rnlogger_swizzledEphemeral);
  }

  isSwizzled = YES;
}

+ (void)uninstallInterception
{
  if (!isSwizzled) {
    return;
  }

  Class configClass = [NSURLSessionConfiguration class];

  if (originalDefaultIMP != NULL) {
    Method defaultMethod = class_getClassMethod(configClass, @selector(defaultSessionConfiguration));
    if (defaultMethod != NULL) {
      method_setImplementation(defaultMethod, originalDefaultIMP);
    }
    originalDefaultIMP = NULL;
  }

  if (originalEphemeralIMP != NULL) {
    Method ephemeralMethod = class_getClassMethod(configClass, @selector(ephemeralSessionConfiguration));
    if (ephemeralMethod != NULL) {
      method_setImplementation(ephemeralMethod, originalEphemeralIMP);
    }
    originalEphemeralIMP = NULL;
  }

  isSwizzled = NO;
}

+ (BOOL)canInitWithRequest:(NSURLRequest *)request
{
  if ([NSURLProtocol propertyForKey:kHandledKey inRequest:request]) {
    return NO;
  }

  NSString *scheme = request.URL.scheme.lowercaseString;
  return [scheme isEqualToString:@"http"] || [scheme isEqualToString:@"https"];
}

+ (NSURLRequest *)canonicalRequestForRequest:(NSURLRequest *)request
{
  return request;
}

- (void)startLoading
{
  self.requestId = NSUUID.UUID.UUIDString;
  self.responseData = [NSMutableData data];

  NSMutableURLRequest *mutableRequest = [self.request mutableCopy];
  [NSURLProtocol setProperty:@YES forKey:kHandledKey inRequest:mutableRequest];

  [RNNetworkLoggerNativeTransport emitEvent:@"networkLoggerRequestOpen"
                                       body:@{
                                         @"id" : self.requestId ?: @"",
                                         @"method" : self.request.HTTPMethod ?: @"GET",
                                         @"url" : self.request.URL.absoluteString ?: @""
                                       }];

  NSDictionary<NSString *, NSString *> *headers = self.request.allHTTPHeaderFields;
  [headers enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSString *obj, BOOL *stop) {
    [RNNetworkLoggerNativeTransport emitEvent:@"networkLoggerRequestHeader"
                                         body:@{
                                           @"id" : self.requestId ?: @"",
                                           @"header" : key ?: @"",
                                           @"value" : obj ?: @""
                                         }];
  }];

  NSString *requestBody = @"";
  if (self.request.HTTPBody != nil) {
    requestBody = [[NSString alloc] initWithData:self.request.HTTPBody encoding:NSUTF8StringEncoding] ?: @"";
  }
  [RNNetworkLoggerNativeTransport emitEvent:@"networkLoggerRequestSend"
                                       body:@{ @"id" : self.requestId ?: @"", @"body" : requestBody }];

  NSURLSessionConfiguration *config = [NSURLSessionConfiguration defaultSessionConfiguration];
  config.protocolClasses = @[];

  NSURLSession *session = [NSURLSession sessionWithConfiguration:config
                                                        delegate:self
                                                   delegateQueue:nil];
  self.task = [session dataTaskWithRequest:mutableRequest];
  [self.task resume];
}

- (void)stopLoading
{
  [self.task cancel];
  self.task = nil;
}

- (void)URLSession:(NSURLSession *)session
          dataTask:(NSURLSessionDataTask *)dataTask
didReceiveResponse:(NSURLResponse *)response
 completionHandler:(void (^)(NSURLSessionResponseDisposition disposition))completionHandler
{
  self.capturedResponse = response;

  NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
  NSDictionary *allHeaders = httpResponse.allHeaderFields ?: @{};
  NSMutableDictionary<NSString *, NSString *> *responseHeaders = [NSMutableDictionary dictionary];
  [allHeaders enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
    responseHeaders[[key description]] = [obj description];
  }];

  [RNNetworkLoggerNativeTransport emitEvent:@"networkLoggerResponseHeaders"
                                       body:@{
                                         @"id" : self.requestId ?: @"",
                                         @"contentType" : response.MIMEType ?: @"",
                                         @"responseSize" : @(MAX(response.expectedContentLength, 0)),
                                         @"responseHeaders" : responseHeaders
                                       }];

  [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageNotAllowed];
  completionHandler(NSURLSessionResponseAllow);
}

- (void)URLSession:(NSURLSession *)session
          dataTask:(NSURLSessionDataTask *)dataTask
    didReceiveData:(NSData *)data
{
  if (data != nil) {
    [self.responseData appendData:data];
    [self.client URLProtocol:self didLoadData:data];
  }
}

- (void)URLSession:(NSURLSession *)session
              task:(NSURLSessionTask *)task
didCompleteWithError:(NSError *)error
{
  NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)self.capturedResponse;
  NSInteger statusCode = httpResponse != nil ? httpResponse.statusCode : 0;

  NSString *responseText = @"";
  if (self.responseData.length > 0) {
    responseText = [[NSString alloc] initWithData:self.responseData encoding:NSUTF8StringEncoding] ?: @"";
  }

  [RNNetworkLoggerNativeTransport emitEvent:@"networkLoggerResponse"
                                       body:@{
                                         @"id" : self.requestId ?: @"",
                                         @"status" : @(statusCode),
                                         @"timeout" : @(0),
                                         @"response" : responseText ?: @"",
                                         @"responseURL" : self.request.URL.absoluteString ?: @"",
                                         @"responseType" : @"text"
                                       }];

  if (error != nil) {
    [self.client URLProtocol:self didFailWithError:error];
  } else {
    [self.client URLProtocolDidFinishLoading:self];
  }
}

@end
