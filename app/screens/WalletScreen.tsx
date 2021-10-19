import React, { useEffect, useState } from 'react';
import { Image, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { personIconAsset } from '../../assets';
import config from '../config';
import { useStore } from '../store';
import { With } from '../utils';
import Meta1, { iAsset } from '../utils/meta1dexTypes';

const icon = (symbol: string) => `https://cryptoicons.org/api/icon/${symbol.toLowerCase()}/128`;
const WalletScreen = () => {
  const accountName = useStore(state => state.accountName);
  const logout = useStore(state => state.logout);
  const [allAssets, setAllAssets] = useState<With<iAsset, { icon: any }>[]>([]);

  useEffect(() => {
    async function fn() {
      await Meta1.connect(config.META1_CONNECTION_URL);
      console.log('Connected!');

      const accounts = await Meta1.db
        .get_full_accounts([accountName], false)
        .then(res => new Map(res));
      const account = accounts.get(accountName);

      if (!account) {
        console.warn('Api did not return requestd account', accountName);
        logout();
      }
      // TODO: Use real fallback
      const fallback = personIconAsset;
      const _ = await Meta1.db.list_assets('', 101);
      const icons = await Promise.all(
        _.map(e =>
          fetch(icon(e.symbol), { method: 'HEAD' }).then(res =>
            res.status === 200 ? { uri: icon(e.symbol) } : fallback,
          ),
        ),
      );
      const assets = _.map((e, i) => ({ ...e, icon: icons[i] }));

      if (JSON.stringify(assets) !== JSON.stringify(allAssets)) {
        setAllAssets(assets);
      }
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
      <ScrollView>
        {allAssets &&
          allAssets.map(e => {
            return (
              <>
                <Image
                  style={{
                    width: 128,
                    height: 128,
                    resizeMode: 'contain',
                  }}
                  source={e.icon}
                />
                <Text> {e.symbol}</Text>
              </>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;
