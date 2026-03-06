#import "RNNetworkLoggerNativeTransport.h"
#import "RNNetworkLoggerURLProtocol.h"

static __weak RNNetworkLoggerNativeTransport *sharedEmitter = nil;
static BOOL isRunning = NO;

@implementation RNNetworkLoggerNativeTransport

RCT_EXPORT_MODULE()

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[
    @"networkLoggerRequestOpen",
    @"networkLoggerRequestHeader",
    @"networkLoggerRequestSend",
    @"networkLoggerResponseHeaders",
    @"networkLoggerResponse"
  ];
}

- (void)startObserving
{
  sharedEmitter = self;
}

- (void)stopObserving
{
  if (sharedEmitter == self) {
    sharedEmitter = nil;
  }
}

+ (void)emitEvent:(NSString *)name body:(NSDictionary *)body
{
  if (sharedEmitter == nil) {
    return;
  }
  [sharedEmitter sendEventWithName:name body:body];
}

RCT_EXPORT_METHOD(start)
{
  if (isRunning) {
    return;
  }
  [RNNetworkLoggerURLProtocol installInterception];
  [NSURLProtocol registerClass:[RNNetworkLoggerURLProtocol class]];
  isRunning = YES;
}

RCT_EXPORT_METHOD(stop)
{
  if (!isRunning) {
    return;
  }
  [NSURLProtocol unregisterClass:[RNNetworkLoggerURLProtocol class]];
  [RNNetworkLoggerURLProtocol uninstallInterception];
  isRunning = NO;
}

RCT_EXPORT_METHOD(makeNativeTestRequest:(NSString *)urlString)
{
  if (urlString == nil || urlString.length == 0) {
    return;
  }

  NSURL *url = [NSURL URLWithString:urlString];
  if (url == nil) {
    return;
  }

  NSURLSessionDataTask *task =
      [[NSURLSession sharedSession] dataTaskWithURL:url
                                  completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                                    // no-op: this endpoint is just used to validate interception.
                                  }];
  [task resume];
}

@end
