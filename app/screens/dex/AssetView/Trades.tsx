import React, { useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../../styles/colors';
import { getTradesForAssetPair } from '../../../utils/meta1Api';
import { AssetViewTSP, useAVStore } from './AssetView';
type TradesT = ReturnType<typeof getTradesForAssetPair> extends Promise<infer T> ? T : never;

export const Trades: React.FC<AssetViewTSP> = () => {
  const { assetA, assetB } = useAVStore(x => x);

  const [refreshing, setRefreshing] = React.useState(false);

  const [trades, setTrades] = useState<TradesT | null>(null);
  useEffect(() => {
    const fn = async () => {
      const newTrades = await getTradesForAssetPair(assetA, assetB);
      if (refreshing) {
        setRefreshing(false);
      }
      setTrades(newTrades);
    };
    fn();
  }, [refreshing, assetA, assetB]);
  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: '#000' }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            colors={[colors.BrandYellow]}
            tintColor={colors.BrandYellow}
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        {trades &&
          trades.map((e, i, arr) => {
            const clamp = Math.min(i + 1, arr.length - 1);
            const next = arr[clamp];
            const lower = next.price <= e.price;
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  backgroundColor: lower ? '#061101' : '#1e0000',
                }}
              >
                <Text
                  style={{
                    marginLeft: 24,
                    width: 64,
                    color: '#fff',
                    fontVariant: ['tabular-nums'],
                  }}
                >
                  {e.date.toTimeString().split(' ')[0]}
                </Text>
                <Text
                  style={{ fontVariant: ['tabular-nums'], color: lower ? '#029d07' : '#fc0001' }}
                >
                  {e.price.slice(0, 8)}
                </Text>
                <Text style={{ marginRight: 24, fontVariant: ['tabular-nums'], color: '#fff' }}>
                  {e.amount.slice(0, 12)}
                </Text>
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Trades;
