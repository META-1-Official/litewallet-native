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
import useAppSelector from '../../../hooks/useAppSelector';
import { colors } from '../../../styles/colors';
import { catchError, getPassword, tid } from '../../../utils';
import {
  AccountBalanceT,
  AmountT,
  FullHistoryOrder,
  getHistoricalOrders,
  useAssetsStore,
  _login,
} from '../../../services/meta1Api';
import { useAVStore } from './AssetViewStore';
import { LoginRetT } from '../../../utils/meta1dexTypes';
import { isOpen, isResolved, preprocessOrder } from '../../../utils/historyUtils';
import { useNewLoaderModal } from '../../../components/LoaderModal';
import { RenderRow } from './RenderRow';
const { width } = Dimensions.get('screen');

const useAccount = (accountName: string, password: string) => {
  const [acc, setAcc] = useState<LoginRetT | null>(null);

  useEffect(() => {
    const fn = async () => {
      if (!password) {
        return;
      }

      setAcc(await _login(accountName, password));
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

const _amtToReadable = (amt: AmountT, userAssets: AccountBalanceT | null) => {
  const a = amt.amount;
  const precision =
    userAssets?.assetsWithBalance.find(e => e._asset.id === amt.asset_id)?._asset.precision || 8;
  return a / 10 ** precision;
};

type HistoryEntry = Exclude<ReturnType<FullHistoryOrder['get']>, undefined>;

interface MyOrdersProps {
  isAllOrders?: boolean;
}

const MyOrders: React.FC<MyOrdersProps> = ({ isAllOrders = false }) => {
  const { assetA, assetB } = useAVStore(x => x);
  const { accountName, password } = useAppSelector(state => state.wallet);
  const { userAssets } = useAssetsStore();
  const account = useAccount(accountName, password);
  const { tab, lt, rt, offsetX } = useTabs();

  const [refreshing, setRefreshing] = React.useState(false);
  const [history, setHistory] = useState<FullHistoryOrder | null>(null);

  const loader = useNewLoaderModal();

  const getTradingPair = ({ order }: HistoryEntry) => {
    const A = order.limit_order_create_operation.min_to_receive.asset.symbol;
    const B = order.limit_order_create_operation.amount_to_sell.asset.symbol;
    if (A === 'USDT') {
      return [B, A];
    }
    return [A, B];
  };

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
      setHistory(hist);
      if (refreshing) {
        loader.close();
        setRefreshing(false);
      }
    };
    fn();
  }, [accountName, account, refreshing, userAssets]);

  const amtToReadable = (amt: AmountT) => _amtToReadable(amt, userAssets);

  const cancelOrder = async (orderId: string) =>
    catchError(async () => {
      console.log('canceling');
      // if (account) {
      //   return await account.cancelOrder(orderId);
      // }

      const passwd = await getPassword();
      if (!passwd) {
        return;
      }

      const authorized = await _login(accountName, passwd);
      loader.open();
      await authorized.cancelOrder(orderId);
      setRefreshing(true);
    });

  // const count = (reject: RejectFn) => {
  //   let n = 0;
  //   history?.forEach(v => {
  //     const { canceled, filled } = v;
  //     const order = v.order.limit_order_create_operation;
  //     if (!reject(canceled, filled, order)) {
  //       // checking for open orders
  //       if (
  //         (order.min_to_receive.asset.symbol === assetB &&
  //           order.amount_to_sell.asset.symbol === assetA) ||
  //         (order.min_to_receive.asset.symbol === assetA &&
  //           order.amount_to_sell.asset.symbol === assetB)
  //       ) {
  //         n++;
  //       }
  //     }
  //   });
  //   return n;
  // };

  return (
    <SafeAreaView style={{ height: '100%', backgroundColor: '#000', padding: 12 }}>
      <View style={{ flexDirection: 'row', paddingVertical: 12 }}>
        <TouchableOpacity
          {...tid('MyOrders/Open')}
          onPress={lt}
          style={{
            flexGrow: 1,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>OPEN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          {...tid('MyOrders/History')}
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
      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        {history &&
          [...history.entries()].map(order => {
            return RenderRow(
              isAllOrders ? getTradingPair(order[1]) : [assetA, assetB],
              amtToReadable,
              tab === 0 ? isOpen : isResolved,
              order,
              () => cancelOrder(order[0]),
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyOrders;
