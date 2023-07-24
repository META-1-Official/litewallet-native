import React from 'react';
import * as RNSvg from 'react-native-svg';
import { OrderType } from '../../../utils/historyUtils';
import { FilledRetT, HistoryRetT } from '../../../services/meta1Api';
import { inFuture, tid } from '../../../utils';
import { Text, TouchableOpacity, View } from 'react-native';
import { ProgressCircle } from 'react-native-svg-charts';
import { localizedOrderDate } from '../../../utils/helpers';

const Circle = ({ progress, isBuy }: { progress: number; isBuy: boolean }) => {
  const label = Math.min(100, Math.round(progress * 10000)).toString();
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
        x={-1 * Math.round(label.length * 3.33) - 0.5}
        y="3.7"
        fill={isBuy ? '#0f0' : '#f00'}
      >
        {label}
      </RNSvg.Text>
    </ProgressCircle>
  );
};

type Order = [
  string,
  {
    order: HistoryRetT;
    canceled: any;
    filled: FilledRetT[];
  },
];

export const RenderRow = (
  [assetA, assetB]: string[],
  amtToReadable: any,
  orderType: OrderType,
  currentOrder: Order,
  cancelOrder: () => Promise<void>,
) => {
  const { canceled, filled } = currentOrder[1];
  const order = currentOrder[1].order.limit_order_create_operation;

  const sellingAsset = order.amount_to_sell.asset;
  const buyingAsset = order.min_to_receive.asset;

  if (
    ![assetA, assetB].includes(sellingAsset.symbol) ||
    ![assetA, assetB].includes(buyingAsset.symbol)
  ) {
    return null;
  }

  if (orderType(canceled, filled, order)) {
    return null;
  }

  const buyAmt = amtToReadable(order.min_to_receive);
  const sellAmt = amtToReadable(order.amount_to_sell);

  const meanFilled =
    filled.reduce<number>((acc, e) => {
      const realPayed = amtToReadable(e.fill_order_operation.pays);
      const realGot = amtToReadable(e.fill_order_operation.receives);
      const price = realPayed / realGot;
      return acc + price;
    }, 0) / filled.length;

  const isBuy = buyingAsset.symbol === assetA;
  const getOrderStatus = () => {
    if (filled.length) {
      return 'Completed';
    }

    if (canceled) {
      return 'Cancelled';
    }

    if (!inFuture(order.expiration)) {
      return 'Expired';
    }

    return 'Open';
  };

  const orderStatus = getOrderStatus();
  let progress = 0;
  if (filled.length) {
    const pays = filled.reduce(
      (acc, { fill_order_operation: fillOp }) =>
        acc + amtToReadable(!isBuy ? fillOp.receives : fillOp.pays),
      0,
    );
    progress = pays / (isBuy ? sellAmt : buyAmt);
  }

  console.log('Order:', order);

  const buyPrice = filled.length ? meanFilled : sellAmt / buyAmt;
  const sellPrice = Math.max(buyAmt / sellAmt, sellAmt / buyAmt);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingRight: '5%',
      }}
      key={`OrderHistorical_${currentOrder[0]}`}
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
          Amount:{' '}
          {(isBuy ? buyAmt : sellAmt).toFixed(
            Math.max(sellingAsset._asset.precision, buyingAsset._asset.precision),
          )}
        </Text>
        <Text style={{ color: '#fff', fontSize: 18 }}>
          Price:{' '}
          {(isBuy ? buyPrice : sellPrice)
            .toFixed(Math.min(sellingAsset._asset.precision, buyingAsset._asset.precision))
            .slice(0, 10)}
        </Text>
        <Text style={{ color: '#fff', fontSize: 18 }}>{localizedOrderDate(order.expiration)}</Text>
      </View>
      <View style={{ margin: 8 }}>
        {/* {orderType(!canceled, !filled.length, inFuture(order.expiration)) ? ( */}
        {!canceled && !filled.length && inFuture(order.expiration) ? (
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
              color: orderStatus === 'Completed' ? '#0f0' : '#f00',
              fontSize: 18,
            }}
          >
            {orderStatus}
          </Text>
        )}
      </View>
    </View>
  );
};
