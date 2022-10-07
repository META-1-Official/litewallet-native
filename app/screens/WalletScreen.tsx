import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Alert } from 'react-native';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import MaterialToggle from '../components/MaterialToggle';
import PortfolioHeader from '../components/PortfolioHeader';
import PortfolioListing from '../components/PortfolioListing';
import { useAppSelector } from '../hooks';
import migrationService from '../services/migration.service';
import { colors } from '../styles/colors';
import { useAssets } from '../services/meta1Api';
import Loader from '../components/Loader';
import AppHeader from '../components/AppHeaer';
import TradeScreen from './TradeScreen';
import ReciveScreen from './ReciveScreen';
import SendScreen from './SendScreen';

const WalletScreen = () => {
  const [showZeroBalance, setShowZeroBalacnce] = useState(false);
  const allAssets = useAssets();
  const { accountName, isMigration, password } = useAppSelector(state => state.signUp);

  useEffect(() => {
    // todo: move to custom hook
    (async () => {
      if (isMigration) {
        const migrationResp = await migrationService.migrate(accountName, password as string);
        console.log('Migration: ', accountName, password);
        console.log('Migration response: ', migrationResp);
        if (migrationResp) {
          Alert.alert('Migration done!');
        } else {
          Alert.alert('Something went wrong!');
        }
      }
    })();
  }, []);

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
      <PortfolioListing showZeroBallance={showZeroBalance} />
    </SafeAreaView>
  );
};

const Stack = createStackNavigator();

export type WalletStackParamList = {
  Wallet__Main: undefined;
  Wallet__Trade: undefined;
  Wallet__Send: undefined;
  Wallet__Receive: undefined;
};

export type WalletNavigationProp = StackNavigationProp<WalletStackParamList, 'Wallet__Main'>;
export type WSP<K extends keyof WalletStackParamList> = StackScreenProps<WalletStackParamList, K>;
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
      <Stack.Screen name="Wallet__Send" component={SendScreen} />
      <Stack.Screen name="Wallet__Receive" component={ReciveScreen} />
    </Stack.Navigator>
  );
}
export default WalletScreenStack;
