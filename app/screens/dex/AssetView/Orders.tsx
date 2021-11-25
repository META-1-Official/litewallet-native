import React, { useEffect, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors } from '../../../styles/colors';
import { getOrderBook } from '../../../utils/meta1Api';
import { OrderBook } from '../../../utils/meta1dexTypes';
import { AssetViewTSP } from './AssetView';
import { useAVStore } from './AssetViewStore';

export const Orders: React.FC<AssetViewTSP> = () => {
  const { assetA, assetB } = useAVStore(x => x);

  const [refreshing, setRefreshing] = React.useState(false);

  const [orders, setOrders] = useState<OrderBook | null>(null);

  useEffect(() => {
    const fn = async () => {
      const newOrders = await getOrderBook(assetA, assetB);
      console.log(newOrders);
      if (refreshing) {
        setRefreshing(false);
      }
      setOrders(newOrders);
    };
    fn();
  }, [refreshing, assetA, assetB]);

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: '#000', padding: 12 }}>
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              flexGrow: 1,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: '#fff',
                  fontVariant: ['tabular-nums'],
                }}
              >
                VOLUME
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: '#fff',
                  fontVariant: ['tabular-nums'],
                }}
              >
                PRICE
              </Text>
            </View>
            {orders &&
              orders.asks.map((e, i) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 8,
                    borderRightWidth: 1,
                    borderRightColor: colors.BrandYellow,
                  }}
                  key={`AskRow_${i}`}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#fff',
                      fontVariant: ['tabular-nums'],
                    }}
                  >
                    {e.quote}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#fc0001',
                      fontVariant: ['tabular-nums'],
                    }}
                  >
                    {e.price}
                  </Text>
                </View>
              ))}
          </View>
          <View
            style={{
              flexGrow: 1,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 8 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: '#fff',
                  fontVariant: ['tabular-nums'],
                }}
              >
                PRICE
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  color: '#fff',
                  fontVariant: ['tabular-nums'],
                }}
              >
                VOLUME
              </Text>
            </View>
            {orders &&
              orders.bids.map((e, i) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 8,
                    borderLeftWidth: 1,
                    borderLeftColor: colors.BrandYellow,
                  }}
                  key={`BidRow_${i}`}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#029d07',
                      fontVariant: ['tabular-nums'],
                    }}
                  >
                    {e.price}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '500',
                      color: '#fff',
                      fontVariant: ['tabular-nums'],
                    }}
                  >
                    {e.quote}
                  </Text>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Orders;

// <View
//                 style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   paddingVertical: 12,
//                   backgroundColor: '#000',
//                 }}
//                 key={`OrderRow_${i}`}
//               >
//                 <Text
//                   style={{
//                     marginLeft: 24,
//                     color: '#fff',
//                     fontVariant: ['tabular-nums'],
//                   }}
//                 >
//                   {e.date.toTimeString().split(' ')[0]}
//                 </Text>
//                 <Text
//                   style={{ fontVariant: ['tabular-nums'], color: lower ? '#029d07' : '#fc0001' }}
//                 >
//                   {e.price.slice(0, 8)}
//                 </Text>
//                 <Text style={{ fontSize: 15, fontWeight: '500', marginRight: 24, fontVariant: ['tabular-nums'], color: '#fff' }}>
//                   {e.amount.slice(0, 12)}
//                 </Text>
//               </View>
