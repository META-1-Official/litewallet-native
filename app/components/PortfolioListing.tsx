import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { grey200, grey600 } from 'react-native-paper/src/styles/colors';
import { BrandYellow } from '../styles/colors';
import { AssetBalanceT, refreshAssets, useAssets } from '../utils/meta1Api';

const { width } = Dimensions.get('screen');

interface Props {
  showZeroBallance: boolean;
  colors?: {
    background?: string;
    stripe?: string;
    textPrimary?: string;
    textSecondary?: string;
  };
  usdPrimary?: boolean;
  onPress?: (asset: string) => void;
}

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const Refresher = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refreshAssets();
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <RefreshControl
      colors={[BrandYellow]}
      tintColor={BrandYellow}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
};

const PortfolioListing: React.FC<Props> = ({ showZeroBallance, colors, usdPrimary, onPress }) => {
  const defaultColors: typeof colors = {
    background: '#fff',
    stripe: grey200,
    textPrimary: '#000',
    textSecondary: grey600,
  };
  const curColor = colors || defaultColors;
  const accountBallance = useAssets();
  const portfolioAssets = accountBallance!.assetsWithBalance;
  const assets = showZeroBallance ? portfolioAssets : portfolioAssets.filter(e => e.amount > 0);
  const sorted = assets.sort((a, b) => b.total_value - a.total_value);

  useEffect(() => {
    const timer = setInterval(() => refreshAssets(), 5000);

    return () => clearInterval(timer);
  });

  const renderRow = (e: AssetBalanceT, i: number) => {
    const backgroundColor = {
      backgroundColor: i % 2 !== 0 ? curColor.stripe : curColor.background,
    };
    const _primaryString =
      e.amount === 0 || e.amount.toString().length > 8 ? e.amount : e.amount.toFixed(6);
    const primaryString = (
      <Text
        style={[
          usdPrimary ? styles.textSecondary : styles.textPrimary,
          { color: curColor.textPrimary },
        ]}
      >
        {_primaryString}
      </Text>
    );
    const secondaryString =
      e.amount === 0 ? null : (
        <Text
          style={[
            usdPrimary ? styles.textPrimary : styles.textSecondary,
            { color: curColor.textSecondary },
          ]}
        >
          US$ {e.total_value.toFixed(2)}
        </Text>
      );

    const ret = (
      <View key={`CoinBalance_${i}`} style={[styles.portfolioRow, backgroundColor]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image style={styles.coinIcon} source={e._asset.icon} />
          <Text style={[styles.textPrimary, { color: curColor.textPrimary }]}> {e.symbol}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          {usdPrimary ? secondaryString : primaryString}
          {usdPrimary ? primaryString : secondaryString}
        </View>
      </View>
    );

    if (onPress) {
      return (
        <TouchableOpacity key={`CoinBalance_Touch__${i}`} onPress={() => onPress(e.symbol)}>
          {ret}
        </TouchableOpacity>
      );
    }

    return ret;
  };

  return (
    <View style={{ flex: 1, flexGrow: 1, backgroundColor: curColor.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<Refresher />}
      >
        {sorted && sorted.map(renderRow)}
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
  textPrimary: {
    fontSize: 16,
    fontWeight: '500',
  },
  textSecondary: {
    color: grey600,
  },
});

export default PortfolioListing;
