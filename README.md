# react-native-network-logger

An HTTP traffic monitor for React Native
An alternative to Wormholy but for iOS and Android and with zero native dependencies

## Start Logging

Call `startNetworkLogging` in your apps entry point to log every request, or call it on a button press to manually trigger it.

```js
import { startNetworkLogging } from 'react-native-network-logger';

startNetworkLogging();
AppRegistry.registerComponent('App', () => App);
```

## Display Requests and Responses

```js
import NetworkMonitor from 'react-native-network-logger';

render() {
    return(<NetworkMonitor/>)
}
```
