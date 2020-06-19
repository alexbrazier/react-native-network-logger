# react-native-network-logger

[![CircleCI](https://img.shields.io/circleci/build/gh/alexbrazier/react-native-network-logger)](https://circleci.com/gh/alexbrazier/react-native-network-logger)
[![Dependencies](https://img.shields.io/david/alexbrazier/react-native-network-logger)](https://david-dm.org/alexbrazier/react-native-network-logger)
[![npm](https://img.shields.io/npm/v/react-native-network-logger)](https://www.npmjs.com/package/react-native-network-logger)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-native-network-logger)](https://bundlephobia.com/result?p=react-native-network-logger)
[![npm downloads](https://img.shields.io/npm/dw/react-native-network-logger)](https://www.npmjs.com/package/react-native-network-logger)
[![License](https://img.shields.io/npm/l/react-native-network-logger)](./LICENSE)

An HTTP traffic monitor for React Native including in app interface

An alternative to Wormholy but for iOS and Android and with zero native dependencies

## Features

- Log networks requests on iOS and Android
- View network requests made in app
- Debug network requests on release builds
- Individually view headers sent, received and body sent and received
- Zero native or JavaScript dependencies
- Built in TypeScript definitions

## Install

```bash
yarn add react-native-network-logger
# OR
npm install --save react-native-network-logger
```

## Start Logging

Call `startNetworkLogging` in your apps entry point to log every request, or call it on a button press to manually trigger it.

```js
import { startNetworkLogging } from 'react-native-network-logger';

startNetworkLogging();
AppRegistry.registerComponent('App', () => App);
```

## Display Requests and Responses

```js
import NetworkLogger from 'react-native-network-logger';

render() {
    return(<NetworkLogger/>)
}
```
