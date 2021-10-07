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
const { useEffect } = React;

export type RootStackParamList = {
  Home: undefined;
  Legal: undefined;
  CreateWallet: undefined;
};

export type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Stack = createStackNavigator<RootStackParamList>();

function App() {
  useEffect(() => {
    SplashScreen.hide();
  });
  return (
    <SafeAreaProvider>
      <NavigationContainer>
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
