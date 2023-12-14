import React, { useEffect, useRef, useState } from 'react';
import { DM, AssetProp } from './types';
import { optStyleFactory } from './helpers';

import styles from './TradeScreen.styles';
import { TextInput, View } from 'react-native';

// todo: fix type here
const AmountInput = ({ asset, darkMode, swapAssetFlag }: DM<AssetProp>) => {
  const [amount, setAmount] = useState(asset.amount);

  const darkStyle = optStyleFactory(darkMode);

  useEffect(() => {
    const opponent = asset.opponent();
    if (swapAssetFlag) {
      setTimeout(() => {
        setAmount((+opponent.amount / opponent.marketPrice).toString());
        console.log(
          'amount input useEffect 1 if',
          asset.amount,
          asset.marketPrice,
          opponent.amount,
          opponent.marketPrice,
          amount,
        );
      }, 1000);
    } else {
      setAmount(asset.amount);
    }
    console.log(
      'amount input useEffect 1 else',
      asset.amount,
      asset.marketPrice,
      opponent.amount,
      opponent.marketPrice,
      amount,
    );
  }, [asset.amount, swapAssetFlag]);

  const changeAmountHandler = (text: string): void => {
    const correctNumber = fixInputNumber(text);
    setAmount(correctNumber);
    asset.setAmount(correctNumber);
    const opponent = asset.opponent();
    opponent.setAmount(
      (+correctNumber * opponent.marketPrice).toFixed(opponent.asset._asset.precision),
    );
    console.log(
      'changeAmountHandler',
      asset.amount,
      asset.marketPrice,
      opponent.amount,
      opponent.marketPrice,
      amount,
    );
  };

  const fixInputNumber = (value: string, lostFocus?: boolean) => {
    if (lostFocus) {
      if (value === '') {
        value = '0';
      }
      return value.trim().replace(/\.$/g, '');
    }
    const number = value
      .trim()
      .replace(/,/g, '.')
      .replace(/-/g, '')
      .replace(/ /g, '')
      .replace(/^0+/g, '')
      .replace(/^\./, '0.')
      .replace(/(^.*\.\d*)\.+/, '$1');
    return !isNaN(+number) || number === '' ? number : '0';
  };

  return (
    <View>
      <TextInput
        maxLength={16}
        style={[darkStyle(styles.whiteText, styles.amountInput)]}
        inputMode={'numeric'}
        keyboardType={'phone-pad'}
        value={amount}
        onChangeText={changeAmountHandler}
      />
    </View>
  );
};

export default AmountInput;
