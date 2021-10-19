import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import WelcomeScreen from './screens/WelcomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Legal from './screens/LegalScreen';
import AppHeader from './components/AppHeaer';
import CreateWalletScreen from './screens/CreateWalletScreen';
import { Provider as PaperProvider } from 'react-native-paper';
import LinkWalletScreen from './screens/LinkWalletScreen';
import { useStore } from './store';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WalletScreen from './screens/WalletScreen';
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
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={WalletScreen} />
    </Tab.Navigator>
  );
};

function App() {
  useEffect(() => {
    SplashScreen.hide();
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
