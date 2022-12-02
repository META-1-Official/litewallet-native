import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from '../../components/Loader';
import useAssetsOnFocus from '../../hooks/useAssets';
import { getHistoryForAsset } from '../../services/meta1Api';
import { LineChart, Grid } from 'react-native-svg-charts';
import { DexTSP } from '.';
import { dexAssetView } from './AssetView/AssetViewStore';
import { tid } from '../../utils';
const { width } = Dimensions.get('window');

const Chart: React.FC<{ symbol: string; color: string }> = ({ symbol, color }) => {
  const [data, setData] = useState<number[]>([]);
  useEffect(() => {
    let noop = false;
    async function fn() {
      await getHistoryForAsset(symbol).then(d => !noop && setData(d));
    }
    fn();

    return () => {
      noop = true;
    };
  });

  return (
    <LineChart
      style={{ width: 80 }}
      data={data}
      svg={{ stroke: color }}
      contentInset={{ top: 20, bottom: 20 }}
    >
      <Grid />
    </LineChart>
  );
};

const DexHome: React.FC<DexTSP> = ({ navigation }) => {
  const allAssets = useAssetsOnFocus();
  if (!allAssets) {
    return <Loader bgc="#000" />;
  }
  const assets = allAssets!.assetsWithBalance;
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        height: '100%',
      }}
    >
      <ScrollView style={{ marginHorizontal: 'auto' }}>
        <Text style={{ color: '#ccc' }}> Portfolio Balance</Text>
        <Text style={{ color: '#fff', fontSize: 32, fontWeight: '700' }}>
          ${allAssets?.accountTotal.toFixed(2)}
        </Text>
        <Text style={{ color: '#fff', fontSize: 21, marginTop: 18 }}> Crypto on META1</Text>
        <View
          style={{
            backgroundColor: '#1c1314',
            borderRadius: 24,
            padding: 18,
            paddingVertical: 12,
            marginTop: 18,
            //width: width - 40,
          }}
        >
          {assets.map(e => {
            return e.symbol === 'USDT' ? null : (
              <TouchableOpacity
                {...tid(`DexHome/Asset_${e.symbol}`)}
                onPress={() => dexAssetView(navigation, e.symbol)}
                key={`Asset_${e.symbol}`}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
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
                  <Chart symbol={e.symbol} color={e.delta >= 0 ? '#419e7f' : '#b02a27'} />
                  <View
                    style={{
                      width: 80,
                      marginLeft: 18,
                      alignItems: 'flex-end',
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 15 }}>
                      ${String(e.usdt_value).slice(0, 8)}
                    </Text>
                    <Text style={{ color: e.delta >= 0 ? '#419e7f' : '#b02a27' }}>
                      {e.delta >= 0 ? '+ ' : '- '}
                      {Math.abs(e.delta)}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
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
                  <Text
                    style={{ color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' }}
                  >
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
