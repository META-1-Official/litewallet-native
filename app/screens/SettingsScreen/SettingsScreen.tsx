import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CreatePaperWallet from '../CreatePaperWallet';
import Notifications from '../Notifications';
import MainSettingsScreen from './MainSettingsScreen';
import SettingsHeader from './SettingsHeader';
import SwitchLanguage from './SwitchLanguage';

const Stack = createStackNavigator();
const SettingsScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: SettingsHeader,
      }}
    >
      <Stack.Screen name="Settings_Home" component={MainSettingsScreen} />
      <Stack.Screen name="Settings_SwitchLanguage" component={SwitchLanguage} />
      <Stack.Screen name="Settings_ViewKeys" component={CreatePaperWallet} />
      <Stack.Screen name="Settings_Notifications" component={Notifications} />
    </Stack.Navigator>
  );
};

export default SettingsScreen;
