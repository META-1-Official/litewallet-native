import React, { useEffect, useState } from 'react';
import { tid } from '../../../utils';
import optStyleFactory from '../helpers/optStyleFactory';
import useCause from '../hooks/useCause';
import Input from './Input';
import styles from '../TradeScreen.styles';
import { AssetProp, DM } from '../types';
import { validateNumber } from '../constants';

const UsdInput = ({ asset, darkMode }: DM<AssetProp>) => {
  const [amount, setAmount] = useState(asset.toUsdt().toFixed());
  const { isCause, cause } = useCause();

  useEffect(() => {
    if (!isCause) {
      // Maybe it's stupid fix todo: review it
      // setAmount((slave ? asset.toUsdt(asset.opponent().amount) : asset.toUsdt()).toFixed(2));
      setAmount(asset.toUsdt().toFixed(2));
    }
  }, [asset.amount, isCause]);

  const darkStyle = optStyleFactory(darkMode);
  return (
    <Input
      {...tid('TradeScreen/AmountInput/amountUsd')}
      style={darkStyle({ color: '#fff' }, styles.usdInput)}
      maxLength={7}
      value={amount}
      validate={validateNumber}
      keyboardType="numeric"
      onChange={(txt, valid) => {
        cause();
        setAmount(txt);
        if (valid) {
          asset.formUsdt(txt);
          asset.opponent().formUsdt(txt);
        }
      }}
    />
  );
};

export default UsdInput;
