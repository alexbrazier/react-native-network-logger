# react-native-network-logger-native

Native transport plugin for `react-native-network-logger`.

## Usage

```ts
import { startNetworkLogging } from 'react-native-network-logger';
import { registerNativeNetworkLoggerTransport } from 'react-native-network-logger-native';

registerNativeNetworkLoggerTransport();
startNetworkLogging({ transport: 'native' });
```

The plugin registers a `native` transport that captures native networking (iOS `NSURLSession`, Android `OkHttp` used by React Native networking).
