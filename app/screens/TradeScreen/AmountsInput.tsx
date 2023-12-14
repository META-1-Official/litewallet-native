import React from 'react';
import { View } from 'react-native';
import { TextSecondary } from '../../components/typography';
import AmountInput from './AmountInput';
import { optStyleFactory } from './helpers';
import styles from './TradeScreen.styles';
import { AssetProp, DM } from './types';
import UsdInput from './UsdInput';

// todo: fix type here
const AmountsInput = ({ asset, darkMode, slave, swapAssetFlag }: DM<AssetProp>) => {
  const darkStyle = optStyleFactory(darkMode);

  return (
    <View style={{ width: 120 }}>
      <AmountInput asset={asset} darkMode={darkMode} slave={slave} swapAssetFlag={swapAssetFlag} />
      <View style={styles.rowEnd}>
        <TextSecondary style={darkStyle({ color: '#fff' }, styles.usdtLabel)}>US$</TextSecondary>
        <UsdInput asset={asset} darkMode={darkMode} slave={slave} />
      </View>
    </View>
  );
};

export default AmountsInput;
