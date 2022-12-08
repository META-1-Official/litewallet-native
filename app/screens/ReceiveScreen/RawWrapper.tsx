import React from 'react';
import { Share, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { colors } from '../../styles/colors';
import { shadow, tid } from '../../utils';

const RawWrapper: React.FC<{
  style?: ViewStyle;
  shareMsg: string;
  width: number;
  height: number;
  selected: any;
}> = ({ style, shareMsg, children, width, height, selected }) => {
  return (
    <View
      style={{
        ...shadow.D3,
        height: height * 0.55,
        width: width * 0.8,
        backgroundColor: '#fff',
        marginRight: 12,
        borderRadius: 18,
        padding: 24,
        justifyContent: 'space-between',
        alignItems: 'center',
        ...style,
      }}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: '500',
        }}
      >
        Deposit {selected.symbol}
      </Text>
      {children}
      <TouchableOpacity
        {...tid('Recive/CopyAddress')}
        onPress={() => {
          if (shareMsg) {
            Share.share({ message: shareMsg });
          }
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: colors.BrandYellow,
          }}
        >
          Copy or share address
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RawWrapper;
