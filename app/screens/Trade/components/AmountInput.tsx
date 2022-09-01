import React, { useEffect, useState } from 'react';
import { tid } from '../../../utils';
import optStyleFactory from '../helpers/optStyleFactory';
import useCause from '../hooks/useCause';
import Input from './Input';
import styles from '../TradeScreen.styles';
import { AssetProp, DM } from '../types';
import { validateNumber } from '../constants';

const AmountInput = ({ asset, darkMode }: DM<AssetProp>) => {
  const [amount, setAmount] = useState(asset.amount);
  const { isCause, cause } = useCause();
  useEffect(() => {
    if (!isCause) {
      setAmount(asset.amount);
    }
  }, [asset.amount, isCause]);

  const darkStyle = optStyleFactory(darkMode);
  return (
    <Input
      {...tid('TradeScreen/AmountInput/amount')}
      style={darkStyle(styles.whiteText, styles.amountInput)}
      value={amount}
      validate={validateNumber}
      keyboardType="numeric"
      onChange={(txt, valid) => {
        cause();
        setAmount(txt);
        if (valid) {
          asset.setAmount(txt);
          const opponent = asset.opponent();
          const ticker = asset.ticker;
          if (ticker && ticker.lowest_ask !== '0') {
            const bAmt = Number(txt) / Number(ticker.lowest_ask);
            opponent.setAmount(bAmt.toFixed(opponent.asset._asset.precision));
            asset.formUsdt(opponent.toUsdt(bAmt.toFixed(opponent.asset._asset.precision)));
          } else {
            opponent.formUsdt(asset.toUsdt(txt));
          }
        }
      }}
    />
  );
};

export default AmountInput;
