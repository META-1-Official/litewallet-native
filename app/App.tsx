import React, { useEffect, useState, useRef } from 'react';
import 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import {
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';

import { Options, useOptions, useStore } from './store';
import { Connect } from './services/meta1Api';
import { DexNav } from './WalletNav';
import Loader from './components/Loader';
import * as Sentry from '@sentry/react-native';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import { SENTRY_DSN } from '@env';
import { Alert, LogBox } from 'react-native';

import AuthNav from './AuthNav';
import { createStore } from './store/createStore';

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

useOptions.persist.rehydrate().then(() => {
  // if (SENTRY_DSN && Options.get('sentryEnabled')) {
  console.log('--- SENTRY INIT ---');
  Sentry.init({
    dsn: SENTRY_DSN,
    // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
    // We recommend adjusting this value in production.
    tracesSampleRate: 1.0,
    // integrations: [
    //   new Sentry.ReactNativeTracing({
    //     // Pass instrumentation to be used as `routingInstrumentation`
    //     routingInstrumentation,
    //     // ...
    //   }),
    // ],
  });
  // }
});

setJSExceptionHandler((e, _fatal) => {
  console.log('GEH', e);
  if (e.message === 'ACCOUNT_NOT_FOUND') {
    RNRestart.Restart();
  }
}, true);

async function EnableSentryPrompt() {
  await useOptions.persist.rehydrate();

  if (!Options.get('firstTime')) {
    return;
  }

  const result = await new Promise<boolean>(resolve =>
    Alert.alert(
      'Enable Crash Reporting',
      'Enable crash reporting to help us make the app more stable?',
      [
        { text: 'No', onPress: () => resolve(false) },
        { text: 'Yes', onPress: () => resolve(true) },
      ],
    ),
  );

  Options().firstTimeSet(false);
  Options().sentryEnabledSet(result);

  if (result) {
    RNRestart.Restart();
  }
}

const persistor = persistStore(createStore);

function App() {
  LogBox.ignoreAllLogs();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    SplashScreen.hide();
    Connect();
    EnableSentryPrompt();
  }, []);

  const navigationRef = useNavigationContainerRef();
  const routePrefixRef = useRef<string | undefined>();

  const authorized = useStore(state => state.authorized);

  const CurrentNav = authorized ? DexNav : AuthNav;

  const loading = useStore(state => state.loading);
  if (loading) {
    return <Loader />;
  }

  return (
    <Provider store={createStore}>
      <PersistGate persistor={persistor}>
        <PaperProvider>
          <SafeAreaProvider>
            <NavigationContainer
              ref={navigationRef}
              theme={{
                ...DefaultTheme,
                colors: {
                  ...DefaultTheme.colors,
                  background: dark ? '#000' : DefaultTheme.colors.background,
                },
              }}
              onReady={() => {
                routingInstrumentation.registerNavigationContainer(navigationRef);
                routePrefixRef.current = navigationRef.getCurrentRoute()?.name?.split('_').at(0);
              }}
              onStateChange={() => {
                const oldPrefix = routePrefixRef.current;
                const currentRouteName = navigationRef.getCurrentRoute()?.name;
                // Unprefixed route
                if (currentRouteName?.indexOf('_') === -1) {
                  return;
                }
                const prefix = currentRouteName?.split('_').at(0);
                if (prefix !== oldPrefix) {
                  setDark(prefix !== 'Wallet');
                  routePrefixRef.current = prefix;
                }
              }}
            >
              {<CurrentNav />}
            </NavigationContainer>
            <Toast />
          </SafeAreaProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

export default Sentry.wrap(App);
