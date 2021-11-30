import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useStore } from '../../../store';
import { colors } from '../../../styles/colors';
import { getAccountHistory, HistoryRetT } from '../../../utils/meta1Api';
import { AssetViewTSP } from './AssetView';
import { useAVStore } from './AssetViewStore';

const { width } = Dimensions.get('screen');
export const MyOrders: React.FC<AssetViewTSP> = () => {
  const { assetA, assetB } = useAVStore(x => x);
  const accountName = useStore(e => e.accountName);
  // const [refreshing, setRefreshing] = React.useState(false);

  const [history, setHistory] = useState<HistoryRetT[] | null>(null);

  useEffect(() => {
    const fn = async () => {
      const hist = await getAccountHistory(accountName);
      console.log(hist);
      setHistory(hist);
    };
    fn();
  }, [accountName]);

  const [tab, setTab] = useState(0);
  const offsetX = useRef(new Animated.Value(0)).current;
  const easing = Easing.in(Easing.bounce);
  const rt = () => {
    setTimeout(() => setTab(1), 120);
    Animated.timing(offsetX, {
      toValue: width / 2,
      duration: 120,
      useNativeDriver: false,
      easing,
    }).start();
  };

  const lt = () => {
    setTimeout(() => setTab(0), 120);
    Animated.timing(offsetX, {
      toValue: 0,
      duration: 120,
      useNativeDriver: false,
      easing,
    }).start();
  };

  const amtToReadable = (amt: number, precision: number) => amt / 10 ** precision;
  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: '#000', padding: 12 }}>
      <View style={{ flexDirection: 'row', paddingVertical: 12 }}>
        <TouchableOpacity
          onPress={lt}
          style={{
            flexGrow: 1,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>OPEN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={rt}
          style={{
            flexGrow: 1,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>HISTORY</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Animated.View
          style={{
            position: 'relative',
            left: offsetX,
            backgroundColor: colors.BrandYellow,
            height: 2,
            width: width / 2,
          }}
        />
      </View>
      {tab === 0 ? (
        <></>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 200 }}
          // refreshControl={
          //   <RefreshControl
          //     colors={[colors.BrandYellow]}
          //     tintColor={colors.BrandYellow}
          //     refreshing={refreshing}
          //     onRefresh={() => setRefreshing(true)}
          //   />
          // }
        >
          {history &&
            history.map(e => {
              if (
                ![assetA, assetB].includes(e.limit_order.amount_to_sell.asset.symbol) ||
                ![assetA, assetB].includes(e.limit_order.min_to_receive.asset.symbol)
              ) {
                return null;
              }
              const sellingAsset = e.limit_order.amount_to_sell.asset;
              const buyingAsset = e.limit_order.min_to_receive.asset;
              const buyAmt = e.limit_order.min_to_receive.amount;
              const sellAmt = e.limit_order.amount_to_sell.amount;

              return (
                <View style={{ backgroundColor: '#fff', width: '100%' }} key={e.raw.id}>
                  <Text>
                    {buyingAsset.symbol} / {sellingAsset.symbol}
                  </Text>
                  <Text>Amount {amtToReadable(sellAmt, sellingAsset._asset.precision)}</Text>
                  <Text>
                    Price
                    {amtToReadable(buyAmt, buyingAsset._asset.precision) /
                      amtToReadable(sellAmt, sellingAsset._asset.precision)}
                  </Text>
                  <Text>Total {amtToReadable(buyAmt, buyingAsset._asset.precision)}</Text>
                </View>
              );
            })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default MyOrders;
