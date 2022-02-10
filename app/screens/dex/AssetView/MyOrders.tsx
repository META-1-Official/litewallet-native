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
  FilledRetT,
  FullHistoryOrder,
  getHistoricalOrders,
  HistoryRetT,
  limitOrderObjExt,
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

const useTabs = () => {
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
  return { tab, lt, rt, offsetX };
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

type HistoryEntry = Exclude<ReturnType<FullHistoryOrder['get']>, undefined>;
export const OpenOrdersPage = () => {
  const { accountName, password } = useStore();
  const { userAssets } = useAssetsStore();
  const account = useAccount(accountName, password);

  const amtToReadable = (amt: AmountT) => _amtToReadable(amt, userAssets);

  const [refreshing, setRefreshing] = React.useState(false);
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
      if (refreshing) {
        setRefreshing(false);
      }
    };
    fn();
  }, [accountName, account, refreshing, userAssets]);

  const getTradingPair = ({ order }: HistoryEntry) => {
    const give = order.limit_order_create_operation.amount_to_sell.asset.symbol;
    const get = order.limit_order_create_operation.min_to_receive.asset.symbol;
    return [give, get];
  };
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
      {!history || [...history.entries()].length === 0 ? (
        <Text style={{ color: '#888', textAlign: 'center' }}>No orders</Text>
      ) : null}
      {history &&
        [...history.entries()].map(e =>
          RenderRow(
            getTradingPair(e[1]),
            amtToReadable,
            () => false,
            (status, k) =>
              !inFuture(e[1].order.limit_order_create_operation.expiration) &&
              !e[1].canceled &&
              !e[1].filled ? (
                <TouchableOpacity
                  onPress={() => {
                    setRefreshing(true);
                    account?.cancelOrder(k);
                  }}
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
              ) : (
                <Text
                  style={{
                    color: status === 'Completed' ? '#0f0' : '#f00',
                    fontSize: 18,
                  }}
                >
                  {status}
                </Text>
              ),
          )(e),
        )}
    </ScrollView>
  );
};

export const MyOrders: React.FC<AssetViewTSP> = () => {
  const { assetA, assetB } = useAVStore(x => x);
  const { accountName, password } = useStore();
  const { userAssets } = useAssetsStore();
  const account = useAccount(accountName, password);
  const { tab, lt, rt, offsetX } = useTabs();

  const [refreshing, setRefreshing] = React.useState(false);
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
      if (refreshing) {
        setRefreshing(false);
      }
    };
    fn();
  }, [accountName, account, refreshing, userAssets]);

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
            [...history.entries()].map(
              RenderRow(
                [assetA, assetB],
                amtToReadable,
                (canceled, filled, order) =>
                  canceled || filled.length || !inFuture(order.expiration),
                (_, k) => (
                  <TouchableOpacity
                    onPress={() => {
                      setRefreshing(true);
                      account?.cancelOrder(k);
                    }}
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
                ),
              ),
            )}
          <Text style={{ color: '#888', textAlign: 'center' }}>
            If you are not logged in some orders may not be shown
          </Text>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
          {history &&
            [...history.entries()].map(
              RenderRow(
                [assetA, assetB],
                amtToReadable,
                (canceled, filled, order) =>
                  !canceled && !filled.length && inFuture(order.expiration),
                orderStatus => (
                  <Text
                    style={{
                      color: orderStatus === 'Completed' ? '#0f0' : '#f00',
                      fontSize: 18,
                    }}
                  >
                    {orderStatus}
                  </Text>
                ),
              ),
            )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default MyOrders;

type EValT = [
  string,
  {
    order: HistoryRetT;
    canceled: any;
    filled: FilledRetT[];
  },
];
const RenderRow =
  (
    [assetA, assetB]: string[],
    amtToReadable: any,
    reject: (canceled: any, filled: FilledRetT[], order: limitOrderObjExt) => boolean,
    lastCol: (orderStaus: string, k: string) => JSX.Element,
  ) =>
  ([k, v]: EValT) => {
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

    if (reject(canceled, filled, order)) {
      return null;
    }

    const buyAmt = amtToReadable(order.min_to_receive);
    const sellAmt = amtToReadable(order.amount_to_sell);

    console.log(JSON.stringify({ order }, null, 4));
    console.log({ buyAmt, sellAmt });

    const meanFilled =
      filled.reduce<number>((acc, e) => {
        const realPayed = amtToReadable(e.fill_order_operation.pays);
        const realGot = amtToReadable(e.fill_order_operation.receives);
        const price = realPayed / realGot;
        return acc + price;
      }, 0) / filled.length;

    const isBuy = buyingAsset.symbol === assetA;
    const orderStatus = filled.length ? 'Completed' : canceled ? 'Canceled' :'Expired';
    let progress = 0;
    if (filled.length) {
      const pays = filled.reduce(
        (acc, { fill_order_operation: fillOp }) =>
          acc + amtToReadable(!isBuy ? fillOp.receives : fillOp.pays),
        0,
      );
      progress = pays / (isBuy ? sellAmt : buyAmt);
    }

    const buyPrice = filled.length ? meanFilled : sellAmt / buyAmt;
    const sellPirce = filled.length ? 1 / meanFilled : buyAmt / sellAmt;
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
        <View style={{ margin: 8, flexGrow: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18 }}>
            {assetA} / {assetB}
          </Text>
          <Text style={{ color: '#fff', fontSize: 18 }}>
            Amount: {isBuy ? buyAmt / sellAmt : sellAmt}
          </Text>
          <Text style={{ color: '#fff', fontSize: 18 }}>
            Price: {(isBuy ? buyPrice : sellPirce).toString().slice(0, 8)}
          </Text>
        </View>
        <View style={{ margin: 8 }}>{lastCol(orderStatus, k)}</View>
      </View>
    );
  };
