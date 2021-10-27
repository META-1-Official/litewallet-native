import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { Loader } from 'react-native-feather';
import MaterialToggle from '../components/MaterialToggle';
import PortfolioHeader from '../components/PortfolioHeader';
import PortfolioLising from '../components/PortfolioListing';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { jsonEquals } from '../utils';
import { AccountBalanceT, fetchAccountBalances } from './../utils/meta1Api';

const WalletScreen = () => {
  const accountName = useStore(state => state.accountName);
  const [loading, setLoading] = useState(true);
  const [allAssets, setAllAssets] = useState<AccountBalanceT | null>(null);
  const [showZeroBalance, setShowZeroBalacnce] = useState(false);
  useEffect(() => {
    async function fn() {
      console.log('Connected!');
      const balances = await fetchAccountBalances(accountName);

      console.log(balances);
      if (!jsonEquals(balances, allAssets)) {
        setAllAssets(balances!);
        setLoading(false);
      }
    }
    fn();
  }, []);

  if (loading) {
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

export default WalletScreen;
