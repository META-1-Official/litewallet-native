import React from 'react';
import { FullHistoryOrder } from '../../../services/meta1Api';
import { tid } from '../../../utils';
import { Text, TouchableOpacity, View } from 'react-native';
import { localizedOrderDate } from '../../../utils/helpers';
import { isOpen } from '../../../utils/historyUtils';
import ProgressBarCircle from '../ProgressBarCircle';

export const RenderOrderRow = (
  [assetA, assetB]: string[],
  amtToReadable: any,
  currentOrder: FullHistoryOrder,
  cancelOrder: () => Promise<void>,
) => {
  const { canceled, fulfilled, status } = currentOrder;
  const order = currentOrder.order.limit_order_create_operation;

  const sellingAsset = order.amount_to_sell.asset;
  const buyingAsset = order.min_to_receive.asset;

  const buyAmt = amtToReadable(order.min_to_receive);
  const sellAmt = amtToReadable(order.amount_to_sell);

  const isBuy = buyingAsset.symbol === assetA;

  const buyPrice = sellAmt / buyAmt;
  const sellPrice = Math.min(buyAmt / sellAmt, sellAmt / buyAmt);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingRight: '5%',
      }}
      key={`OrderHistorical_${currentOrder.order_id}`}
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
        <ProgressBarCircle progress={fulfilled} isBuy={isBuy} />
      </View>
      <View style={{ margin: 16, flexGrow: 1 }}>
        <Text style={{ color: '#fff', fontSize: 16 }}>
          {assetA} / {assetB}
        </Text>
        <Text style={{ color: '#fff', fontSize: 16 }}>
          Amount:{' '}
          {(isBuy ? buyAmt : sellAmt).toFixed(
            Math.max(sellingAsset._asset.precision, buyingAsset._asset.precision),
          )}
        </Text>
        <Text style={{ color: '#fff', fontSize: 16 }}>
          Price:{' '}
          {(isBuy ? buyPrice : sellPrice)
            .toFixed(Math.min(sellingAsset._asset.precision, buyingAsset._asset.precision))
            .slice(0, 10)}
        </Text>
        <Text style={{ color: '#fff', fontSize: 16 }}>{localizedOrderDate(order.expiration)}</Text>
      </View>
      <View style={{ margin: 8 }}>
        {isOpen(canceled, order.expiration, fulfilled) ? (
          <TouchableOpacity {...tid('MyOrders/Cancel')} onPress={() => cancelOrder()}>
            <Text
              style={{
                color: '#999',
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
              fontSize: 16,
            }}
          >
            {status}
          </Text>
        )}
      </View>
    </View>
  );
};
