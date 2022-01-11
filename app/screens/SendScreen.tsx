import React, { useEffect, useReducer, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Backdrop from '../components/Backdrop';
import { List } from '../components/List';
import Loader from '../components/Loader';
import RoundedButton from '../components/RoundedButton';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { catchError } from '../utils';
import { sendWithPassword, useAssets, useAssetsStore } from '../utils/meta1Api';
import { WalletNavigationProp } from './WalletScreen';
import { useNavigation } from '@react-navigation/core';
import { useAssetPicker } from '../components/AssetSelectModal';
import { useLoaderModal } from '../components/LoaderModal';
import { DexSSP } from './dex';
import { HeaderProps } from './dex/SendScreen';
import { SvgIcons } from '../../assets';
import { StandaloneAsset, useAsset } from '../utils/useAsset';

const SendScreen: React.FC<{}> = () => {
  const nav = useNavigation<WalletNavigationProp>();
  const [amount, setAmount] = useState('0.00');
  const [usdAmount, setUsdAmount] = useState('0.00');
  const [toAccount, setToAccount] = useState('');

  const [scrollEnabled, setScrollEnabled] = useState(false);

  const savedPassword = useStore(state => state.password);
  const [password, setPassword] = useState(savedPassword || '');

  const { LoaderModal, showLoader, hideLoader } = useLoaderModal();
  const accountName = useStore(state => state.accountName);
  const assets = useAssets();
  const fetchAssets = useAssetsStore(state => state.fetchUserAssets);

  const meta1 = assets?.assetsWithBalance.find(e => e.symbol === 'META1');
  const [selectedAsset, open, _, SelectAssetModal] = useAssetPicker(meta1);
  useEffect(() => {
    setUsdAmount((Number(amount) * selectedAsset?.usdt_value!).toFixed(2));
  }, [selectedAsset, amount]);

  if (!assets) {
    return <Loader />;
  }

  if (!meta1 || !selectedAsset) {
    return (
      <SafeAreaView>
        <Text> Cannot find META1 asset. </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Backdrop />
      <SelectAssetModal title="Send" />
      <LoaderModal />
      <ScrollView
        scrollEnabled={scrollEnabled}
        onLayout={layout => {
          const heightDiff = Dimensions.get('screen').height - layout.nativeEvent.layout.height;
          if (heightDiff < 155) {
            setScrollEnabled(true);
          }
        }}
      >
        <List
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            margin: 18,
            marginVertical: Platform.OS === 'ios' ? undefined : 8,
          }}
        >
          <View style={{ padding: 16, borderBottomWidth: 2, borderBottomColor: '#eceef0' }}>
            <Text style={styles.SectionTitle}>From</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <TextInput
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    color: '#000',
                  }}
                  editable={false}
                  value={accountName}
                />
              </View>
            </View>
          </View>
          <View style={{ padding: 16 }}>
            <Text style={styles.SectionTitle}>To</Text>
            <View>
              <TextInput
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: '#000',
                }}
                placeholder="Enter Account Name"
                placeholderTextColor="#888"
                value={toAccount}
                autoCapitalize={'none'}
                autoCorrect={false}
                onChangeText={t => setToAccount(t)}
              />
            </View>
          </View>
        </List>
        <List
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            margin: 18,
            marginVertical: Platform.OS === 'ios' ? undefined : 8,
          }}
        >
          <View style={{ padding: 16 }}>
            <Text style={styles.SectionTitle}>Amount {selectedAsset.symbol}</Text>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 6,
                  borderBottomColor: '#ccc',
                  borderBottomWidth: 2,
                  justifyContent: 'space-between',
                }}
              >
                <TextInput
                  style={{
                    width: '85%',
                    fontSize: 20,
                    fontWeight: '500',
                    color: '#000',
                  }}
                  onChangeText={t => {
                    setAmount(t);
                  }}
                  keyboardType="numeric"
                  value={amount}
                />
                <TouchableOpacity onPress={() => open()}>
                  <Text
                    style={{
                      paddingTop: 8,
                      fontWeight: '600',
                    }}
                  >
                    {selectedAsset.symbol}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  paddingTop: 6,
                  justifyContent: 'space-between',
                }}
              >
                <TextInput
                  style={{
                    width: '85%',
                    fontSize: 18,
                    fontWeight: '500',
                    color: colors.BrandYellow,
                  }}
                  onChangeText={t => {
                    setUsdAmount(t);
                    setAmount((Number(t) / selectedAsset.usdt_value).toFixed(8));
                  }}
                  keyboardType="numeric"
                  value={usdAmount}
                />

                <Text style={{ paddingRight: 2, color: colors.BrandYellow, fontWeight: '600' }}>
                  USD
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 6,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#617283', fontWeight: '500' }}> FEE: 0.0035 META1 </Text>
              <View
                style={{
                  backgroundColor: '#330000',
                  borderRadius: 4,
                  padding: 8,
                  paddingHorizontal: 12,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setAmount(selectedAsset.amount.toString());
                    setUsdAmount((selectedAsset.amount * selectedAsset.usdt_value).toFixed(2));
                  }}
                >
                  <Text
                    style={{ textAlign: 'center', color: colors.BrandYellow, fontWeight: '700' }}
                  >
                    MAX
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </List>
        <List
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            margin: 18,
            marginVertical: Platform.OS === 'ios' ? undefined : 8,
          }}
        >
          <View style={{ padding: 16 }}>
            <Text style={styles.SectionTitle}>Password</Text>
            <TextInput
              style={{ fontSize: 18, fontWeight: '500', color: '#000' }}
              value={password}
              placeholder="Password"
              onChangeText={t => setPassword(t)}
            />
          </View>
        </List>
        <View
          style={{
            margin: Platform.OS === 'ios' ? 48 : 0,
            marginHorizontal: 64,
          }}
        >
          <RoundedButton
            onPress={() => {
              showLoader();
              catchError(
                async () => {
                  await sendWithPassword(
                    {
                      accountName,
                      password,
                    },
                    {
                      toAccount,
                      asset: selectedAsset.symbol,
                      amount: Number(amount) - (selectedAsset.symbol === 'META1' ? 35e-5 : 0), // 0.00035 fixed fee
                    },
                  );
                  await fetchAssets(accountName);
                  nav.goBack();
                },
                () => hideLoader(),
              );
            }}
            title="Confirm"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const useScroll = () => {
  const onLayout: (_: LayoutChangeEvent) => void = layout => {
    const heightDiff = Dimensions.get('screen').height - layout.nativeEvent.layout.height;
    if (heightDiff < 155) {
      setScrollEnabled(true);
    }
  };

  const [scrollEnabled, setScrollEnabled] = useState(false);

  return {
    onLayout,
    scrollEnabled,
  };
};

