

## [1.14.1](https://github.com/alexbrazier/react-native-network-logger/compare/v1.14.0...v1.14.1) (2023-03-16)


### Bug Fixes

* Issue with response body not loading on ios on RN 0.71.x ([#74](https://github.com/alexbrazier/react-native-network-logger/issues/74)) ([1d503bb](https://github.com/alexbrazier/react-native-network-logger/commit/1d503bbd1503a09faaa2ff9bf374655df39bf3e4)), closes [#73](https://github.com/alexbrazier/react-native-network-logger/issues/73)

# [1.14.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.13.0...v1.14.0) (2023-01-05)


### Features

* Add options to ignore specific urls and regex  patterns ([#70](https://github.com/alexbrazier/react-native-network-logger/issues/70)) ([5ee6c3e](https://github.com/alexbrazier/react-native-network-logger/commit/5ee6c3e84408d7338e5549e14a5f25d184cc1dee))

# [1.13.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.12.0...v1.13.0) (2022-08-20)


### Features

* Add option to export all logs as HAR ([#36](https://github.com/alexbrazier/react-native-network-logger/issues/36)) ([c3b7dda](https://github.com/alexbrazier/react-native-network-logger/commit/c3b7ddaf56f2714dab07d2b8094b38faf674c1d9))

# [1.12.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.11.0...v1.12.0) (2021-11-02)


### Features

* Add ability to set custom theme ([#60](https://github.com/alexbrazier/react-native-network-logger/issues/60)) ([75598c0](https://github.com/alexbrazier/react-native-network-logger/commit/75598c03e55f3525c58b5bbc945496918e135494))

# [1.11.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.10.1...v1.11.0) (2021-08-24)


### Features

* Warn if the logger doesn't start due to duplicate logger ([#56](https://github.com/alexbrazier/react-native-network-logger/issues/56)) ([35b54e0](https://github.com/alexbrazier/react-native-network-logger/commit/35b54e08c33e4a32ff61d253fecd82697abbca69))

## [1.10.1](https://github.com/alexbrazier/react-native-network-logger/compare/v1.10.0...v1.10.1) (2021-07-29)


### Bug Fixes

* Disable the logger if used on a web project ([#53](https://github.com/alexbrazier/react-native-network-logger/issues/53)) ([800c948](https://github.com/alexbrazier/react-native-network-logger/commit/800c94872219922c35a633fa53046fd43a29a09b))

# [1.10.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.9.0...v1.10.0) (2021-06-27)


### Features

* Add basic support for GraphQL ([#49](https://github.com/alexbrazier/react-native-network-logger/issues/49)) ([6c11bb2](https://github.com/alexbrazier/react-native-network-logger/commit/6c11bb2b7b887fa75aead0fde44523aced84d62b))

# [1.9.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.8.1...v1.9.0) (2021-05-06)


### Features

* Add `ignoredHosts` option to ignore specified hosts ([#47](https://github.com/alexbrazier/react-native-network-logger/issues/47)) ([8eb6dd6](https://github.com/alexbrazier/react-native-network-logger/commit/8eb6dd6c2d953d5bb1f92bab9eac8a1f289af39b))

## [1.8.1](https://github.com/alexbrazier/react-native-network-logger/compare/v1.8.0...v1.8.1) (2020-11-04)


### Bug Fixes

* dont try and update unmounted component ([#38](https://github.com/alexbrazier/react-native-network-logger/issues/38)) ([59af7e9](https://github.com/alexbrazier/react-native-network-logger/commit/59af7e95af79463efe7d7540b76e4110b1af5dca))

# [1.8.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.7.0...v1.8.0) (2020-10-06)


### Bug Fixes

* Request not showing up until response received ([#33](https://github.com/alexbrazier/react-native-network-logger/issues/33)) ([4b3ab62](https://github.com/alexbrazier/react-native-network-logger/commit/4b3ab62d3279d4917f1c0a159f6d1cb03ea70812))


### Features

* Changed inflight status color to text color ([#30](https://github.com/alexbrazier/react-native-network-logger/issues/30)) ([563ac95](https://github.com/alexbrazier/react-native-network-logger/commit/563ac95ba685ecd784379f3cb8656625ea3abd48))

# [1.7.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.6.0...v1.7.0) (2020-09-22)


### Features

* Add search box to filter Requests by URL ([#28](https://github.com/alexbrazier/react-native-network-logger/issues/28)) ([e1cbe9a](https://github.com/alexbrazier/react-native-network-logger/commit/e1cbe9adef14b5297cb5b54584b98c8f9173e64c))
* Grouped the Request and Response Sections ([#25](https://github.com/alexbrazier/react-native-network-logger/issues/25)) ([b3ca2e3](https://github.com/alexbrazier/react-native-network-logger/commit/b3ca2e30cbbc4102b7be1b03d164c8a019226658))

# [1.6.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.5.0...v1.6.0) (2020-09-13)


### Bug Fixes

* Remember scroll position when navigating back to requests ([#22](https://github.com/alexbrazier/react-native-network-logger/issues/22)) ([91e6768](https://github.com/alexbrazier/react-native-network-logger/commit/91e67682c25b562339d28316876b34cf953902a1))
* Request details close button overlap ([#23](https://github.com/alexbrazier/react-native-network-logger/issues/23)) ([7c21317](https://github.com/alexbrazier/react-native-network-logger/commit/7c21317a2073160bdff17fd930ac4ecc27b4c3de))


### Features

* Add option to use existing back button to navigate ([#24](https://github.com/alexbrazier/react-native-network-logger/issues/24)) ([054167f](https://github.com/alexbrazier/react-native-network-logger/commit/054167f67303c1b3cdb18710d477211811c4e760))

# [1.5.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.4.1...v1.5.0) (2020-07-27)


### Bug Fixes

* Issue when sending request with FormData ([1c2ea1c](https://github.com/alexbrazier/react-native-network-logger/commit/1c2ea1ce7aa30f2836c10747033dab6a63215b10))
* Issue when sharing request that isn't json ([202c31d](https://github.com/alexbrazier/react-native-network-logger/commit/202c31dae94f05b0f56f7e74be3c7e0e30f3933a))


### Features

* Add option to change sort order and set default to desc ([#14](https://github.com/alexbrazier/react-native-network-logger/issues/14)) ([3aedb0c](https://github.com/alexbrazier/react-native-network-logger/commit/3aedb0c1effc3d3bd7b5f9c95aac28050f482d5b))

## [1.4.1](https://github.com/alexbrazier/react-native-network-logger/compare/v1.4.0...v1.4.1) (2020-07-16)


### Bug Fixes

* Issue with event listeners ([430eefd](https://github.com/alexbrazier/react-native-network-logger/commit/430eefd79477966edb22c1e395b122aac0f4d8fa))
* Remove type imports/exports to fix for older TS versions ([#17](https://github.com/alexbrazier/react-native-network-logger/issues/17)) ([f4cbefa](https://github.com/alexbrazier/react-native-network-logger/commit/f4cbefa7afe0988818134482b6d0ea46ae77efcd))

# [1.4.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.3.2...v1.4.0) (2020-06-28)


### Bug Fixes

* Issue causing delay to updates when viewing logger page ([427e13c](https://github.com/alexbrazier/react-native-network-logger/commit/427e13ce017137ab6c6be05ac51b647b443ffe86))


### Features

* Add option to clear all requests ([506cd23](https://github.com/alexbrazier/react-native-network-logger/commit/506cd23769f9ef02b4b299abd0a9fd426b0fc628))
* Add option to configure max requests stored and set default to 500 ([c75f926](https://github.com/alexbrazier/react-native-network-logger/commit/c75f926d478323bea46348ba9de77277c3e66fca))
* Show request time on logs ([d9115fd](https://github.com/alexbrazier/react-native-network-logger/commit/d9115fd2b2cbb12b88f885248d6496d4e1cd0888))

## [1.3.2](https://github.com/alexbrazier/react-native-network-logger/compare/v1.3.1...v1.3.2) (2020-06-25)


### Bug Fixes

* Issue with large response not rendering on iOS ([#9](https://github.com/alexbrazier/react-native-network-logger/issues/9)) ([a604d03](https://github.com/alexbrazier/react-native-network-logger/commit/a604d039ed7549e2557d98a902fdf49f279a2048))

## [1.3.1](https://github.com/alexbrazier/react-native-network-logger/compare/v1.3.0...v1.3.1) (2020-06-24)


### Bug Fixes

* curl export to add data and escape characters ([82931b5](https://github.com/alexbrazier/react-native-network-logger/commit/82931b5817714a6c231fdd7d845bc0383a46bd4a))
* Error when viewing request that has error, closes [#7](https://github.com/alexbrazier/react-native-network-logger/issues/7) ([f0bdd3d](https://github.com/alexbrazier/react-native-network-logger/commit/f0bdd3d4735b5329fe844d27e2754783731f3478))
* Improve accessibility with voiceover and talkback ([ed4339b](https://github.com/alexbrazier/react-native-network-logger/commit/ed4339b022279dd0f154343dcc0761e646c88152))

# [1.3.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.2.1...v1.3.0) (2020-06-22)


### Features

* Add share buttons to share part or full requests, including cURL ([3425d7d](https://github.com/alexbrazier/react-native-network-logger/commit/3425d7d8923eebcf815b2dbb93f0fbfef6918c42)), closes [#2](https://github.com/alexbrazier/react-native-network-logger/issues/2)

## [1.2.1](https://github.com/alexbrazier/react-native-network-logger/compare/v1.2.0...v1.2.1) (2020-06-22)


### Bug Fixes

* Typescript declarations path ([4f5bcb4](https://github.com/alexbrazier/react-native-network-logger/commit/4f5bcb40f4a18ec3c20173d06a30cb7cb9b342b8))

# [1.2.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.1.0...v1.2.0) (2020-06-20)


### Features

* Make themeable and add dark theme ([e5fcad6](https://github.com/alexbrazier/react-native-network-logger/commit/e5fcad6492dc5a4e8674bac68a22c8a826018c76))

# [1.1.0](https://github.com/alexbrazier/react-native-network-logger/compare/v1.0.3...v1.1.0) (2020-06-20)


### Bug Fixes

* Parse blob http responses, closes [#1](https://github.com/alexbrazier/react-native-network-logger/issues/1) ([e845a29](https://github.com/alexbrazier/react-native-network-logger/commit/e845a29f6b9a70db2732189167c6ae44d7f5741d))


### Features

* Add duration to request ([f43d3da](https://github.com/alexbrazier/react-native-network-logger/commit/f43d3da45156ecd0fee7d3a33f61cae105176570))
* Redesign ([378bf56](https://github.com/alexbrazier/react-native-network-logger/commit/378bf56b1a11c4934f6e3b424058d704fbb043ab))



## [1.0.3](https://github.com/alexbrazier/react-native-network-logger/compare/v1.0.3...v1.1.0) (2020-06-19)


### Bug Fixes

* Typescript export location ([0e7cbe7](https://github.com/alexbrazier/react-native-network-logger/commit/0e7cbe76be6ef4be013cad27f94997462427d40a))



## [1.0.2](https://github.com/alexbrazier/react-native-network-logger/compare/v1.0.3...v1.1.0) (2020-06-19)


### Bug Fixes

* exported component issue ([098f941](https://github.com/alexbrazier/react-native-network-logger/commit/098f9411115abfe7334647dcd61d0b96107fc4ad))



## [1.0.1](https://github.com/alexbrazier/react-native-network-logger/compare/v1.0.3...v1.1.0) (2020-06-19)