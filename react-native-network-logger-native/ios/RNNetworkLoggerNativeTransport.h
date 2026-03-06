#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNNetworkLoggerNativeTransport : RCTEventEmitter <RCTBridgeModule>
+ (void)emitEvent:(NSString *)name body:(NSDictionary *)body;
@end

NS_ASSUME_NONNULL_END
