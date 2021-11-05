import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { X } from 'react-native-feather';
import { AssetBalanceT, useAssets } from '../utils/meta1Api';
import { TextSecondary } from './typography';

interface AssetPickerProps {
  key: string;
  title: string;
  visible: boolean;
  onClose: (...args: any[]) => void;
  onSelect: (asset: AssetBalanceT) => void;
}
const { width, height } = Dimensions.get('screen');

const AssetPicker: React.FC<AssetPickerProps> = ({ title, visible, onClose, onSelect }) => {
  const Header = () => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <TouchableOpacity
        onPress={() => onClose(!visible)}
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
  const allAssets = useAssets();
  const [searchTerm, setSearchTerm] = useState('');

  const suggested = allAssets!.assetsWithBalance
    .filter(ass => ass.symbol === 'BTC' || ass.symbol === 'ETH' || ass.symbol === 'META1')
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  const rest = allAssets!.assetsWithBalance
    .filter(ass => !suggested.includes(ass))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  return (
    <Modal
      key={`AssetPickerModal_${Math.floor(Math.random() * 10)}`}
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose(!visible);
      }}
    >
      <SafeAreaView style={{ backgroundColor: '#fff', width, height }}>
        <View
          style={{
            marginHorizontal: 12,
          }}
        >
          <Header />
          <View>
            <TextInput
              placeholder="Search for a coin..."
              value={searchTerm}
              onChangeText={t => setSearchTerm(t)}
              placeholderTextColor="#5a6777"
              style={{
                fontSize: 18,
                padding: 12,
                paddingHorizontal: 24,
                backgroundColor: '#eff0f2',
                borderRadius: 100,
                marginVertical: 24,
              }}
            />
          </View>
          <TextSecondary style={{ fontSize: 14 }}> Suggested </TextSecondary>
          {suggested &&
            suggested.map(e => (
              <TouchableOpacity key={`CoinBalance_${e.symbol}`} onPress={() => onSelect(e)}>
                <View style={styles.portfolioRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={styles.coinIcon} source={e._asset.icon} />
                    <Text style={styles.textPrimaty}> {e.symbol}</Text>
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
                    <Text style={styles.textPrimaty}> {e.symbol}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

type modalT = ({ title, onClose }: { title: string; onClose?: () => void }) => JSX.Element;
export const useAssetPicker = (
  defaultValue?: AssetBalanceT,
): [AssetBalanceT | null, () => void, () => void, modalT] => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<AssetBalanceT | null>(defaultValue || null);
  const open = () => (!isOpen ? setIsOpen(true) : null);
  const close = () => setIsOpen(false);
  const modal: modalT = ({ title, onClose }) => (
    <AssetPicker
      key={`AssetPicker_${Math.floor(Math.random() * 10)}`}
      title={title}
      visible={isOpen}
      onClose={() => {
        close();
        onClose?.();
      }}
      onSelect={e => {
        setSelected(e);
        close();
      }}
    />
  );

  return [selected, open, close, modal];
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
  textPrimaty: {
    fontSize: 16,
    fontWeight: '500',
  },
});
