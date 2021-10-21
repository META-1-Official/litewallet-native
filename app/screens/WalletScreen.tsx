import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Platform, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PortfolioHeader from '../components/PortfolioHeader';
import PortfolioLising from '../components/PortfolioListing';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { jsonEquals } from '../utils';
import { AssetBalanceT, fetchAccountBalances } from './../utils/meta1Api';

const { width } = Dimensions.get('screen');

const WalletScreen = () => {
  const accountName = useStore(state => state.accountName);
  const [allAssets, setAllAssets] = useState<AssetBalanceT[]>([]);
  const logout = useStore(state => state.logout);
  useEffect(() => {
    async function fn() {
      console.log('Connected!');

      const balances = await fetchAccountBalances(accountName);

      console.log(balances);
      if (!jsonEquals(balances, allAssets)) {
        setAllAssets(balances!);
      }
    }
    fn();
  }, []);

  const hasNotch = Platform.OS === 'android' ? _.get(StatusBar, 'currentHeight', 25) > 24 : true;

  const Backdrop = () => {
    if (!hasNotch) {
      return null;
    }

    return (
      <View
        style={{
          position: 'absolute',
          width,
          top: 0,
          backgroundColor: colors.BrandYellow,
          height: 44,
          zIndex: 99,
        }}
      />
    );
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Backdrop />
      <PortfolioHeader protfolioAssets={allAssets} />
      <Button title="Logout" onPress={() => logout()} />
      <PortfolioLising protfolioAssets={allAssets} showZeroBallance={true} />
    </SafeAreaView>
  );
};

export default WalletScreen;
