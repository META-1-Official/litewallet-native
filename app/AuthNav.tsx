import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import AppHeader from './components/AppHeader';
import { CountryPicker, CountryPickerParams } from './components/CountryPicker';
import { LoaderModalContent } from './components/LoaderModal';
import LinkWalletScreen from './screens/LinkWalletScreen';
import { PrivacyPolicy, TOSScreen } from './screens/PrivacyPolicy';
// import AdditionalFormScreen from './screens/SignUp/AdditionalFormScreen';
import CreateWalletScreen from './screens/SignUp/CreateWalletScreen';
import ESignatureFormScreen from './screens/SignUp/ESignatureFormScreen';
import ESignatureScreen from './screens/SignUp/ESignatureScreen';
import FaceKIScreen from './screens/SignUp/FaceKIScreen';
import FaceKISuccessScreen from './screens/SignUp/FaceKISuccessScreen';
import ImportWalletScreen from './screens/SignUp/ImportWalletScreen';
import Legal from './screens/SignUp/LegalScreen';
import PasskeyScreen from './screens/SignUp/PasskeyScreen';
import PaymentSuccess from './screens/SignUp/PaymentSuccess';
import WelcomeScreen from './screens/WelcomeScreen';
import CustomProvidersScreen from './screens/CustomProviders/CustomProvidersScreen';

export type RootStackParamList = {
  Home: undefined;
  Legal: undefined;
  Privacy: undefined;
  CreateWallet: undefined;
  // AdditionalForm: undefined;
  FaceKI: undefined;
  FaceKISuccess: undefined;
  Passkey: undefined;
  ESignature: undefined;
  ESignatureForm: undefined;
  PaymentSuccess: undefined;
  ImportWallet: undefined;
  LinkWallet: undefined;
  CustomProviders: undefined;
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
      <Stack.Screen
        name="FaceKI"
        options={{
          title: 'Create Wallet',
        }}
        component={FaceKIScreen}
      />
      <Stack.Screen name="FaceKISuccess" component={FaceKISuccessScreen} />
      {/*<Stack.Screen name="AdditionalForm" component={AdditionalFormScreen} />*/}
      <Stack.Screen name="ESignature" component={ESignatureScreen} />
      <Stack.Screen name="ESignatureForm" component={ESignatureFormScreen} />
      <Stack.Screen name="Passkey" component={PasskeyScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      <Stack.Screen name="LinkWallet" component={LinkWalletScreen} />
      <Stack.Screen name="CustomProviders" component={CustomProvidersScreen} />
      <Stack.Screen name="ImportWallet" component={ImportWalletScreen} />
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

export default AuthNav;
