import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Search } from 'react-native-feather';
import { Grid, LineChart } from 'react-native-svg-charts';
import { DexTSP } from '.';
import Loader from '../../components/Loader';
import { getHistoryForAsset, useAssets } from '../../utils/meta1Api';
import { dexAssetView } from './AssetView/AssetViewStore';

const Chart: React.FC<{ symbol: string; color: string }> = ({ symbol, color }) => {
  const [data, setData] = useState<number[]>([1, 1]);
  useEffect(() => {
    async function fn() {
      await getHistoryForAsset(symbol).then(d => setData(d));
    }
    fn();
  }, [symbol]);

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

const DexTrade: React.FC<DexTSP> = ({ navigation }) => {
  const accountAssets = useAssets();
  const [searchText, setSearchText] = useState('');

  if (!accountAssets) {
    return <Loader bgc="#000" />;
  }

  const assets = accountAssets!.assetsWithBalance.filter(
    e => !searchText || e.symbol.includes(searchText.toLocaleUpperCase()),
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#000', height: '100%' }}>
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: 12,
          borderWidth: 1,
          padding: 12,
          borderColor: '#444',
          borderRadius: 8,
        }}
      >
        <Search width={24} height={24} color="#fff" />
        <TextInput
          style={{
            alignSelf: 'stretch',
            flexGrow: 1,
            marginLeft: 8,
            color: '#fff',
            fontSize: 18,
            height: 24,
            padding: 0,
          }}
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={t => setSearchText(t)}
        />
      </View>
      <ScrollView style={{ marginHorizontal: 'auto' }}>
        <View
          style={{
            marginTop: 18,
            padding: 18,
          }}
        >
          {assets.map(e => {
            return (
              <TouchableOpacity
                onPress={() => dexAssetView(navigation, e.symbol)}
                key={`Asset_${e.symbol}`}
              >
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
                  <Chart symbol={e.symbol} color={e.delta >= 0 ? '#419e7f' : '#b02a27'} />
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
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DexTrade;
