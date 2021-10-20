import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import { ActivityIndicator } from 'react-native';

import Legal from './screens/LegalScreen';
import AppHeader from './components/AppHeaer';
import CreateWalletScreen from './screens/CreateWalletScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LinkWalletScreen from './screens/LinkWalletScreen';
import { useStore } from './store';
import WalletScreen from './screens/WalletScreen';
import { Connect } from './utils/meta1Api';

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

const Loader = () => {
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
      <ActivityIndicator />
    </SafeAreaView>
  );
};

const WalletNav = () => {
  const loading = useStore(state => state.loading);
  if (loading) {
    return <Loader />;
  }
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={WalletScreen} />
    </Tab.Navigator>
  );
};

function App() {
  useEffect(() => {
    SplashScreen.hide();
    Connect();
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
