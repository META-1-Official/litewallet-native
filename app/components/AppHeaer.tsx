import React from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'react-native-feather';
export default function AppHeader({ navigation, back }: StackHeaderProps) {
  const BackButton = () => (
    <TouchableOpacity
      style={{ marginHorizontal: 12 }}
      activeOpacity={0.5}
      onPress={navigation.goBack}
    >
      <ArrowLeft width={32} height={32} stroke="#000" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#fff',
        height: Platform.OS === 'ios' ? 89 : 48,
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
      }}
    >
      {back ? <BackButton /> : undefined}
    </SafeAreaView>
  );
}
