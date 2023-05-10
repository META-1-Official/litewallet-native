import React, { useEffect, useState } from 'react';
import { tid } from '../../utils';
import { optStyleFactory, validateNumber } from './helpers';
import styles from './TradeScreen.styles';
import { AssetProp, DM } from './types';
import useCause from './useCause';
import Input from './Input';

const UsdInput = ({ asset, darkMode, slave, marketPrice }: DM<AssetProp>) => {
  // const [amount, setAmount] = useState(asset.toUsdt().toFixed());
  const [amount, setAmount] = useState((Number(asset.amount) * Number(marketPrice)).toFixed(2));
  const { isCause, cause } = useCause();

  useEffect(() => {
    if (!isCause) {
      // Maybe it's stupid fix todo: review it
      // setAmount((slave ? asset.opponent().toUsdt() : asset.toUsdt()).toFixed(2));
      setAmount((slave ? asset.toUsdt() : Number(asset.amount) * Number(marketPrice)).toFixed(2));
      // setAmount(asset.toUsdt().toFixed(2));
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
          asset.fromUsdt(txt);
          asset.opponent().fromUsdt(txt);
        }
      }}
    />
  );
};

export default UsdInput;
