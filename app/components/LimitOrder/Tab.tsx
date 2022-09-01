import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../styles/colors';
import { tid } from '../../utils';
import meta1dex from '../../utils/meta1dexTypes';
import { DismissKeyboardView } from '../DismissKeyboard';
import {
  useCreateOrder,
  InputRow,
  TotalRow,
  OrderType,
  usePair,
  asAsset,
  useOrderState,
  Update,
} from './misc';

interface Props {
  type: OrderType;
}

export const Tab: React.FC<Props> = ({ type }) => {
  const [assetA, assetB] = usePair(type);
  const [state, dispatch] = useOrderState(assetA, assetB, type);
  const decimals = asAsset(assetB).precision();
  const fixedB = (n: number) => n.toFixed(decimals);

  const getPrice = async () => {
    const t = await meta1dex.db.get_ticker(assetB, assetA);
    const newPrice = Number(t.lowest_ask) || Number(t.latest);
    if (type === OrderType.Sell) {
      dispatch({ type: Update.PRICE, payload: fixedB(1 / newPrice) });
    } else {
      dispatch({ type: Update.PRICE, payload: fixedB(newPrice) });
    }
  };

  useEffect(() => {
    getPrice();
  }, [assetA, assetB]);

  const clearForm = () => {
    dispatch({ type: Update.AMOUNT, payload: '0' });
    getPrice();
  };

  const { createOrder } = useCreateOrder(assetB, assetA, type);

  const handleOrderPlacement = async () => {
    await createOrder(Number(state.price), Number(state.total));
    clearForm();
  };

  return (
    <DismissKeyboardView style={{ flexGrow: 1, padding: 12 }}>
      <InputRow
        title={`AT PRICE | ${assetB}`}
        value={state.price}
        onChange={payload => dispatch({ type: Update.PRICE, payload })}
        onDec={() => dispatch({ type: Update.DEC_PRICE })}
        onInc={() => dispatch({ type: Update.INC_PRICE })}
      />
      <InputRow
        title={`AMOUNT | ${assetA}`}
        value={state.amount}
        onChange={payload => dispatch({ type: Update.AMOUNT, payload })}
        onDec={() => dispatch({ type: Update.DEC_AMOUNT })}
        onInc={() => dispatch({ type: Update.INC_AMOUNT })}
      />
      <InputRow
        title={`TOTAL | ${assetB}`}
        value={state.total}
        onChange={payload => dispatch({ type: Update.FROM_TOTAL, payload })}
      />
      <TotalRow
        symbol={assetB.toString()}
        set={n => {
          dispatch({ type: Update.TOTAL, payload: n.toString() });
        }}
      />
      <TouchableOpacity {...tid('LimitOrder/ActionButton')} onPress={handleOrderPlacement}>
        <View
          style={{
            backgroundColor: colors.BrandYellow,
            alignItems: 'center',
            padding: 18,
            marginVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '500' }}>{type}</Text>
        </View>
      </TouchableOpacity>
    </DismissKeyboardView>
  );
};

export const BuyTab = () => <Tab type={OrderType.Buy} />;
export const SellTab = () => <Tab type={OrderType.Sell} />;
