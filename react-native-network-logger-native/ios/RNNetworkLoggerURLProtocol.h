#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNNetworkLoggerURLProtocol : NSURLProtocol
+ (void)installInterception;
+ (void)uninstallInterception;
@end

NS_ASSUME_NONNULL_END
