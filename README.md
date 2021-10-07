# nativeapp

### Building Locally

The code is built using React-Native and running code locally requires a Mac or Linux OS.

-   Install [sentry-cli](https://github.com/getsentry/sentry-cli) tools: `brew install getsentry/tools/sentry-cli`

-   Install [Node.js](https://nodejs.org) **version 10 (latest stable) and yarn@1 (latest)**

    -   If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.

-   Install the shared React Native dependencies (`React Native CLI`, _not_ `Expo CLI`)

    -   [macOS](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies-1)
    -   [Linux](https://facebook.github.io/react-native/docs/getting-started.html#installing-dependencies-2)

-   Install [cocoapods](https://guides.cocoapods.org/using/getting-started.html) by running:

```bash
sudo gem install cocoapods
```

-   _MetaMask Only:_ Rename the `.*.env.example` files (remove the `.example`) in the root of the project and fill in the appropriate values for each key. Get the values from another MetaMask Mobile developer.

-   Clone this repo and install our dependencies:

```bash
git clone ...
cd metamask-mobile
yarn install # this will run a lengthy postinstall flow
cd ios && pod install && cd .. # install pods for iOS
```

-   _Non-MetaMask Only:_ In the project root folder run

```
  cp .ios.env.example .ios.env && \
  cp .android.env.example .android.env && \
  cp .js.env.example .js.env
```

-   _Non-MetaMask Only:_ Create an account and generate your own API key at [Infura](https://infura.io) in order to connect to main and test nets. Fill `MM_INFURA_PROJECT_ID` in `.js.env`. (App will run without it, but will not be able to connect to actual network.)

-   Then, in one terminal, run:

```bash
yarn watch
```
