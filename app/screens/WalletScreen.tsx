import React, { useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import MaterialToggle from '../components/MaterialToggle';
import PortfolioHeader from '../components/PortfolioHeader';
import PortfolioLising from '../components/PortfolioListing';
import { colors } from '../styles/colors';
import { useAssets } from './../utils/meta1Api';
import Loader from '../components/Loader';
import AppHeader from '../components/AppHeaer';
import TradeScreen from './TradeScreen';

const WalletScreen = () => {
  const [showZeroBalance, setShowZeroBalacnce] = useState(false);
  const allAssets = useAssets();

  if (allAssets === null) {
    return <Loader />;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.BrandYellow,
        flexGrow: 1,
      }}
    >
      <PortfolioHeader protfolioAssets={allAssets} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#330000',
          alignSelf: 'stretch',
          paddingHorizontal: 32,
          paddingTop: 16,
          paddingBottom: 12,
          alignItems: 'flex-start',
        }}
      >
        <Text
          style={{
            color: colors.BrandYellow,
            fontSize: 16,
            fontWeight: '800',
          }}
        >
          WALLET
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={{
              color: '#fff',
              fontSize: 13,
              fontWeight: '600',
              paddingVertical: 2,
              paddingRight: 8,
            }}
          >
            HIDE 0 BALANCE WALLET
          </Text>
          <MaterialToggle onChange={v => setShowZeroBalacnce(v)} />
        </View>
      </View>
      <PortfolioLising accountBallance={allAssets} showZeroBallance={showZeroBalance} />
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();

export type WalletStackParamList = {
  Wallet__Main: undefined;
  Wallet__Trade: undefined;
  Wallet__Send: undefined;
  Wallet__Recive: undefined;
};

export type WalletNavigationProp = StackNavigationProp<WalletStackParamList, 'Wallet__Main'>;

function WalletScreenStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'screen',
        header: AppHeader,
      }}
    >
      <Stack.Screen
        name="Wallet__Main"
        component={WalletScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Wallet__Trade" component={TradeScreen} />
      <Stack.Screen name="Wallet__Send" component={Loader} />
      <Stack.Screen name="Wallet__Recive" component={Loader} />
    </Stack.Navigator>
  );
}
export default WalletScreenStack;
