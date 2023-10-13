import React, { useEffect } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useAppSelector from '../../../hooks/useAppSelector';
import { colors } from '../../../styles/colors';
import { catchError, getPassword, tid } from '../../../utils';
import { AmountT, useAssetsStore, _login, HistoryRetT } from '../../../services/meta1Api';
import { useNewLoaderModal } from '../../../components/LoaderModal';
import useTabs from '../../../hooks/useTabs';
import { _amtToReadable } from '../helpers';
import { RenderOrderRow } from './RenderOrderRow';
import { historicalOrdersSelector, openedOrdersSelector } from '../../../store/dex/dex.helper';

const { width } = Dimensions.get('screen');

const MyOrders: React.FC = () => {
  const { accountName } = useAppSelector(state => state.wallet);
  const { userAssets } = useAssetsStore();
  const { tab, lt, rt, offsetX } = useTabs(width);
  const openedOrders = useAppSelector(state => openedOrdersSelector(state.dex));
  const historicalOrders = useAppSelector(state => historicalOrdersSelector(state.dex));
  const { assetA, assetB } = useAppSelector(state => state.dex.tradingPair);

  const loader = useNewLoaderModal();

  useEffect(() => {}, [openedOrders.length]);

  const getTradingPair = (order: HistoryRetT) => {
    const A = order?.limit_order_create_operation.min_to_receive.asset.symbol;
    const B = order?.limit_order_create_operation.amount_to_sell.asset.symbol;
    if (A === 'USDT') {
      return [B, A];
    }
    return [A, B];
  };

  const amtToReadable = (amt: AmountT) => _amtToReadable(amt, userAssets);

  const cancelOrder = async (orderId: string) =>
    catchError(async () => {
      const passwd = await getPassword();
      if (!passwd) {
        return;
      }
      const authorized = await _login(accountName, passwd);
      loader.open();
      await authorized.cancelOrder(orderId);
      loader.close();
    });

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
        {(tab === 0 ? openedOrders.length : historicalOrders.length) === 0 ? (
          <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center', paddingTop: '50%' }}>
            NO ORDERS
          </Text>
        ) : (
          (tab === 0 ? openedOrders : historicalOrders).map(order =>
            RenderOrderRow(
              assetA ? [assetA, assetB] : getTradingPair(order.order),
              amtToReadable,
              order,
              () => cancelOrder(order.order_id),
            ),
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyOrders;
