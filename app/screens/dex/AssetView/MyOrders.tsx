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
  AccountBalanceT,
  AmountT,
  FullHistoryOrder,
  getHistoricalOrders,
  HistoryRetT,
  useAssetsStore,
} from '../../../utils/meta1Api';
import { AssetViewTSP } from './AssetView';
import { useAVStore } from './AssetViewStore';
import meta1dex, { LoginRetT } from '../../../utils/meta1dexTypes';

const { width } = Dimensions.get('screen');

const Circle = ({ progress, isBuy }: { progress: number; isBuy: boolean }) => {
  const lable = Math.min(100, Math.round(progress * 10000)).toString();
  return (
    <ProgressCircle
      style={{ height: 48 }}
      progress={progress * 100}
      progressColor={isBuy ? '#0f0' : '#f00'}
      backgroundColor="#000"
      strokeWidth={2}
      startAngle={0}
      endAngle={Math.PI * 2}
    >
      <RNSvg.Text
        x={-1 * Math.round(lable.length * 3.33) - 0.5}
        y="3.7"
        fill={isBuy ? '#0f0' : '#f00'}
      >
        {lable}
      </RNSvg.Text>
    </ProgressCircle>
  );
};
const useAccount = (accountName: string, password: string) => {
  const [acc, setAcc] = useState<LoginRetT | null>(null);

  useEffect(() => {
    const fn = async () => {
      console.log(accountName, password);
      if (!password) {
        return;
      }

      setAcc(await meta1dex.login(accountName, password));
    };
    fn();
  }, [accountName, password]);

  return acc;
};

const preprocessOrder = (order: any, userAssets: AccountBalanceT | null): HistoryRetT => {
  return {
    raw: order,
    limit_order_create_operation: {
      fee: order.deferred_paid_fee,
      seller: order.seller,
      expiration: order.expiration,
      fill_or_kill: false,
      result: { void_result: {} } as any,
      extensions: [],
      amount_to_sell: {
        ...order.sell_price.base,
        asset: userAssets!.assetsWithBalance.find(
          e => e._asset.id === order.sell_price.base.asset_id,
        )!,
      },
      min_to_receive: {
        ...order.sell_price.quote,
        asset: userAssets!.assetsWithBalance.find(
          e => e._asset.id === order.sell_price.quote.asset_id,
        )!,
      },
    },
  } as HistoryRetT;
};

const _amtToReadable = (amt: AmountT, userAssets: AccountBalanceT | null) => {
  const a = amt.amount;
  const precision =
    userAssets?.assetsWithBalance.find(e => e._asset.id === amt.asset_id)?._asset.precision || 8;
  return a / 10 ** precision;
};

export const MyOrders: React.FC<AssetViewTSP> = () => {
  const { assetA, assetB } = useAVStore(x => x);
  const { accountName, password } = useStore();
  const { userAssets } = useAssetsStore();
  const account = useAccount(accountName, password);
  // const [refreshing, setRefreshing] = React.useState(false);

  const [history, setHistory] = useState<FullHistoryOrder | null>(null);

  useEffect(() => {
    const fn = async () => {
      const hist = await getHistoricalOrders(accountName);
      // Fetch all open orders for real
      if (account) {
        const tmp: { id: string }[] = await account.orders();
        console.log(tmp);
        const open = await Promise.all(tmp.map(e => account.getOrder(e.id)));
        open.forEach(e =>
          hist.set(e.id as string, {
            order: preprocessOrder(e, userAssets),
            canceled: undefined,
            filled: [],
          }),
        );
      }
      console.log(account);
      setHistory(hist);
    };
    fn();
  }, [accountName, account]);

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

  const amtToReadable = (amt: AmountT) => _amtToReadable(amt, userAssets);

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
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
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

              // Open order
              if (canceled || filled.length || !inFuture(order.expiration)) {
                return null;
              }

              const buyAmt = amtToReadable(order.min_to_receive);

              const sellAmt = amtToReadable(order.amount_to_sell);

              const isBuy = buyingAsset.symbol === assetA;
              let progress = 0;

              return (
                <View
                  style={{
                    flexDirection: 'row',
                  }}
                  key={`OrderHistorical_${k}`}
                >
                  <View style={{ margin: 8, width: 72 }}>
                    <Text
                      style={{
                        color: isBuy ? '#0f0' : '#f00',
                        fontSize: 18,
                        textAlign: 'center',
                        marginBottom: 8,
                      }}
                    >
                      {isBuy ? 'Buy' : 'Sell'}
                    </Text>
                    <Circle progress={progress} isBuy={isBuy} />
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
                    <TouchableOpacity
                      onPress={() =>
                        //TODO: Make it refresh
                        account?.cancelOrder(k)
                      }
                    >
                      <Text
                        style={{
                          color: account ? colors.BrandYellow : '#999',
                          fontSize: 18,
                        }}
                      >
                        CANCEL
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          <Text style={{ color: '#888', textAlign: 'center' }}>
            If you are not logged in some orders may not be shown
          </Text>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
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
                      style={{
                        color: isBuy ? '#0f0' : '#f00',
                        fontSize: 18,
                        textAlign: 'center',
                        marginBottom: 8,
                      }}
                    >
                      {isBuy ? 'Buy' : 'Sell'}
                    </Text>
                    <Circle progress={progress} isBuy={isBuy} />
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
