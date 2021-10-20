import React, { useEffect, useState } from 'react';
import { Image, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { jsonEquals } from '../utils';
import { AllAssetsT, fetchAccountBalances, fetchAllAssets } from './../utils/meta1Api';

const WalletScreen = () => {
  const accountName = useStore(state => state.accountName);
  const [allAssets, setAllAssets] = useState<AllAssetsT>([]);

  useEffect(() => {
    async function fn() {
      console.log('Connected!');

      const balances = await fetchAccountBalances(accountName);
      console.log(balances);

      const assets = await fetchAllAssets();
      if (!jsonEquals(assets, allAssets)) {
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
