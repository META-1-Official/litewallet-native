import React from 'react';
import { Image, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Heading, TextSecondary } from '../../components/typography';
import { tid } from '../../utils';
import { optStyleFactory } from './helpers';
import { DM, AssetProp } from './types';
import styles from './TradeScreen.styles';

const AssetDisplay = ({ asset, darkMode }: DM<AssetProp>) => {
  const darkStyle = optStyleFactory(darkMode);

  return (
    <TouchableOpacity {...tid('TradeScreen/SelectAsset')} onPress={() => asset.open()}>
      <View style={styles.rowCenter}>
        <Image style={styles.assetIcon} source={asset.asset._asset.icon /*Bruh wtf is dis */} />
        <View>
          <Heading style={darkStyle(styles.whiteText, styles.font18x500)}>
            {asset.asset.symbol}
          </Heading>
          <TextSecondary style={styles.font14}>
            Balance: {asset.asset.amount.toFixed(asset.asset._asset.precision)}
          </TextSecondary>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AssetDisplay;
