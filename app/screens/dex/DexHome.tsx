import React from 'react';
import { Dimensions, FlatList, Image, SafeAreaView, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from '../../components/Loader';
import useAssetsOnFocus from '../../hooks/useAssetsOnFocus';

import { DexSSP } from '.';
import { useAppDispatch } from '../../hooks';
import { RenderAssetRow } from './RenderAssetRow';
import useRedirectToAsset from '../../hooks/useRedirectToAsset';

const { width } = Dimensions.get('window');

const DexHome: React.FC<DexSSP> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const allAssets = useAssetsOnFocus();
  const showDexAsset = useRedirectToAsset(dispatch, navigation);

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
            padding: width < 330 ? '3%' : '7%', //check dimension
            paddingVertical: 12,
            marginTop: 18,
            //width: width - 40,
          }}
        >
          {assets.map(asset => {
            return asset.symbol === 'USDT'
              ? null
              : RenderAssetRow(asset, assetSymbol => showDexAsset(assetSymbol));
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
