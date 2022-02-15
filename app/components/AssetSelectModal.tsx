import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCardAnimation } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  Animated,
  BackHandler,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { X } from 'react-native-feather';
import { useScroll } from '../utils';
import { AssetBalanceT, useAssets } from '../utils/meta1Api';
import { RootStackNP } from '../WalletNav';
import { TextSecondary } from './typography';

interface AssetPickerProps {
  key: string;
  title: string;
  onClose: (...args: any[]) => void;
  onSelect: (asset: AssetBalanceT) => void;
}
const { width, height } = Dimensions.get('screen');

const Search = ({ onSelect }: Pick<AssetPickerProps, 'onSelect'>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const allAssets = useAssets();

  const found = allAssets!.assetsWithBalance
    .filter(ass => ass.symbol.includes(searchTerm.toUpperCase()))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
  const pad = (
    <View
      style={{
        height,
      }}
    >
      {found &&
        found.map(e => (
          <TouchableOpacity key={`FoundCoin_${e.symbol}`} onPress={() => onSelect(e)}>
            <View style={styles.portfolioRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={styles.coinIcon} source={e._asset.icon} />
                <Text style={styles.textPrimary}> {e.symbol}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
  return (
    <View>
      <TextInput
        placeholder="Search for a coin..."
        // value={searchTerm}
        onChangeText={t => {
          console.log(t);
          setSearchTerm(t);
        }}
        placeholderTextColor="#5a6777"
        style={{
          color: '#000',
          fontSize: 18,
          padding: 12,
          paddingHorizontal: 24,
          backgroundColor: '#eff0f2',
          borderRadius: 100,
          marginVertical: 24,
        }}
      />
      {!searchTerm ? null : pad}
    </View>
  );
};

const PickerContent = ({ onSelect }: Pick<AssetPickerProps, 'onSelect'>) => {
  const allAssets = useAssets();
  const scroll = useScroll();
  const suggested = allAssets!.assetsWithBalance
    .filter(ass => ass.symbol === 'BTC' || ass.symbol === 'ETH' || ass.symbol === 'META1')
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  const rest = allAssets!.assetsWithBalance
    .filter(ass => !suggested.includes(ass))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  return (
    <>
      <Search onSelect={onSelect} />
      <ScrollView contentContainerStyle={{ paddingBottom: 350 }} {...scroll}>
        <TextSecondary style={{ fontSize: 14 }}> Suggested </TextSecondary>
        {suggested &&
          suggested.map(e => (
            <TouchableOpacity key={`CoinBalance_${e.symbol}`} onPress={() => onSelect(e)}>
              <View style={styles.portfolioRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image style={styles.coinIcon} source={e._asset.icon} />
                  <Text style={styles.textPrimary}> {e.symbol}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        <TextSecondary style={{ fontSize: 14, marginTop: 32 }}> All Coins </TextSecondary>
        {rest &&
          rest.map(e => (
            <TouchableOpacity key={`CoinBalance_${e.symbol}`} onPress={() => onSelect(e)}>
              <View style={styles.portfolioRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image style={styles.coinIcon} source={e._asset.icon} />
                  <Text style={styles.textPrimary}> {e.symbol}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        <View />
      </ScrollView>
    </>
  );
};
const AssetPicker: React.FC<AssetPickerProps> = ({ title, onClose, onSelect }) => {
  const navigation = useNavigation();
  const { current } = useCardAnimation();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => true;
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const Header = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <TouchableOpacity
        onPress={() => {
          onClose();
          navigation.goBack();
        }}
        style={{ paddingVertical: Platform.OS === 'android' ? 16 : 4 }}
      >
        <X width={24} height={24} stroke="#000" />
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '600' }}>{title}</Text>
        <TextSecondary> Select a coin </TextSecondary>
      </View>
      <View style={{ width: 24, height: 24 }} />
    </View>
  );

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0],
              extrapolate: 'clamp',
            }),
          },
        ],
      }}
    >
      <SafeAreaView style={{ backgroundColor: '#fff', width, height }}>
        <View
          style={{
            marginHorizontal: 12,
          }}
        >
          <Header />
          <PickerContent
            onSelect={(...args) => {
              onSelect(...args);
              navigation.goBack();
            }}
          />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export const useAssetPicker = ({
  defaultValue,
  title,
  onClose,
}: {
  defaultValue?: AssetBalanceT;
  title: string;
  onClose?: () => void;
}): [AssetBalanceT | null, () => void] => {
  const [selected, setSelected] = useState<AssetBalanceT | null>(defaultValue || null);

  const navigation = useNavigation<RootStackNP>();
  const open = () => {
    navigation.navigate('modal', {
      component: () => (
        <AssetPicker
          key={`AssetPicker_${Math.floor(Math.random() * 10)}`}
          title={title}
          onClose={() => {
            onClose?.();
          }}
          onSelect={e => {
            setSelected(e);
          }}
        />
      ),
      props: {},
    });
  };

  return [selected, open];
};

export default AssetPicker;

const styles = StyleSheet.create({
  portfolioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    alignItems: 'center',
  },
  coinIcon: {
    width: 42,
    height: 42,
    resizeMode: 'contain',
    marginRight: 8,
  },
  textPrimary: {
    fontSize: 16,
    fontWeight: '500',
  },
});
