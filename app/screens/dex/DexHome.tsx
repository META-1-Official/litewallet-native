import React from 'react';
import { FlatList, Image, SafeAreaView, Text, View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from '../../components/Loader';
import { getHistoryForAsset, useAssets } from '../../utils/meta1Api';

const { width } = Dimensions.get('screen');
const DexHome: React.FC = () => {
  const accountAssets = useAssets();
  if (!accountAssets) {
    return <Loader bgc="#000" />;
  }
  const assets = accountAssets!.assetsWithBalance;
  getHistoryForAsset('ETH');
  console.log(JSON.stringify(assets[0]._asset, null, 4));
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
                key={`Asset_${e.symbol}`}
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
                  <Text style={{ color: e.delta >= 0 ? '#419e7f' : '#b02a27' }}>
                    {e.delta >= 0 ? '+ ' : '- '}
                    {Math.abs(e.delta)}%
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={{ paddingBottom: 24 }}>
          <Text style={{ color: '#fff', fontSize: 21, marginTop: 18, marginBottom: 24 }}>
            New Crypto on META1
          </Text>
          <FlatList
            data={assets.slice(0, 4)}
            horizontal
            pagingEnabled
            renderItem={({ item, index }) => {
              return (
                <View
                  key={`New_${index}`}
                  style={{
                    justifyContent: 'center',
                    padding: 32,
                    backgroundColor: '#1c1314',
                    borderRadius: 24,
                    width: width / 2.2,
                    height: width / 2.2,
                    marginRight: 8,
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={item._asset.icon}
                    style={{ width: 64, height: 64, resizeMode: 'contain' }}
                  />
                  <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                    {item.symbol}: $
                    {item.usdt_value > 1000
                      ? item.usdt_value.toFixed(0)
                      : item.usdt_value.toFixed(2)}
                  </Text>
                  <Text
                    style={{
                      color: item.delta >= 0 ? '#419e7f' : '#b02a27',
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}
                  >
                    {item.delta >= 0 ? '+ ' : '- '}
                    {Math.abs(item.delta)}%
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DexHome;
