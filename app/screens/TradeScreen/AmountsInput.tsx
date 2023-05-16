import React from 'react';
import { View } from 'react-native';
import { TextSecondary } from '../../components/typography';
import AmountInput from './AmountInput';
import { optStyleFactory } from './helpers';
import styles from './TradeScreen.styles';
import { AssetProp, DM } from './types';
import UsdInput from './UsdInput';

const AmountsInput = ({ asset, darkMode, slave, marketPrice }: DM<AssetProp>) => {
  const darkStyle = optStyleFactory(darkMode);

  return (
    <View style={{ width: 120 }}>
      <AmountInput asset={asset} darkMode={darkMode} marketPrice={marketPrice} slave={slave} />
      <View style={styles.rowEnd}>
        <TextSecondary style={darkStyle({ color: '#fff' }, styles.usdtLabel)}>US$</TextSecondary>
        <UsdInput asset={asset} darkMode={darkMode} slave={slave} marketPrice={marketPrice} />
      </View>
    </View>
  );
};

export default AmountsInput;
