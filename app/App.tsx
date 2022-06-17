import * as React from 'react';
import 'react-native-gesture-handler';
import {
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';

import Legal from './screens/LegalScreen';
import AppHeader from './components/AppHeaer';
import CreateWalletScreen from './screens/CreateWalletScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LinkWalletScreen from './screens/LinkWalletScreen';
import { Options, useOptions, useStore } from './store';
import { Connect } from './utils/meta1Api';
import { DexNav } from './WalletNav';
import { PrivacyPolicy, TOSScreen } from './screens/PrivacyPolicy';
import Loader from './components/Loader';
import * as Sentry from '@sentry/react-native';
import { LoaderModalContent } from './components/LoaderModal';
import { CountryPicker, CountryPickerParams } from './components/CountryPicker';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import RNRestart from 'react-native-restart';
import { SENTRY_DSN } from '@env';
import { Alert } from 'react-native';

const { useEffect } = React;

// Construct a new instrumentation instance. This is needed to communicate between the integration and React
const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

useOptions.persist.rehydrate().then(() => {
  if (SENTRY_DSN && Options.get('sentryEnabled')) {
    console.log('--- SENTRY INIT ---');
    Sentry.init({
      dsn: SENTRY_DSN,
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production.
      tracesSampleRate: 1.0,
      integrations: [
        new Sentry.ReactNativeTracing({
          // Pass instrumentation to be used as `routingInstrumentation`
          routingInstrumentation,
          // ...
        }),
      ],
    });
  }
});

setJSExceptionHandler((e, _fatal) => {
  Sentry.captureException(e);
  console.log(e);
  if (e.message === 'ACCOUNT_NOT_FOUND') {
    RNRestart.Restart();
  }
}, false);

export type RootStackParamList = {
  Home: undefined;
  Legal: undefined;
  Privacy: undefined;
  CreateWallet: undefined;
  LinkWallet: undefined;
  TOS: undefined;
  Loader: undefined;
} & CountryPickerParams;

export type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Stack = createStackNavigator<RootStackParamList>();
const AuthNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'screen',
        header: AppHeader,
      }}
    >
      <Stack.Screen
        name="Home"
        options={{
          headerShown: false,
        }}
        component={WelcomeScreen}
      />
      <Stack.Screen name="Legal" component={Legal} />
      <Stack.Screen name="Privacy" component={PrivacyPolicy} />
      <Stack.Screen name="TOS" component={TOSScreen} />
      <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
      <Stack.Screen name="LinkWallet" component={LinkWalletScreen} />
      <Stack.Screen
        name="Loader"
        options={{ presentation: 'transparentModal', headerShown: false }}
        component={LoaderModalContent}
      />
      <Stack.Screen
        name="CountryPickerModal"
        component={CountryPicker}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};

async function EnableSentryPrompt() {
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

function App() {
  const [dark, setDark] = React.useState(false);
  useEffect(() => {
    SplashScreen.hide();
    Connect();
    EnableSentryPrompt();
  });

  const navigationRef = useNavigationContainerRef();
  const routePrefixRef = React.useRef<string | undefined>();

  const authorized = useStore(state => state.authorized);

  const CurrentNav = authorized ? DexNav : AuthNav;

  const loading = useStore(state => state.loading);
  if (loading) {
    return <Loader />;
  }

  return (
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
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default Sentry.wrap(App);
