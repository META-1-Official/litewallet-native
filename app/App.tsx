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
import { useStore } from './store';
import { Connect } from './utils/meta1Api';
import { DexNav } from './WalletNav';
import { PrivacyPolicy, TOSScreen } from './screens/PrivacyPolicy';

const { useEffect } = React;

export type RootStackParamList = {
  Home: undefined;
  Legal: undefined;
  Privacy: undefined;
  CreateWallet: undefined;
  LinkWallet: undefined;
  TOS: undefined;
};

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
    </Stack.Navigator>
  );
};

function App() {
  const [dark, setDark] = React.useState(false);
  useEffect(() => {
    SplashScreen.hide();
    Connect();
  });

  const navigationRef = useNavigationContainerRef();
  const routePrefixRef = React.useRef<string | undefined>();

  const authorized = useStore(state => state.authorized);

  const CurrentNav = authorized ? DexNav : AuthNav;
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

export default App;
