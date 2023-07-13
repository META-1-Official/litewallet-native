### Changelog

All notable changes to this project will be documented in this file. Dates are displayed in UTC.

#### [INDEV](https://github.com/META-1-Official/litewallet-native/)

> 13 Jul 2023
- Deposit address fix.
  - Remove unused CheckAvailabilityOfAddress
  - Handling error of failing request
- Dex Trade
  - Fixed behaviour of increment/decrement amount buttons
- Send Screen
  - Fix error of number input for ios keyboard
- Trade Screen
  - Swap currencies button has been added

> 4 Dec 2022
- New signIn and signUp flows
  - Update react-native to version 0.70
  - Implementing web3 auth (torus)
  - Implementing biometric verification (face-ki)
  - Integrating with eSignature for signing and payment
  - New signUp flow
  - New signIn flow

> 14 May 2022
- QA Fixes 2 [`#29`](https://github.com/META-1-Official/litewallet-native/pull/29)
  - Fixed keyboard hiding on Link wallet screen on android
  - Changed `password_repeat`'s label to `Confirm Password`
  - Changed validation error for the `same` rule
  - Removed links leading to `CreatePaperWallet`
  - Added a way to opt-out of keyboard events in useScroll

> 13 May 2022
- QA Fixes [`#28`](https://github.com/META-1-Official/litewallet-native/pull/28)
  - Fixed the issue when password comes pre-filled
  - Added a way to override validation message and state
  - Fixed a typo in the `same` rule
  - Fixed mobile number validation
  - Changed the message when no open orders found in `MyOrders`
  - Fixed amount calaulation on `TradeScreen` when amount is typed in by hand
  - Total field in the `CreateLimitOrder` modal is now editable
  - Fixed Submit button paritialy off screen on small devices

#### [v1.1.0](https://github.com/META-1-Official/litewallet-native/compare/v1.0.14...v1.1.0)

> 12 May 2022 (Some changes have been shiped as a part of 1.0.14 for QA)
- New Backend integration [`#27`](https://github.com/META-1-Official/litewallet-native/pull/27)
  - Add password field to link wallet step 
  - Remove api based createPaperWallet
  - Combine api wrappers
  - Always register, always load notifications (testnet support)
  - Bug that caused duplicate price alerts to show up should be fixed on the backend

- Remove meta1dex testnet pkg [`#26`](https://github.com/META-1-Official/litewallet-native/pull/26)
  
> ##### Probably been shiped under 1.0.14 version
- Navigation back changed & Refactor notifications refresh control and auto-update [`#25`](https://github.com/META-1-Official/litewallet-native/pull/25)
- Go back from send screen [`#24`](https://github.com/META-1-Official/litewallet-native/pull/24)
- Bump plist from 3.0.4 to 3.0.5 [`#22`](https://github.com/META-1-Official/litewallet-native/pull/22)
- Bump async from 2.6.3 to 2.6.4 [`#23`](https://github.com/META-1-Official/litewallet-native/pull/23)
- Testnet support & housekeeping [`#21`](https://github.com/META-1-Official/litewallet-native/pull/21)
- Fix text disapearing after app minimize [`#20`](https://github.com/META-1-Official/litewallet-native/pull/20)
- Password validation rules [`#19`](https://github.com/META-1-Official/litewallet-native/pull/19)
- Country picker [`#18`](https://github.com/META-1-Official/litewallet-native/pull/18)
- Create Paper Wallet overhaul [`#17`](https://github.com/META-1-Official/litewallet-native/pull/17)
- Fix avatar upload on android [`#16`](https://github.com/META-1-Official/litewallet-native/pull/16)
- Fix helper text disapearing after app state change from backgound to active on IOS [`#15`](https://github.com/META-1-Official/litewallet-native/pull/15)
- React navigation accesability [`#14`](https://github.com/META-1-Official/litewallet-native/pull/14)
- General avatar functionality overhaul [`#13`](https://github.com/META-1-Official/litewallet-native/pull/13)
- Trade fixes [`#12`](https://github.com/META-1-Official/litewallet-native/pull/12)
- User avatars [`#11`](https://github.com/META-1-Official/litewallet-native/pull/11)
- Trade from ticker [`#10`](https://github.com/META-1-Official/litewallet-native/pull/10)
- Add list of countries [`f506080`](https://github.com/META-1-Official/litewallet-native/commit/f50608052164a81ae0d7431476f8c66da425db91)
- Create RenderPdf component [`a425483`](https://github.com/META-1-Official/litewallet-native/commit/a425483be06cb23280c2270648532c6a76a3b9ab)
- More ram for gradlew + clean ios [`9bc6247`](https://github.com/META-1-Official/litewallet-native/commit/9bc62479a4e2dbc6c2282e99219181f0c5b5ab78)

#### [v1.0.14](https://github.com/META-1-Official/litewallet-native/compare/v1.0.13...v1.0.14)

> 6 April 2022

- Hide xlm and bnb form receive [`#9`](https://github.com/META-1-Official/litewallet-native/pull/9)
- Registration loader [`#8`](https://github.com/META-1-Official/litewallet-native/pull/8)
- Fix balance layout overflow [`#7`](https://github.com/META-1-Official/litewallet-native/pull/7)
- Chore testids [`#6`](https://github.com/META-1-Official/litewallet-native/pull/6)
- Fixes & Enhancements [`#4`](https://github.com/META-1-Official/litewallet-native/pull/4)
- 1.0.11 fdroid [`#5`](https://github.com/META-1-Official/litewallet-native/pull/5)
- react-native-reload is some how missing? [`e5860ff`](https://github.com/META-1-Official/litewallet-native/commit/e5860ff1380597e9af4c4c83110ccaab6265fb89)
- Build react-native-reanimated from source [`2b6f70b`](https://github.com/META-1-Official/litewallet-native/commit/2b6f70b6157688a691621d385c2e732b4a218198)
- Don't build for hermes [`85ea5a3`](https://github.com/META-1-Official/litewallet-native/commit/85ea5a38f9ca390bf6880d1460e4faa3db481ad1)

#### [v1.0.13](https://github.com/META-1-Official/litewallet-native/compare/v1.0.12...v1.0.13)

> 30 March 2022

- Bump node-fetch from 2.6.5 to 2.6.7 [`#2`](https://github.com/META-1-Official/litewallet-native/pull/2)
- Bump minimist from 1.2.5 to 1.2.6 [`#3`](https://github.com/META-1-Official/litewallet-native/pull/3)
- Add license [`#1`](https://github.com/META-1-Official/litewallet-native/pull/1)
- Update yarn.lock [`7d6eed2`](https://github.com/META-1-Official/litewallet-native/commit/7d6eed237cc9c4ea9de1da72d266796b1957848c)
- Update yarn.lock [`1a60138`](https://github.com/META-1-Official/litewallet-native/commit/1a601385b5c33744035bc7e7976919e2e06af777)
- builds [`929b790`](https://github.com/META-1-Official/litewallet-native/commit/929b790437285f4c4a14dba961b7af3da11b43de)

#### [v1.0.12](https://github.com/META-1-Official/litewallet-native/compare/v1.0.11...v1.0.12)

> 23 March 2022

- Change version [`b1f2672`](https://github.com/META-1-Official/litewallet-native/commit/b1f26725d5f915818fb9f8ed9ca29fe051bd1fa6)
- Real fee is 0.00002 META1 [`37c43a7`](https://github.com/META-1-Official/litewallet-native/commit/37c43a74c9c6eca59cc03522b9403c51ca87d85f)
- Trade: reset amount on asset change [`36308ea`](https://github.com/META-1-Official/litewallet-native/commit/36308ea4d89e2ff74ad0a564757d5ae352f8a579)

#### [v1.0.11](https://github.com/META-1-Official/litewallet-native/compare/v1.0.10...v1.0.11)

> 16 March 2022

- Update @types/jest [`cbd9446`](https://github.com/META-1-Official/litewallet-native/commit/cbd9446488b3fdcf3218d69d7ff2470132d0d059)
- Add error utils [`45e0a7c`](https://github.com/META-1-Official/litewallet-native/commit/45e0a7ca9ad95ab371d73cbd0e3c7c614c1f7b70)
- Refactor Expected error handling [`e5d1d0c`](https://github.com/META-1-Official/litewallet-native/commit/e5d1d0c41344cea44eb2152f8c92ab5098b68cc2)

#### [v1.0.10](https://github.com/META-1-Official/litewallet-native/compare/v1.0.9...v1.0.10)

> 14 March 2022

- Relable accesablilityLables to include testID [`293a376`](https://github.com/META-1-Official/litewallet-native/commit/293a376f0a64e83b2a44b79becbe6d9ad6ca71fc)
- Update Readme [`a20c038`](https://github.com/META-1-Official/litewallet-native/commit/a20c0384b74c22bedbcc9ec28f62d464f3f19283)
- Lint fix [`cb9d1fa`](https://github.com/META-1-Official/litewallet-native/commit/cb9d1faca8acc89f50541ef79da3c479e3ee2914)

#### [v1.0.9](https://github.com/META-1-Official/litewallet-native/compare/v1.0.8...v1.0.9)

> 9 March 2022

- Add accessibilityLabels for TouchableOpacity [`885c390`](https://github.com/META-1-Official/litewallet-native/commit/885c390d260cb0d7fc356d6a6b1c79595172c302)
- Named release [`e1145ae`](https://github.com/META-1-Official/litewallet-native/commit/e1145ae32df8409c6cc6e45e319fa3ab0ab92078)
- Fix some warnings [`88407ff`](https://github.com/META-1-Official/litewallet-native/commit/88407ffb70d0039819fb017d367933d5d7657210)

#### [v1.0.8](https://github.com/META-1-Official/litewallet-native/compare/v1.0.7...v1.0.8)

> 4 March 2022

- Xcode... [`1ff77d9`](https://github.com/META-1-Official/litewallet-native/commit/1ff77d9b2a354fd727c8166eef1a934f69d262bf)
- Success modal for send [`88b459d`](https://github.com/META-1-Official/litewallet-native/commit/88b459dad00c271d5c8bf7b182e930e97156259b)
- Clear keychain on first app launch [`63f2086`](https://github.com/META-1-Official/litewallet-native/commit/63f20868b29757c50472b730885b0e6f5858c12a)

#### [v1.0.7](https://github.com/META-1-Official/litewallet-native/compare/v1.0.6...v1.0.7)

> 1 March 2022

- Update sandbox [`b886a01`](https://github.com/META-1-Official/litewallet-native/commit/b886a013429c2caa6c23c7e64ff6ddd2242e3e55)
- Add debug sandbox [`573d2e9`](https://github.com/META-1-Official/litewallet-native/commit/573d2e97bfea2ae1da7f1be6245f5cc05827c8a3)
- Alternative method to show loader modal [`8dde87f`](https://github.com/META-1-Official/litewallet-native/commit/8dde87fab3b6b0369bee62fa7f1e26fa546ac994)

#### [v1.0.6](https://github.com/META-1-Official/litewallet-native/compare/1.0.5...v1.0.6)

> 27 February 2022

#### [1.0.5](https://github.com/META-1-Official/litewallet-native/compare/v1.0.5...1.0.5)

> 27 February 2022

- Nullable useAssetPicker, useAsset, useAssetPair [`020ec27`](https://github.com/META-1-Official/litewallet-native/commit/020ec278f238bb94b6c7c12ebee02525b4cec334)
- Update build script and bump version [`a41f96f`](https://github.com/META-1-Official/litewallet-native/commit/a41f96f5e52a3a40829a5bc3806faef88d153f67)
- Version bump to 1.0.6 [`eefee0e`](https://github.com/META-1-Official/litewallet-native/commit/eefee0ea3f13981543c6cc4f9f8f712d38de976d)

### [v1.0.5](https://github.com/META-1-Official/litewallet-native/compare/v0.1.1...v1.0.5)

> 24 February 2022

- Keyboard aware useScroll [`1bbfd0c`](https://github.com/META-1-Official/litewallet-native/commit/1bbfd0cf6c42dc8e077dcbea24874a5c6e4f7a48)
- Add bump cmd [`1781e37`](https://github.com/META-1-Official/litewallet-native/commit/1781e37f8160882b5b25b0afc7caa97aa963cbc4)
- Register one error at a time [`f43839e`](https://github.com/META-1-Official/litewallet-native/commit/f43839ee3968a36d0c63bbb8b65e9bb0c9a6e3ed)

#### [v0.1.1](https://github.com/META-1-Official/litewallet-native/compare/v0.1.0...v0.1.1)

> 23 February 2022

#### v0.1.0

> 23 February 2022

- Switching to hermes [`#30`](https://github.com/META-1-Official/litewallet-native/pull/30)
- Paper wallet [`#28`](https://github.com/META-1-Official/litewallet-native/pull/28)
- Reinit app [`18918d8`](https://github.com/META-1-Official/litewallet-native/commit/18918d80d3b5183ffe2fb97a552aba3f70c842ae)
- Add bruhchart [`76ec149`](https://github.com/META-1-Official/litewallet-native/commit/76ec14937b2924d614b19a0f632c22a4db6ed8bf)
- Rewrite Create Order Modal [`dfb6c2f`](https://github.com/META-1-Official/litewallet-native/commit/dfb6c2fc38b041162bdcdc3cae5fe9d001885980)
