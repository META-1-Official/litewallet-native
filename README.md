# nativeapp

### Building Locally

The code is built using React-Native and running code locally requires a Mac or Linux OS.

-   Install [Node.js](https://nodejs.org) 
-   Install the shared React Native dependencies (`React Native CLI`, _not_ `Expo CLI`)
    -   [Docs](https://reactnative.dev/docs/environment-setup)

-   Install [cocoapods](https://guides.cocoapods.org/using/getting-started.html) by running:
    -   Note if running on Apple Silicon install `ruby` via [Homebrew](https://brew.sh). [More](https://stackoverflow.com/a/66556339)
```bash
sudo gem install cocoapods
```
-   Clone this repo and install our dependencies:

```bash
git clone ...
cd nativeapp 
yarn 
cd ios && pod install && cd .. # install pods for iOS
```
-   Then, in one terminal, run:

```bash
yarn start 
```

#### Android

-   Install the Android SDK, via [Android Studio](https://developer.android.com/studio).
-   Install the Android NDK, via [Android Studio](https://developer.android.com/studio)'s SDK Manager.
-   Install the correct emulator
        -   More details can be found [on the Android Developer site](https://developer.android.com/studio/run/emulator)
    -   You should use the following:
        -   **Android OS Version:** Latest, unless told otherwise
        -   **Device:** Google Pixel 3
-   Finally, start the emulator from Android Studio, and run:

```bash
yarn android
```

#### iOS

-   Install the iOS dependencies
-   Install the correct simulator
    -   **iOS OS Version:** Latest, unless told otherwise
    -   **Device:** iPhone 11 Pro

```bash
yarn ios
```
