import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SvgIcons } from '../../../assets';
import { colors } from '../../styles/colors';
import { tid } from '../../utils';
import { setMaxAmount, editing } from './helpers';
import { AssetsProp } from './types';

const DarkFloatingButton = ({ assets }: AssetsProp) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 8,
        paddingHorizontal: 12,
      }}
    >
      <TouchableOpacity
        {...tid('TradeScreen/MAX')}
        onPress={() => {
          editing.current?.(false);
          setMaxAmount(assets);
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <SvgIcons.Wallet width={18} height={18} fill={colors.BrandYellow} />
          <Text style={{ textAlign: 'center', fontWeight: '700', marginLeft: 8 }}>MAX</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default DarkFloatingButton;
