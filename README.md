# nativeapp

### Building Locally

The code is built using React-Native and running code locally requires a Mac or Linux OS.

-   Install [Node.js](https://nodejs.org) **version 10 (latest stable) and yarn@1 (latest)**
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
