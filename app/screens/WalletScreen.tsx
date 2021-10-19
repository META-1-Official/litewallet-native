import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import config from '../config';
import { useStore } from '../store';
import Meta1 from '../utils/meta1dexTypes';

const WalletScreen = () => {
  const accountName = useStore(state => state.accountName);
  useEffect(() => {
    async function fn() {
      await Meta1.connect(config.META1_CONNECTION_URL);
      console.log('Connected!');

      const fetchedAccounts = await Meta1.db.get_full_accounts([accountName.toLowerCase()], false);
      const accounts = new Map(fetchedAccounts);
      const account = accounts.get('kj-test2');

      if (!account) {
        console.error('Api did not return requestd account');
      }
      const assets = await Meta1.db.list_assets('', 1);
      console.log(assets[0].symbol);
    }
    fn();
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
