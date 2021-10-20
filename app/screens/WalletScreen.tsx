import React, { useEffect, useState } from 'react';
import { Button, Dimensions, Image, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { grey200 } from 'react-native-paper/src/styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { jsonEquals } from '../utils';
import { AssetBalanceT, fetchAccountBalances } from './../utils/meta1Api';

const { width } = Dimensions.get('screen');
const WalletScreen = () => {
  const accountName = useStore(state => state.accountName);
  const [allAssets, setAllAssets] = useState<AssetBalanceT[]>([]);
  const logout = useStore(state => state.logout);
  useEffect(() => {
    async function fn() {
      console.log('Connected!');

      const balances = await fetchAccountBalances(accountName);

      console.log(balances);
      if (!jsonEquals(balances, allAssets)) {
        setAllAssets(balances!);
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
      <Button title="Logout" onPress={() => logout()} />
      <ScrollView>
        {allAssets &&
          allAssets.map((e, i) => {
            return (
              <View
                key={`CoinBalance_${i}`}
                style={{
                  flexDirection: 'row',
                  width,
                  backgroundColor: i % 2 !== 0 ? grey200 : '#fff',
                  justifyContent: 'space-between',
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={{
                      width: 48,
                      height: 48,
                      resizeMode: 'contain',
                      marginRight: 8,
                    }}
                    source={e._asset.icon}
                  />
                  <Text> {e.symbol}</Text>
                </View>

                <Text> {e.amount} </Text>
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;
