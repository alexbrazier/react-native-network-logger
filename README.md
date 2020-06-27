# react-native-network-logger [![GitHub stars](https://img.shields.io/github/stars/alexbrazier/react-native-network-logger?label=Star%20Project&style=social)](https://github.com/alexbrazier/react-native-network-logger/stargazers)

[![CircleCI](https://img.shields.io/circleci/build/gh/alexbrazier/react-native-network-logger)](https://circleci.com/gh/alexbrazier/react-native-network-logger)
[![Dependencies](https://img.shields.io/david/alexbrazier/react-native-network-logger)](https://david-dm.org/alexbrazier/react-native-network-logger)
[![npm](https://img.shields.io/npm/v/react-native-network-logger)](https://www.npmjs.com/package/react-native-network-logger)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-native-network-logger)](https://bundlephobia.com/result?p=react-native-network-logger)
[![npm downloads](https://img.shields.io/npm/dw/react-native-network-logger)](https://www.npmjs.com/package/react-native-network-logger)
[![License](https://img.shields.io/npm/l/react-native-network-logger)](./LICENSE)

An HTTP traffic monitor for React Native including in app interface.

An alternative to Wormholy but for both iOS and Android and with zero native dependencies.

## Features

- Log networks requests on iOS and Android
- View network requests made with in app viewer
- Debug network requests on release builds
- Individually view headers sent, received and body sent and received
- Copy or share headers, body or full request
- Share cURL representation of request
- Zero native or JavaScript dependencies
- Built in TypeScript definitions

## Screenshots

### iOS

<p float="left" align="center">
  <img src="https://raw.githubusercontent.com/alexbrazier/react-native-network-logger/master/.github/images/ios-list.png" width="300" />
  <img src="https://raw.githubusercontent.com/alexbrazier/react-native-network-logger/master/.github/images/ios-details.png" width="300" /> 
</p>
<p float="left" align="center">
  <img src="https://raw.githubusercontent.com/alexbrazier/react-native-network-logger/master/.github/images/ios-list-dark.png" width="300" />
  <img src="https://raw.githubusercontent.com/alexbrazier/react-native-network-logger/master/.github/images/ios-details-dark.png" width="300" /> 
</p>

### Android

<p float="left" align="center">
  <img src="https://raw.githubusercontent.com/alexbrazier/react-native-network-logger/master/.github/images/android-list.png" width="300" />
  <img src="https://raw.githubusercontent.com/alexbrazier/react-native-network-logger/master/.github/images/android-details.png" width="300" /> 
</p>
<p float="left" align="center">
  <img src="https://raw.githubusercontent.com/alexbrazier/react-native-network-logger/master/.github/images/android-list-dark.png" width="300" />
  <img src="https://raw.githubusercontent.com/alexbrazier/react-native-network-logger/master/.github/images/android-details-dark.png" width="300" /> 
</p>

## Setup

### Install

```bash
yarn add react-native-network-logger
```

or

```
npm install --save react-native-network-logger
```

### Start Logging

Call `startNetworkLogging` in your apps entry point to log every request, or call it on a button press to manually trigger it.

```js
import { startNetworkLogging } from 'react-native-network-logger';

startNetworkLogging();
AppRegistry.registerComponent('App', () => App);
```

### Display Requests and Responses

```js
import NetworkLogger from 'react-native-network-logger';

const MyScreen = () => <NetworkLogger />;
```

#### Themes

You can change between the dark and light theme by passing the `theme` prop with `"dark"` or `"light"`.

```js
import NetworkLogger from 'react-native-network-logger';

const MyScreen = () => <NetworkLogger theme="dark" />;
```

### Logging options

You can configure the max number of requests stored on the device using by calling `startNetworkLogging` with the `maxRequests` option. The default is `500`.

```js
startNetworkLogging({ maxRequests: 500 });
```

## Example App

To test the example app, after cloning the repo, install the required dependencies by running:

```sh
yarn bootstrap
```

Then start the example app by running:

```sh
yarn example start
```

You should then be able to open the expo server at http://localhost:3000/ and launch the app on iOS or Android.

For more setup and development details, see [Contributing](#Contributing).

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
