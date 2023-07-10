import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import MaterialToggle from '../components/MaterialToggle';
import PortfolioHeader from '../components/PortfolioHeader';
import PortfolioListing from '../components/PortfolioListing';
import { useAppSelector } from '../hooks';
import useAppDispatch from '../hooks/useAppDispatch';
import { migrateAccount } from '../store/signUp/signUp.actions';
import { colors } from '../styles/colors';
import Loader from '../components/Loader';
import AppHeader from '../components/AppHeader';
import TradeScreen from './TradeScreen/TradeScreen';
import ReceiveScreen from './ReceiveScreen/ReceiveScreen';
import SendScreen from './SendScreen';
import useAssetsOnFocus from '../hooks/useAssetsOnFocus';

const WalletScreen = () => {
  const dispatch = useAppDispatch();
  const [showZeroBalance, setShowZeroBalance] = useState(false);
  const allAssets = useAssetsOnFocus();
  const { accountName, isMigration, password } = useAppSelector(state => state.signUp);

  useEffect(() => {
    if (isMigration) {
      dispatch(migrateAccount({ accountName, password }))
        .unwrap()
        .then(migration => {
          if (!migration.error) {
            Toast.show({
              type: 'success',
              text1: 'Migration done!',
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'Migration failed!',
              text2: 'Something went wrong!',
            });
          }
        })
        .catch(() => {
          Toast.show({
            type: 'error',
            text1: 'Migration failed!',
            text2: 'Something went wrong!',
          });
        });
    }
  }, []);

  if (!allAssets) {
    return <Loader />;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.BrandYellow,
        flexGrow: 1,
      }}
    >
      <PortfolioHeader portfolioAssets={allAssets} />
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
          <MaterialToggle onChange={v => setShowZeroBalance(v)} />
        </View>
      </View>
      <PortfolioListing showZeroBalance={showZeroBalance} />
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
      <Stack.Screen name="Wallet__Receive" component={ReceiveScreen} />
    </Stack.Navigator>
  );
}
export default WalletScreenStack;
