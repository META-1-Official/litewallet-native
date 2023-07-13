import assert from 'assert';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SvgIcons } from '../../../assets';
import { useAssets } from '../../services/meta1Api';
import { colors } from '../../styles/colors';
import { tid } from '../../utils';

const TotalRow: React.FC<{ symbol: string; set: (n: number) => void }> = ({ symbol, set }) => {
  const LeText: React.FC = ({ children }) => (
    <Text style={{ marginHorizontal: 4, color: '#ccc' }}>{children}</Text>
  );
  const accountAssets = useAssets();
  if (!accountAssets) {
    return null;
  }

  const found = accountAssets.assetsWithBalance.find(e => e.symbol === symbol);
  assert(found, 'Asset not found in assets list');
  return (
    <View style={{ flexDirection: 'row', paddingBottom: 16 }}>
      <SvgIcons.wallet width={16} height={16} fill={colors.BrandYellow} />
      <LeText>
        {found.amount} {found.symbol}
        {'  | '}
      </LeText>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        <TouchableOpacity
          {...tid('LimitOrder/TotalPercent/25')}
          onPress={() => set(found.amount * 0.25)}
        >
          <LeText>25%</LeText>
        </TouchableOpacity>
        <TouchableOpacity
          {...tid('LimitOrder/TotalPercent/50')}
          onPress={() => set(found.amount * 0.5)}
        >
          <LeText>50%</LeText>
        </TouchableOpacity>
        <TouchableOpacity
          {...tid('LimitOrder/TotalPercent/75')}
          onPress={() => set(found.amount * 0.75)}
        >
          <LeText>75%</LeText>
        </TouchableOpacity>
        <TouchableOpacity
          {...tid('LimitOrder/TotalPercent/100')}
          onPress={() => set(found.amount * 1.0)}
        >
          <LeText>100%</LeText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TotalRow;
