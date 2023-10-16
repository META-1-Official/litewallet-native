import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import AppHeader from './components/AppHeader';
import { CountryPicker, CountryPickerParams } from './components/CountryPicker';
import { LoaderModalContent } from './components/LoaderModal';
import ZenDeskButton from './components/ZenDeskButton';
import LinkWalletScreen from './screens/LinkWalletScreen';
import { PrivacyPolicy, TOSScreen } from './screens/PrivacyPolicy';
// import AdditionalFormScreen from './screens/SignUp/AdditionalFormScreen';
import CreateWalletScreen from './screens/SignUp/CreateWalletScreen';
import ESignatureFormScreen from './screens/SignUp/ESignatureFormScreen';
import ESignatureScreen from './screens/SignUp/ESignatureScreen';
import FaceKIScreen from './screens/SignUp/FaceKIScreen';
import FaceKISuccessScreen from './screens/SignUp/FaceKISuccessScreen';
import ImportWalletScreen from './screens/SignUp/ImportWalletScreen';
import ImportBiometricScreen from './screens/SignUp/ImportBiometricScreen';
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
  FaceKI: { upgradeBiometric: boolean };
  FaceKISuccess: undefined;
  Passkey: undefined;
  ESignature: undefined;
  ESignatureForm: undefined;
  PaymentSuccess: undefined;
  ImportWallet: undefined;
  ImportBiometric: undefined;
  LinkWallet: undefined;
  CustomProviders: undefined;
  TOS: undefined;
  Loader: undefined;
} & CountryPickerParams;

export type RootNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Stack = createStackNavigator<RootStackParamList>();

const AuthNav = () => {
  return (
    <>
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
        <Stack.Screen
          name="Privacy"
          component={PrivacyPolicy}
          options={{
            title: 'Privacy Policy Of META1 Coin',
          }}
        />
        <Stack.Screen
          name="TOS"
          component={TOSScreen}
          options={{
            title: 'Terms Of Service',
          }}
        />
        <Stack.Screen
          name="CreateWallet"
          component={CreateWalletScreen}
          options={{
            title: 'Create META1 Wallet',
          }}
        />
        <Stack.Screen
          name="FaceKI"
          component={FaceKIScreen}
          options={{
            title: 'Bio-Metric 2 Factor Authentication',
          }}
          initialParams={{ upgradeBiometric: false }}
        />
        <Stack.Screen
          name="FaceKISuccess"
          component={FaceKISuccessScreen}
          options={{
            title: 'Bio-Metric 2 Factor Authentication',
          }}
        />
        {/*<Stack.Screen name="AdditionalForm" component={AdditionalFormScreen} />*/}
        <Stack.Screen name="ESignature" component={ESignatureScreen} />
        <Stack.Screen name="ESignatureForm" component={ESignatureFormScreen} />
        <Stack.Screen
          name="Passkey"
          component={PasskeyScreen}
          options={{
            title: 'Save Passkey',
          }}
        />
        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccess}
          options={{ gestureEnabled: false, title: '' }}
        />
        <Stack.Screen
          name="LinkWallet"
          component={LinkWalletScreen}
          options={{
            title: 'Link Wallet',
          }}
        />
        <Stack.Screen
          name="CustomProviders"
          component={CustomProvidersScreen}
          options={{
            title: 'Web3Auth',
          }}
        />
        <Stack.Screen
          name="ImportWallet"
          component={ImportWalletScreen}
          options={{ title: 'Import Wallet' }}
        />
        <Stack.Screen
          name="ImportBiometric"
          component={ImportBiometricScreen}
          options={{ title: 'Upgrade Biometric' }}
        />
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
      {/*<ZenDeskButton />*/}
    </>
  );
};

export default AuthNav;
