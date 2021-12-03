import * as RNSvg from 'react-native-svg';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import { useStore } from '../../../store';
import { colors } from '../../../styles/colors';
import { inFuture } from '../../../utils';
import {
  AmountT,
  FullHistoryOrder,
  getHistoricalOrders,
  useAssetsStore,
} from '../../../utils/meta1Api';
import { AssetViewTSP } from './AssetView';
import { useAVStore } from './AssetViewStore';

const { width } = Dimensions.get('screen');

const Circle = ({ progress }: { progress: number }) => {
  const lable = Math.min(100, Math.round(progress * 10000)).toString();
  return (
    <ProgressCircle
      style={{ height: 48 }}
      progress={progress * 100}
      progressColor={'rgb(134, 0, 0)'}
      startAngle={0}
      endAngle={Math.PI * 2}
    >
      <RNSvg.Text x={-1 * Math.round(lable.length * 3.33) -0.5} y="3.7" fill="#fff">
        {lable}
      </RNSvg.Text>
    </ProgressCircle>
  );
};
export const MyOrders: React.FC<AssetViewTSP> = () => {
  const { assetA, assetB } = useAVStore(x => x);
  const accountName = useStore(e => e.accountName);
  const { userAssets } = useAssetsStore();
  // const [refreshing, setRefreshing] = React.useState(false);

  const [history, setHistory] = useState<FullHistoryOrder | null>(null);

  useEffect(() => {
    const fn = async () => {
      const hist = await getHistoricalOrders(accountName);
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

  const amtToReadable = (amt: AmountT) => {
    const a = amt.amount;
    const precision =
      userAssets?.assetsWithBalance.find(e => e._asset.id === amt.asset_id)?._asset.precision || 8;
    return a / 10 ** precision;
  };

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
            [...history.entries()].map(([k, v]) => {
              if (!k || !v) {
                return null;
              }
              const { canceled, filled } = v;
              const order = v.order.limit_order_create_operation;

              const sellingAsset = order.amount_to_sell.asset;
              const buyingAsset = order.min_to_receive.asset;

              if (
                ![assetA, assetB].includes(sellingAsset.symbol) ||
                ![assetA, assetB].includes(buyingAsset.symbol)
              ) {
                return null;
              }

              // Closed order
              if (!canceled && !filled.length && inFuture(order.expiration)) {
                return null;
              }

              const buyAmt = amtToReadable(order.min_to_receive);

              const sellAmt = amtToReadable(order.amount_to_sell);

              const isBuy = buyingAsset.symbol === assetA;
              const orderStatus = canceled ? 'Canceled' : filled.length ? 'Completed' : 'Expired';
              let progress = 0;
              if (filled.length) {
                const pays = filled.reduce(
                  (acc, { fill_order_operation: fillOp }) =>
                    acc + amtToReadable(fillOp.is_maker ? fillOp.receives : fillOp.pays),
                  0,
                );
                progress = pays / (isBuy ? sellAmt : buyAmt);
              }
              return (
                <View
                  style={{
                    flexDirection: 'row',
                  }}
                  key={`OrderHistorical_${k}`}
                >
                  <View style={{ margin: 8, width: 72 }}>
                    <Text
                      style={{ color: isBuy ? '#0f0' : '#f00', fontSize: 18, textAlign: 'center' }}
                    >
                      {isBuy ? 'Buy' : 'Sell'}
                    </Text>
                    <Circle progress={progress} />
                  </View>
                  <View style={{ margin: 8, width: 175 }}>
                    <Text style={{ color: '#fff', fontSize: 18 }}>
                      {assetA} / {assetB}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 18 }}>
                      Amount: {isBuy ? buyAmt : sellAmt}
                    </Text>
                    <Text style={{ color: '#fff', fontSize: 18 }}>
                      Price :{(buyAmt / sellAmt).toString().slice(0, 8)}
                    </Text>
                  </View>
                  <View style={{ margin: 8, right: 0, position: 'relative' }}>
                    <Text
                      style={{
                        color: orderStatus === 'Completed' ? '#0f0' : '#f00',
                        fontSize: 18,
                      }}
                    >
                      {orderStatus}
                    </Text>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default MyOrders;
