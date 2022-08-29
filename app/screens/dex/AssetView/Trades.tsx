import React, { useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../../styles/colors';
import { getTradesForAssetPair } from '../../../services/meta1Api';
import { AssetViewTSP } from './AssetView';
import { useAVStore } from './AssetViewStore';
import { useStore } from '../../../store';
type TradesT = ReturnType<typeof getTradesForAssetPair> extends Promise<infer T> ? T : never;

export const Trades: React.FC<AssetViewTSP> = () => {
  const { assetA, assetB } = useAVStore(x => x);
  const { needUpdate, setNeedUpdate } = useStore();

  const [refreshing, setRefreshing] = React.useState(false);

  const [trades, setTrades] = useState<TradesT | null>(null);
  useEffect(() => {
    const fn = async () => {
      const newTrades = await getTradesForAssetPair(assetA, assetB);
      if (refreshing) {
        setRefreshing(false);
      }
      setTrades(newTrades);
      if (needUpdate) {
        setNeedUpdate(false);
      }
    };
    fn();
  }, [refreshing, assetA, assetB, needUpdate]);
  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: '#000' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200 }}
        refreshControl={
          <RefreshControl
            colors={[colors.BrandYellow]}
            tintColor={colors.BrandYellow}
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 12,
            backgroundColor: '#000',
          }}
        >
          <Text
            style={{
              marginLeft: 24,
              color: '#fff',
              fontVariant: ['tabular-nums'],
            }}
          >
            TIME
          </Text>
          <Text style={{ fontVariant: ['tabular-nums'], color: '#fff' }}>PRICE</Text>
          <Text style={{ marginRight: 24, fontVariant: ['tabular-nums'], color: '#fff' }}>
            VOLUME
          </Text>
        </View>
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
                key={`Trade_${e.sequence}`}
              >
                <Text
                  style={{
                    marginLeft: 24,
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