const BottomRow = ({ onPress }: { onPress: () => void }) => (
  <View
    style={{
      flexDirection: 'row',
      paddingTop: 6,
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Text style={{ color: '#617283', fontWeight: '500' }}> FEE: 0.0035 META1 </Text>
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 8,
        paddingHorizontal: 12,
      }}
    >
      <TouchableOpacity onPress={() => onPress}>
        <View style={{ flexDirection: 'row' }}>
          <SvgIcons.Wallet width={18} height={18} fill={colors.BrandYellow} />
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              marginLeft: 8,
            }}
          >
            MAX
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

enum UpdateType {
  COIN = 'COIN',
  USD = 'USD',
  MAX = 'MAX',
}

interface AmountAction {
  type: UpdateType;
  payload: string;
}

interface AmountState {
  amt: string;
  usd: string;
}

const amountReducer =
  (asset: StandaloneAsset) =>
  (state: AmountState, action: AmountAction): AmountState => {
    switch (action.type) {
      case UpdateType.COIN:
        asset.setAmount(action.payload);
        return { ...state, amt: action.payload, usd: asset.toUsdt(action.payload).toFixed(2) };
      case UpdateType.USD:
        const amt = asset.formUsdt(action.payload, true);
        return { ...state, amt: amt.toFixed(8), usd: action.payload };
      case UpdateType.MAX:
        asset.setMax();
        const max = asset.getMax();
        console.log(max);
        return { ...state, amt: max.toFixed(8), usd: asset.toUsdt(max).toFixed(2) };
      default:
        return { ...state };
    }
  };

const AmountInput = ({ asset }: { asset: StandaloneAsset }) => {
  const [state, dispatch] = useReducer(amountReducer(asset), {
    amt: '0.00',
    usd: '0.00',
  });

  return (
    <>
      <View>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: 6,
            borderBottomColor: '#ccc',
            borderBottomWidth: 2,
            justifyContent: 'space-between',
          }}
        >
          <TextInput
            style={{
              width: '85%',
              fontSize: 20,
              fontWeight: '500',
              color: '#fff',
            }}
            onChangeText={t => dispatch({ type: UpdateType.COIN, payload: t })}
            keyboardType="numeric"
            value={state.amt}
          />
          <TouchableOpacity onPress={() => asset.open()}>
            <Text
              style={{
                paddingTop: 8,
                fontWeight: '600',
                color: '#fff',
              }}
            >
              {asset.asset.symbol}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 6,
            justifyContent: 'space-between',
          }}
        >
          <TextInput
            style={{
              width: '85%',
              fontSize: 18,
              fontWeight: '500',
              color: colors.BrandYellow,
            }}
            onChangeText={t => dispatch({ type: UpdateType.USD, payload: t })}
            keyboardType="numeric"
            value={state.usd}
          />

          <Text style={{ paddingRight: 2, color: colors.BrandYellow, fontWeight: '600' }}>
            USD
          </Text>
        </View>
      </View>
      <BottomRow onPress={() => dispatch({ type: UpdateType.MAX, payload: '' })} />
    </>
  );
};

