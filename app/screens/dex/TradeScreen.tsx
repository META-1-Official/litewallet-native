import React, { useState } from 'react';
import { SafeAreaView, ScrollView, TextInput, View } from 'react-native';
import { Search } from 'react-native-feather';

import { DexSSP } from '.';
import Loader from '../../components/Loader';
import { tid } from '../../utils';
import { useAssets } from '../../services/meta1Api';
import { useAppDispatch } from '../../hooks';
import { RenderAssetRow } from './RenderAssetRow';
import useRedirectToAsset from '../../hooks/useRedirectToAsset';

const DexTrade: React.FC<DexSSP> = ({ navigation }) => {
  const accountAssets = useAssets();
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState('');
  const showDexAsset = useRedirectToAsset(dispatch, navigation);

  if (!accountAssets) {
    return <Loader bgc="#000" />;
  }

  const assets = accountAssets!.assetsWithBalance.filter(
    asset => !searchText || asset.symbol.includes(searchText.toLocaleUpperCase()),
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
          {...tid('TradeScreen/Search')}
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
            padding: '3%',
          }}
        >
          {assets.map(asset => {
            return (
              asset.symbol !== 'USDT' && RenderAssetRow(asset, () => showDexAsset(asset.symbol))
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DexTrade;
