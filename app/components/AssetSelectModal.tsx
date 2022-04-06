import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCardAnimation } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
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
import { tid, useScroll } from '../utils';
import { AssetBalanceT, useAssets, useAssetsStore } from '../utils/meta1Api';
import { RootStackNP } from '../WalletNav';
import { TextSecondary } from './typography';

interface AssetPickerProps {
  key: string;
  title: string;
  onClose: (...args: any[]) => void;
  onSelect: (asset: AssetBalanceT) => void;
  exclude?: string[];
}
const { width, height } = Dimensions.get('screen');

const Search = ({ onSelect, exclude }: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const allAssets = useAssets();

  const found = allAssets!.assetsWithBalance
    .filter(a => a.symbol.includes(searchTerm.toUpperCase()))
    .filter(a => !exclude || exclude.indexOf(a.symbol) === -1)
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
  const pad = (
    <View
      style={{
        height,
      }}
    >
      {found &&
        found.map(e => (
          <TouchableOpacity
            {...tid(`AssetSelect/${e.symbol}`)}
            key={`FoundCoin_${e.symbol}`}
            onPress={() => onSelect(e)}
          >
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
        {...tid('AssetSelectModal/Search/Input')}
        placeholder="Search for a coin..."
        // value={searchTerm}
        onChangeText={t => {
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
type Props = Pick<AssetPickerProps, 'onSelect'> & Pick<AssetPickerProps, 'exclude'>;
const PickerContent = ({ onSelect, exclude }: Props) => {
  const allAssets = useAssets();
  const scroll = useScroll();
  scroll.contentContainerStyle.paddingBottom = 350;
  const suggested = allAssets!.assetsWithBalance
    .filter(a => a.symbol === 'BTC' || a.symbol === 'ETH' || a.symbol === 'META1')
    .filter(a => !exclude || exclude.indexOf(a.symbol) === -1)
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  const rest = allAssets!.assetsWithBalance
    .filter(a => !suggested.includes(a))
    .filter(a => !exclude || exclude.indexOf(a.symbol) === -1)
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  return (
    <>
      <Search onSelect={onSelect} exclude={exclude} />
      <ScrollView {...scroll}>
        <TextSecondary style={{ fontSize: 14 }}> Suggested </TextSecondary>
        {suggested &&
          suggested.map(e => (
            <TouchableOpacity
              {...tid(`AssetSelect/${e.symbol}`)}
              key={`CoinBalance_${e.symbol}`}
              onPress={() => onSelect(e)}
            >
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
            <TouchableOpacity
              {...tid(`AssetSelect/${e.symbol}`)}
              key={`CoinBalance_${e.symbol}`}
              onPress={() => onSelect(e)}
            >
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
const AssetPicker: React.FC<AssetPickerProps> = ({ title, onClose, onSelect, exclude }) => {
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
        {...tid('AssetSelect/Close')}
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
            exclude={exclude}
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
  exclude,
}: {
  defaultValue?: AssetBalanceT;
  title: string;
  onClose?: () => void;
  exclude?: string[];
}): [AssetBalanceT | null, () => void] => {
  const [selected, setSelected] = useState<AssetBalanceT | null>(defaultValue || null);

  useEffect(() => {
    if (defaultValue && !selected) {
      setSelected(defaultValue);
    }
  }, [defaultValue, selected]);

  useEffect(
    () =>
      useAssetsStore.subscribe(state => {
        if (selected) {
          setSelected(state.userAssets.find(selected.symbol));
        }
      }),
    [selected],
  );

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
          exclude={exclude}
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
