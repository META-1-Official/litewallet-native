import React from 'react';
import { Text, View } from 'react-native';
import { colors } from '../../styles/colors';
import { shadow } from '../../utils';

const UsernameDepositView = ({ accountName }: { accountName: string }) => {
  return (
    <View
      style={{
        alignItems: 'center',
      }}
    >
      <View
        style={{
          ...shadow.D3,
          width: 100,
          height: 100,
          borderRadius: 100,
          backgroundColor: '#fff',
          padding: 8,
          margin: 32,
        }}
      >
        <Text
          style={{
            fontSize: 72,
            textAlign: 'center',
            color: colors.BrandYellow,
          }}
        >
          {accountName[0]}
        </Text>
      </View>
      <Text style={{ fontSize: 28, marginBottom: 16 }}>@{accountName}</Text>
      <Text style={{ textAlign: 'center', fontSize: 16 }}>
        Accept From Other META1 Wallet Users
      </Text>
    </View>
  );
};

export default UsernameDepositView;