const usePasswordView = () => {
  const saved = useStore(s => s.password);
  const [password, setPassword] = useState(saved || '');
  const PasswordView = () => (
    <View style={{ padding: 16 }}>
      <Text style={styles.SectionTitleDex}>Password</Text>
      <TextInput
        style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}
        value={password}
        placeholder="Password"
        placeholderTextColor="#fff"
        onChangeText={t => setPassword(t)}
      />
    </View>
  );
  return { password, PasswordView };
};

type DexProps = DexSSP & {
  hdr: React.FC<HeaderProps>;
};

const makeSendFn =
  (nav: any, onStart: () => void, onEnd: () => void) =>
  (password: string, standalone: StandaloneAsset, toAccount: string) => {
    const accountName = useStore.getState().accountName;
    onStart();
    catchError(
      async () => {
        await sendWithPassword(
          {
            accountName,
            password,
          },
          {
            toAccount,
            asset: standalone.asset.symbol,
            amount: Number(standalone.amount) - (standalone.asset.symbol === 'META1' ? 35e-5 : 0), // 0.00035 fixed fee
          },
        );
        await useAssetsStore.getState().fetchUserAssets(accountName);
        nav.goBack();
      },
      () => onEnd(),
    );
  };

export const DexSend: React.FC<DexProps> = props => {
  const nav = props.navigation;
  const [toAccount, setToAccount] = useState('');
  const accountName = useStore(state => state.accountName);
  const { password, PasswordView } = usePasswordView();

  const assets = useAssets();
  const meta1 = assets.find('META1');
  const anAsset = useAsset(meta1!);
  const SelectAssetModal = anAsset.Modal;

  const { LoaderModal, showLoader, hideLoader } = useLoaderModal();
  const { onLayout, scrollEnabled } = useScroll();

  const sendFn = makeSendFn(
    nav,
    () => showLoader(),
    () => hideLoader(),
  );

  if (!assets) {
    return <Loader />;
  }

  if (!meta1) {
    return (
      <SafeAreaView>
        <Text> Cannot find META1 asset. </Text>
      </SafeAreaView>
    );
  }
  const Header = props.hdr;
  return (
    <>
      <Header {...props} title={`Send ${anAsset.asset.symbol}`} />
      <SafeAreaView style={{ height: '100%', backgroundColor: '#320001' }}>
        <SelectAssetModal title="Send" />
        <LoaderModal />
        <ScrollView scrollEnabled={scrollEnabled} onLayout={onLayout}>
          <List
            style={{
              backgroundColor: '#3c0000',
              borderRadius: 8,
              margin: 18,
              marginVertical: Platform.OS === 'ios' ? undefined : 8,
            }}
          >
            <View
              style={{
                margin: 16,
                marginBottom: 0,
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.BrandYellow,
              }}
            >
              <Text style={styles.SectionTitleDex}>From</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <TextInput
                    style={{
                      fontSize: 18,
                      fontWeight: '500',
                      color: '#999',
                    }}
                    editable={false}
                    value={accountName}
                  />
                </View>
              </View>
            </View>
            <View style={{ padding: 16 }}>
              <Text style={styles.SectionTitleDex}>To</Text>
              <View>
                <TextInput
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    color: '#fff',
                  }}
                  placeholder="Enter Account Name"
                  placeholderTextColor="#fff"
                  value={toAccount}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  onChangeText={t => setToAccount(t)}
                />
              </View>
            </View>
          </List>
          <List
            style={{
              backgroundColor: '#3c0000',
              borderRadius: 8,
              margin: 18,
              marginVertical: Platform.OS === 'ios' ? undefined : 8,
            }}
          >
            <View style={{ padding: 16 }}>
              <Text style={styles.SectionTitleDex}>Amount {anAsset.asset.symbol}</Text>
              {/* HERE */}
              <AmountInput asset={anAsset} />
            </View>
          </List>
          <List
            style={{
              backgroundColor: '#3c0000',
              borderRadius: 8,
              margin: 18,
              marginVertical: Platform.OS === 'ios' ? undefined : 8,
            }}
          >
            <PasswordView />
          </List>

          <TouchableOpacity onPress={() => sendFn(password, anAsset, toAccount)}>
            <View
              style={{
                backgroundColor: colors.BrandYellow,
                alignItems: 'center',
                padding: 18,
                margin: 24,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: '500' }}>Confirm</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SendScreen;

const styles = StyleSheet.create({
  SectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Platform.OS === 'ios' ? 8 : 2,
    color: '#ada3a2',
  },
  SectionTitleDex: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Platform.OS === 'ios' ? 8 : 2,
    color: colors.BrandYellow,
  },
});
