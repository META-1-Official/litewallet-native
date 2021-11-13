import React from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAssets } from '../../utils/meta1Api';

const DexHome: React.FC = () => {
  const accountAssets = useAssets();
  const assets = accountAssets!.assetsWithBalance;
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        height: '100%',
      }}
    >
      <ScrollView style={{ marginHorizontal: 12 }}>
        <Text style={{ color: '#ccc' }}> Portfolio Balance</Text>
        <Text style={{ color: '#fff', fontSize: 32, fontWeight: '700' }}>
          ${accountAssets?.accountTotal.toFixed(2)}
        </Text>
        <Text style={{ color: '#fff', fontSize: 21, marginTop: 18 }}> Crypto on META1</Text>
        <View
          style={{
            backgroundColor: '#1c1314',
            borderRadius: 24,
            padding: 18,
            paddingVertical: 12,
            marginTop: 18,
          }}
        >
          {assets.map(e => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  // padding: 8,
                  marginVertical: 12,
                }}
              >
                <View style={{ flexDirection: 'row', width: 144 }}>
                  <Image
                    source={e._asset.icon}
                    style={{
                      width: 48,
                      height: 48,
                      resizeMode: 'contain',
                    }}
                  />
                  <View style={{ marginLeft: 8 }}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>{e.symbol}</Text>
                    <Text style={{ color: '#fff', fontSize: 12 }}>{e.symbol}</Text>
                  </View>
                </View>
                <View style={{ width: 64, borderBottomColor: '#fff', borderBottomWidth: 1 }} />
                <View
                  style={{
                    width: 80,
                    marginLeft: 18,
                    alignItems: 'flex-end',
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 15 }}>${e.usdt_value.toFixed(2)}</Text>
                  <Text style={{ color: e.delta > 0 ? '#419e7f' : '#b02a27' }}>
                    {e.delta > 0 ? '+ ' : '- '}
                    {Math.abs(e.delta)}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DexHome;
