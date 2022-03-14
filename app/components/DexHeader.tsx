import React from 'react';
import { Platform, TouchableOpacity, Text, SafeAreaView, StatusBar, View } from 'react-native';
import { ArrowLeft, Bell, Menu } from 'react-native-feather';
import { getHeaderTitle } from '@react-navigation/elements';
import { colors } from '../styles/colors';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { tid } from '../utils';

export function DexHeader({ navigation: nav, route, options }: BottomTabHeaderProps) {
  const SideMenu = ({ color }: { color: string }) => (
    <TouchableOpacity
      {...tid('DexHeader/Menu')}
      style={{ marginHorizontal: 12 }}
      activeOpacity={0.5}
      onPress={() => (nav.getParent() as any).openDrawer()}
    >
      <Menu width={32} height={32} stroke={color} />
    </TouchableOpacity>
  );
  const Notifications = ({ color }: { color: string }) => (
    <TouchableOpacity
      {...tid('DexHeader/Notifications')}
      style={{ marginHorizontal: 12 }}
      activeOpacity={0.5}
      onPress={() =>
        nav.navigate('DEX_HOME', {
          screen: 'DEX__Notifications',
        })
      }
    >
      <Bell width={32} height={32} stroke={color} />
    </TouchableOpacity>
  );

  const title =
    route.name === 'DEX__Home' || route.name === 'DEX__Fund'
      ? 'META1'
      : getHeaderTitle(options, route.name).replace(/\w+__/, '');

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        height: (Platform.OS === 'ios' ? 89 : 48) + 8,
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <StatusBar barStyle="light-content" />
      <SideMenu color={colors.BrandYellow} />
      <Text
        style={{
          fontSize: 20,
          color: '#fff',
          fontWeight: '500',
        }}
      >
        {title}
      </Text>
      <Notifications color={colors.BrandYellow} />
    </SafeAreaView>
  );
}

export function DexStackHeader({ navigation, route, options }: any) {
  const BackButton = ({ color }: { color: string }) => (
    <TouchableOpacity
      {...tid('DexHeader/Back')}
      style={{ marginHorizontal: 12 }}
      activeOpacity={0.5}
      onPress={navigation.goBack}
    >
      <ArrowLeft width={32} height={32} stroke={color} />
    </TouchableOpacity>
  );
  const isWalletRoute = route.name.includes('__');
  const title = isWalletRoute ? getHeaderTitle(options, route.name).replace(/\w*__/, '') : null;
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        height: (Platform.OS === 'ios' ? 89 : 48) + 8,
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <BackButton color="#fff" />
      <Text
        style={{
          fontSize: 20,
          color: '#fff',
          fontWeight: '500',
        }}
      >
        {title}
      </Text>

      {/* Empty view for space between alignment, mimics back button sizing*/}
      <View style={{ width: 32, height: 32, marginHorizontal: 12 }} />
    </SafeAreaView>
  );
}
