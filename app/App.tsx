import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';

import Legal from './screens/LegalScreen';
import AppHeader from './components/AppHeaer';
import CreateWalletScreen from './screens/CreateWalletScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LinkWalletScreen from './screens/LinkWalletScreen';
import { useStore } from './store';
import WalletScreen from './screens/WalletScreen';
import { Connect } from './utils/meta1Api';
import { colors } from './styles/colors';
import * as Icon from 'react-native-feather';
import Loader from './components/Loader';

const { useEffect } = React;

export type RootStackParamList = {
  Home: undefined;
  Legal: undefined;
  CreateWallet: undefined;
  LinkWallet: undefined;
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
      <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
      <Stack.Screen name="LinkWallet" component={LinkWalletScreen} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const WalletNav = () => {
  const loading = useStore(state => state.loading);
  if (loading) {
    return <Loader />;
  }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.BrandYellow,
        tabBarIcon: ({ color, size }) => {
          const Name2Icon = {
            Wallet: Icon.CreditCard,
            DEX: Icon.BarChart2,
            Settings: Icon.Settings,
            'Fund Account': Icon.User,
          };

          if (!(route.name in Name2Icon)) {
            return null;
          }
          const key = route.name as keyof typeof Name2Icon;
          const TheIcon: typeof Name2Icon['Wallet'] = Name2Icon[key];

          return <TheIcon width={size} height={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Fund Account" component={WalletScreen} />
      <Tab.Screen name="DEX" component={WalletScreen} />
      <Tab.Screen name="Settings" component={WalletScreen} />
    </Tab.Navigator>
  );
};

function App() {
  useEffect(() => {
    SplashScreen.hide();
    Connect();
    // try {
    //   console.log('Going to create a ws connection to wss://api.meta1.io/ws');
    //   const ws = new WebSocket('wss://api.meta1.io/ws');
    //   ws.onmessage = console.log;
    //   ws.send(`{"jsonrpc": "2.0"}`);
    // } catch (e) {
    //   console.error(e);
    // }

    // try {
    //   // TODO: connect to a real test server
    //   // const ws = new WebSocket('wss://api.meta1.io/ws');
    //   // ws.onmessage = console.log;
    //   // ws.send(`{"jsonrpc": "2.0"}`);
    // } catch (e) {
    //   console.error(e);
    // }
  });

  const authorized = useStore(state => state.authorized);

  const CurrentNav = authorized ? WalletNav : AuthNav;
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>{<CurrentNav />}</NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default App;
