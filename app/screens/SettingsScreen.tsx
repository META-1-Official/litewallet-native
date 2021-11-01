import React from 'react';
import { Button, SafeAreaView } from 'react-native';
import { useStore } from '../store';

const SettingsScreen = () => {
  const logout = useStore(state => state.logout);
  return (
    <SafeAreaView>
      <Button onPress={() => logout()} title="logout" />
    </SafeAreaView>
  );
};

export default SettingsScreen;
