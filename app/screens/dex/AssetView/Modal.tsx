import assert from 'assert';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  LayoutRectangle,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Minus, Plus } from 'react-native-feather';
import { SvgIcons } from '../../../../assets';
import { useStore } from '../../../store';
import { colors } from '../../../styles/colors';
import { catchError, ensure, promptPromise, Timeout } from '../../../utils';
import { placeLimitOrder, useAssets } from '../../../utils/meta1Api';
import meta1dex from '../../../utils/meta1dexTypes';
import { AssetViewSSP } from './AssetView';
import { useAVStore } from './AssetViewStore';

interface InputRowProps {
  title: string;
  value: number;
  onChange: (val: number) => void;
}
const InputRow: React.FC<InputRowProps> = ({ title, value, onChange }) => {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: '#fff3',
        paddingBottom: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: colors.BrandYellow }}>{title}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput
          style={{
            color: '#fff',
            fontSize: 28,
            fontWeight: 'bold',
          }}
          value={
            value.toString().indexOf('.') === -1 ? value.toFixed(2) : value.toString().slice(0, 12)
          }
          onChangeText={t => onChange(Number(t) || 0)}
        />
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => onChange(Math.max(value - 1, 0))}
            style={{
              backgroundColor: '#481400',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 5,
              margin: 4,
            }}
          >
            <Minus width={28} height={28} color={colors.BrandYellow} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onChange(value + 1)}
            style={{
              backgroundColor: '#481400',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 5,
              margin: 4,
            }}
          >
            <Plus width={28} height={28} color={colors.BrandYellow} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
        <TouchableOpacity onPress={() => set(found.amount * 0.25)}>
          <LeText>25%</LeText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => set(found.amount * 0.5)}>
          <LeText>50%</LeText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => set(found.amount * 0.75)}>
          <LeText>75%</LeText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => set(found.amount * 1.0)}>
          <LeText>100%</LeText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const BuyTab: React.FC = () => {
  const { assetA, assetB } = useAVStore(s => s);

  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fn = async () => {
      const t = await meta1dex.db.get_ticker(assetB, assetA);
      setPrice(Number(t.lowest_ask) || Number(t.latest));
    };
    fn();
  }, [assetA, assetB]);

  useEffect(() => {
    setTotal(price * amount);
  }, [price, amount]);

  const fn = useCreateOrder(assetB, assetA, 'placeLimitOrder - Buy');
  return (
    <View style={{ flexGrow: 1, padding: 12 }}>
      <InputRow title={`AT PRICE | ${assetB}`} value={price} onChange={setPrice} />
      <InputRow title={`AMOUNT | ${assetA}`} value={amount} onChange={setAmount} />
      <InputRow title={`TOTAL | ${assetB}`} value={total} onChange={setTotal} />
      <TotalRow
        symbol={assetB}
        set={n => {
          setTotal(n);
          setAmount(n / price);
        }}
      />
      <TouchableOpacity onPress={() => fn(price, amount)}>
        <View
          style={{
            backgroundColor: colors.BrandYellow,
            alignItems: 'center',
            padding: 18,
            marginVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '500' }}>BUY</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const useCreateOrder = (toGive: any, toGet: any, message: string) => {
  const { accountName, password } = useStore();
  const getPassword = async () =>
    password
      ? password
      : await promptPromise(
          'Enter password',
          'Password is required for this operation',
          'secure-text',
        );

  const getAccountInfo = async () => ({
    accountName,
    password: ensure(await getPassword()),
  });

  const fn = (price: number, amount: number) => async () => {
    const accountInfo = await getAccountInfo();
    if (accountInfo.password === null) {
      return;
    }
    return Timeout(
      placeLimitOrder(accountInfo, {
        toGet,
        toGive,
        price,
        amount,
      }),
      message,
    );
  };
  return (price: number, amount: number) => catchError(fn(price, amount));
};

const SellTab: React.FC = () => {
  const { assetA, assetB } = useAVStore(s => s);

  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fn = async () => {
      const t = await meta1dex.db.get_ticker(assetB, assetA);
      setPrice(Number(t.highest_bid) || Number(t.latest));
    };
    fn();
  }, [assetA, assetB]);

  useEffect(() => {
    setTotal(price * amount);
  }, [price, amount]);

  const fn = useCreateOrder(assetA, assetB, 'placeLimitOrder - Sell');

  return (
    <View style={{ flexGrow: 1, padding: 12 }}>
      <InputRow title={`AT PRICE | ${assetB}`} value={price} onChange={setPrice} />
      <InputRow title={`AMOUNT | ${assetA}`} value={amount} onChange={setAmount} />
      <TotalRow
        symbol={assetA}
        set={n => {
          setAmount(n);
          setTotal(n * price);
        }}
      />
      <InputRow title={`TOTAL | ${assetB}`} value={total} onChange={setTotal} />
      <TouchableOpacity onPress={() => fn(price, amount)}>
        <View
          style={{
            backgroundColor: colors.BrandYellow,
            alignItems: 'center',
            padding: 18,
            marginVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '500' }}>SELL</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const { height } = Dimensions.get('window');

const useKeyboard = () => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const l1 = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const l2 = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      l1.remove();
      l2.remove();
    };
  }, []);

  return keyboardOpen;
};
const AssetViewModal: React.FC<AssetViewSSP> = ({ navigation }) => {
  const [leftTabSelected, setLTSelected] = useState(true);
  const [backdropY, setBackdropY] = useState(height * 0.45);
  const [contentSize, setContentSize] = useState<LayoutRectangle>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const keyboardOpen = useKeyboard();
  useEffect(() => {
    const forKb = height * 0.05;
    const regular = height - contentSize.height;
    setBackdropY(keyboardOpen ? forKb : regular);
  }, [keyboardOpen, contentSize]);

  return (
    <View style={{ height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.35)' }}>
      <TouchableOpacity
        style={{
          height: backdropY,
        }}
        onPress={() => navigation.goBack()}
      />
      <View
        style={{
          // height: '65%',
          backgroundColor: '#330000',
          // flexGrow: 1,
        }}
        onLayout={e => setContentSize(e.nativeEvent.layout)}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              flexGrow: 1,
              padding: 12,
              backgroundColor: leftTabSelected ? '#330000' : '#1a0001',
            }}
          >
            <TouchableOpacity onPress={() => setLTSelected(true)}>
              <Text
                style={{
                  color: leftTabSelected ? '#0f0' : '#888',
                  fontSize: 18,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                BUY
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexGrow: 1,
              padding: 12,
              backgroundColor: !leftTabSelected ? '#330000' : '#1a0001',
            }}
          >
            <TouchableOpacity onPress={() => setLTSelected(false)}>
              <Text
                style={{
                  color: !leftTabSelected ? '#f00' : '#888',
                  fontSize: 18,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                SELL
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {leftTabSelected ? <BuyTab /> : <SellTab />}
      </View>
    </View>
  );
};

export default AssetViewModal;
