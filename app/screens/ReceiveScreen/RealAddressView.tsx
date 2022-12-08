import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

const RealAddressView = ({ realAddress, width }: { realAddress: any; width: number }) => {
  if (!realAddress) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  if (realAddress.addr === '') {
    return (
      <View>
        <Text>Failed to get address</Text>
      </View>
    );
  } else {
    return (
      <View
        style={{
          alignItems: 'center',
        }}
      >
        <SvgXml xml={realAddress.qr} width={width * 0.6} height={width * 0.6} />
        <Text style={{ textAlign: 'center', padding: 12 }}>{realAddress.addr}</Text>
      </View>
    );
  }
};

export default RealAddressView;
