import React from 'react';
import { Platform, TouchableOpacity, Text, SafeAreaView, View } from 'react-native';
import { StackHeaderProps } from '@react-navigation/stack';
import { ArrowLeft } from 'react-native-feather';
import { getHeaderTitle } from '@react-navigation/elements';
import { colors } from '../styles/colors';

export default function AppHeader({ navigation, route, options, back }: StackHeaderProps) {
  const BackButton = ({ color }: { color: string }) => (
    <TouchableOpacity
      accessibilityLabel="AppHeader/Back"
      style={{ marginHorizontal: 12 }}
      activeOpacity={0.5}
      onPress={navigation.goBack}
    >
      <ArrowLeft width={32} height={32} stroke={color} />
    </TouchableOpacity>
  );
  const isWalletRoute = route.name.startsWith('Wallet__');
  const title = isWalletRoute ? getHeaderTitle(options, route.name).replace(/\w+__/, '') : null;
  return (
    <SafeAreaView
      style={{
        backgroundColor: isWalletRoute ? colors.BrandYellow : '#fff',
        height: (Platform.OS === 'ios' ? 89 : 48) + 8,
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {back ? <BackButton color={isWalletRoute ? '#fff' : '#000'} /> : null}
      <Text
        style={{
          fontSize: 20,
          color: isWalletRoute ? '#fff' : '#000',
          fontWeight: '500',
        }}
      >
        {title}
      </Text>

      {/* Empty view for space between alignment, mimics back button sizing*/}

      {back ? <View style={{ width: 32, height: 32, marginHorizontal: 12 }} /> : null}
    </SafeAreaView>
  );
}
