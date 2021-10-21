import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import PortfolioHeader from '../components/PortfolioHeader';
import PortfolioLising from '../components/PortfolioListing';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { jsonEquals } from '../utils';
import { AssetBalanceT, fetchAccountBalances } from './../utils/meta1Api';

const WalletScreen = () => {
  const accountName = useStore(state => state.accountName);
  const [allAssets, setAllAssets] = useState<AssetBalanceT[]>([]);
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

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.BrandYellow,
        flexGrow: 1,
      }}
    >
      <PortfolioHeader protfolioAssets={allAssets} />
      <PortfolioLising protfolioAssets={allAssets} showZeroBallance={true} />
    </SafeAreaView>
  );
};

export default WalletScreen;
