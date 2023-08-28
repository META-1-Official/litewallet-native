import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { AssetBalanceT } from '../../services/meta1Api';
import { tid } from '../../utils';
import AssetChart from './AssetChart';

export const RenderAssetRow = (
  asset: AssetBalanceT,
  showDexAsset: (assetSymbol: string) => void,
) => {
  const handlePressAsset = () => showDexAsset(asset.symbol);

  return (
    <TouchableOpacity
      {...tid(`DexTrade/Asset_${asset.symbol}`)}
      onPress={handlePressAsset}
      key={`Asset_${asset.symbol}`}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          // padding: 8,
          marginVertical: 12,
        }}
      >
        <View style={{ flexDirection: 'row', width: 120 }}>
          <Image
            source={asset._asset.icon}
            style={{
              width: 48,
              height: 48,
              resizeMode: 'contain',
            }}
          />
          <View style={{ marginLeft: 8 }}>
            <Text style={{ color: '#fff', fontSize: 16 }}>{asset.symbol}</Text>
            <Text style={{ color: '#fff', fontSize: 12 }}>{asset.symbol}</Text>
          </View>
        </View>
        <AssetChart symbol={asset.symbol} color={asset.delta >= 0 ? '#419e7f' : '#b02a27'} />
        <View
          style={{
            width: 80,
            marginLeft: 18,
            alignItems: 'flex-end',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 15 }}>${asset.usdt_value.toFixed(2)}</Text>
          <Text style={{ color: asset.delta >= 0 ? '#419e7f' : '#b02a27' }}>
            {asset.delta >= 0 ? '+ ' : '- '}
            {Math.abs(asset.delta)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
