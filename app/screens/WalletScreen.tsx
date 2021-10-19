import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//@ts-expect-error
import Meta1 from 'meta1dex';
import config from '../config';
import { useStore } from '../store';
import { fullAccount } from '../utils/meta1dexTypes';

type ArrayMap<K, V> = [K, V][];

const WalletScreen = () => {
  const accountName = useStore(state => state.accountName);
  useEffect(() => {
    Meta1.connect(config.META1_CONNECTION_URL).then((res: any) => {
      console.log('Connected!');
      console.log(res);

      Meta1.db
        .get_full_accounts([accountName.toLowerCase()], false)
        .then((r: ArrayMap<string, fullAccount>) => {
          const accounts = new Map(r);

          console.log(accountName, JSON.stringify(accounts.get('kj-test2'), null, 4));
          // TODO : Make typedefs for this fucking lib. Shouldn't be too hard
        });
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
