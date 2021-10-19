import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//@ts-expect-error
import Meta1 from 'meta1dex';
import config from '../config';

const WalletScreen = () => {
  useEffect(() => {
    Meta1.connect(config.META1_CONNECTION_URL).then((res: any) => {
      console.log('Connected!');
      console.log(res);
    });
  });
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Text> XUI </Text>
    </SafeAreaView>
  );
};

export default WalletScreen;
