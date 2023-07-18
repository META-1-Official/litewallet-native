import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../../styles/colors';
import { tid } from '../../utils';
import { editing, setMaxAmount } from './helpers';
import { AssetsProp } from './types';

const FloatingButton = ({ assets }: AssetsProp) => {
  return (
    <View
      style={{
        alignSelf: 'flex-end',
        zIndex: 1000,
        elevation: 3,
        backgroundColor: '#330000',
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
        <Text style={{ textAlign: 'center', color: colors.BrandYellow, fontWeight: '700' }}>
          MAX
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButton;
