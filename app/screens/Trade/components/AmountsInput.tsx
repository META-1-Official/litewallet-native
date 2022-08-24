import React from 'react';
import { View } from 'react-native';
import { TextSecondary } from '../../../components/typography';
import optStyleFactory from '../helpers/optStyleFactory';
import AmountInput from './AmountInput';
import UsdInput from './UsdInput';
import { AssetProp, DM } from '../types';

import styles from '../TradeScreen.styles';

const AmountsInput = ({ asset, darkMode, slave }: DM<AssetProp>) => {
  const darkStyle = optStyleFactory(darkMode);

  return (
    <View style={{ width: 120 }}>
      <AmountInput asset={asset} darkMode={darkMode} />
      <View style={styles.rowEnd}>
        <TextSecondary style={darkStyle({ color: '#fff' }, styles.usdtLabel)}>US$</TextSecondary>
        <UsdInput asset={asset} darkMode={darkMode} slave={slave} />
      </View>
    </View>
  );
};

export default AmountsInput;
