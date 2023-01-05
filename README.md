# react-native-network-logger [![GitHub stars](https://img.shields.io/github/stars/alexbrazier/react-native-network-logger?label=Star%20Project&style=social)](https://github.com/alexbrazier/react-native-network-logger/stargazers)

[![CI](https://github.com/alexbrazier/react-native-network-logger/workflows/CI/badge.svg)](https://github.com/alexbrazier/react-native-network-logger/actions)
[![Dependencies](https://img.shields.io/badge/dependencies-none-green)](https://www.npmjs.com/package/react-native-network-logger?activeTab=dependencies)
[![npm](https://img.shields.io/npm/v/react-native-network-logger)](https://www.npmjs.com/package/react-native-network-logger)
[![npm bundle size](https://img.shields.io/bundlephobia/min/react-native-network-logger)](https://bundlephobia.com/result?p=react-native-network-logger)
[![npm downloads](https://img.shields.io/npm/dm/react-native-network-logger)](https://www.npmjs.com/package/react-native-network-logger)
[![License](https://img.shields.io/npm/l/react-native-network-logger)](./LICENSE)

An HTTP traffic monitor for React Native including in app interface.

An alternative to Wormholy but for both iOS and Android and with zero native dependencies.

If this project has helped you out, please support us with a star 🌟.

## Features

- Log networks requests on iOS and Android
- View network requests made with in app viewer
- Debug network requests on release builds
- Individually view request/response headers and body
- Copy or share headers, body or full request
- Share cURL representation of request
- Zero native or JavaScript dependencies
- Built in TypeScript definitions
- Extracts GraphQL operation name
- Export all logs in HAR format

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

```ts
import { startNetworkLogging } from 'react-native-network-logger';

startNetworkLogging();
AppRegistry.registerComponent('App', () => App);
```

### Display Requests and Responses

```ts
import NetworkLogger from 'react-native-network-logger';

const MyScreen = () => <NetworkLogger />;
```

#### Themes

You can change between the dark and light theme by passing the `theme` prop with `"dark"` or `"light"`.

```ts
import NetworkLogger from 'react-native-network-logger';

const MyScreen = () => <NetworkLogger theme="dark" />;
```

If preferred you can also override the theme entirely by passing in a theme object.

> Note: breaking theme changes are not guaranteed to follow semver for updates

```ts
import NetworkLogger from 'react-native-network-logger';

const MyScreen = () => (
  <NetworkLogger
    theme={{
      colors: {
        background: 'red',
      },
    }}
  />
);
```

### Logging options

#### Max Requests

You can configure the max number of requests stored on the device using by calling `startNetworkLogging` with the `maxRequests` option. The default is `500`.

```ts
startNetworkLogging({ maxRequests: 500 });
```

#### Ignored Hosts

You can configure hosts that should be ignored by calling `startNetworkLogging` with the `ignoredHosts` option.

```ts
startNetworkLogging({ ignoredHosts: ['test.example.com'] });
```

#### Ignored Urls

You can configure urls that should be ignored by calling `startNetworkLogging` with the `ignoredUrls` option.

```ts
startNetworkLogging({ ignoredUrls: ['https://test.example.com/page'] });
```

#### Ignored Patterns

You can configure url patterns, including methods that should be ignored by calling `startNetworkLogging` with the `ignoredPatterns` option.

```ts
startNetworkLogging({
  ignoredPatterns: [/^GET http:\/\/test\.example\.com\/pages\/.*$/],
});
```

The pattern to match with is the method followed by the url, e.g. `GET http://example.com/test` so you can use the pattern to match anything, e.g. ignoring all HEAD requests.

```ts
startNetworkLogging({
  // Ignore all HEAD requests
  ignoredPatterns: [/^HEAD /],
});
```

#### Sorting

Set the sort order of requests. Options are `asc` or `desc`, default is `desc` (most recent at the top).

```tsx
import NetworkLogger from 'react-native-network-logger';

const MyScreen = () => <NetworkLogger sort="asc" />;
```

#### Force Enable

If you are running another network logging interceptor, e.g. Reactotron, the logger will not start as only one can be run at once. You can override this behaviour and force the logger to start by using the `forceEnable` option.

```ts
startNetworkLogging({ forceEnable: true });
```

#### Integrate with existing navigation

Use your existing back button (e.g. in your navigation header) to navigate within the network logger.

```tsx
import NetworkLogger, { getBackHandler } from 'react-native-network-logger';

const navigation = useNavigation();
const onBack = getBackHandler(navigation.goBack);

const MyScreen = () => (
  <Screen onBackPressed={onBack}>
    <NetworkLogger />
  </Screen>
);
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

## Why

Network requests can be debugged using tools such as React Native Debugger, however this requires both a debug build of the app and the debugger to be enabled. This library can be built with you app and usable by anyone using your app to see network issues and report them back to developers.

As the library is very small you can safely bundle it with the production version of your app and put it behind a flag, or have a separate testing build of the app which has the network logger enabled.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
