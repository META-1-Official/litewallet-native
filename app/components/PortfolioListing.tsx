import React from 'react';
import { Dimensions, ScrollView, Image, StyleSheet, Text, View } from 'react-native';
import { grey200, grey600 } from 'react-native-paper/src/styles/colors';
import { AccountBalanceT, AssetBalanceT } from '../utils/meta1Api';

const { width } = Dimensions.get('screen');

interface Props {
  showZeroBallance: boolean;
  accountBallance: AccountBalanceT | null;
}
const PortfolioLising: React.FC<Props> = ({ showZeroBallance, accountBallance }) => {
  const protfolioAssets = accountBallance!.assetsWithBalance;
  const assets = showZeroBallance ? protfolioAssets : protfolioAssets.filter(e => e.amount > 0);
  const storted = assets.sort((a, b) => b.total_value - a.total_value);

  const renderRow = (e: AssetBalanceT, i: number) => {
    const backgroundColor = { backgroundColor: i % 2 !== 0 ? grey200 : '#fff' };
    const primaryString =
      e.amount === 0 || e.amount.toString().length > 8 ? e.amount : e.amount.toFixed(6);
    const secondaryString =
      e.amount === 0 ? null : (
        <Text style={styles.textSecondary}>US$ {e.total_value.toFixed(2)}</Text>
      );

    return (
      <View key={`CoinBalance_${i}`} style={[styles.portfolioRow, backgroundColor]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={styles.coinIcon} source={e._asset.icon} />
          <Text style={styles.textPrimaty}> {e.symbol}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.textPrimaty}>{primaryString}</Text>
          {secondaryString}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, flexGrow: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        {storted && storted.map(renderRow)}
      </ScrollView>
    </View>
  );
};
const ICON_SIZE = 42;
const styles = StyleSheet.create({
  portfolioRow: {
    flexDirection: 'row',
    width,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: 'center',
  },
  coinIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    resizeMode: 'contain',
    marginRight: 8,
  },
  textPrimaty: {
    fontSize: 16,
    fontWeight: '500',
  },
  textSecondary: {
    color: grey600,
  },
});

export default PortfolioLising;
