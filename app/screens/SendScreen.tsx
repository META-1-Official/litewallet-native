import React, { useReducer, useState } from 'react';
import {
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
import { catchError, tid, useScroll } from '../utils';
import {
  getAccount,
  refreshAssets,
  sendWithPassword,
  useAssets,
  useAssetsStore,
} from '../utils/meta1Api';
import { useNewLoaderModal } from '../components/LoaderModal';
import { DexSSP } from './dex';
import { HeaderProps } from './dex/SendScreen';
import { SvgIcons } from '../../assets';
import { StandaloneAsset, useAsset } from '../utils/useAsset';
import throttle from 'lodash.throttle';
import { useShowModal } from '../components/SuccessModal';

const refresh = throttle(() => {
  console.log('BEGIN Refresh');
  refreshAssets().then(() => {
    // console.log(useAssetsStore.getState().userAssets);
    console.log('END Refresh');
  });
}, 30000);

const SendScreen: React.FC<{}> = () => {
  const [toAccount, setToAccount] = useState('');
  const accountName = useStore(state => state.accountName);
  const { password, setPassword } = usePasswordView();

  const assets = useAssets();
  const meta1 = assets.find('META1');
  const anAsset = useAsset({ defaultValue: meta1!, title: 'Send' });
  const suc = useShowModal();
  const loader = useNewLoaderModal();
  const scroll = useScroll();

  const sendFn = makeSendFn(
    suc,
    () => loader.open(),
    () => loader.close(),
  );

  if (!assets || !meta1 || !anAsset) {
    refresh();
    return <Loader />;
  }

  if (!meta1) {
    return (
      <SafeAreaView>
        <Text> Cannot find META1 asset. </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Backdrop />
      <ScrollView {...scroll}>
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
                  {...tid('SendScreen/accountName')}
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
                {...tid('SendScreen/toAccount')}
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
            <Text style={styles.SectionTitle}>Amount {anAsset.asset.symbol}</Text>
            <AmountInput asset={anAsset} />
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
          <PasswordView darkMode={false} password={password} setPassword={setPassword} />
        </List>
        <View
          style={{
            margin: Platform.OS === 'ios' ? 48 : 0,
            marginHorizontal: 64,
          }}
        >
          <RoundedButton onPress={() => sendFn(password, anAsset, toAccount)} title="Confirm" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const BottomRow = ({ onPress, darkMode }: { onPress: () => void; darkMode?: boolean }) =>
  !darkMode ? (
    <View
      style={{
        flexDirection: 'row',
        paddingTop: 6,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#617283', fontWeight: '500' }}> FEE: 0.00035 META1 </Text>
      <View
        style={{
          backgroundColor: '#330000',
          borderRadius: 4,
          padding: 8,
          paddingHorizontal: 12,
        }}
      >
        <TouchableOpacity {...tid('SendScreen/MAX')} onPress={onPress}>
          <Text style={{ textAlign: 'center', color: colors.BrandYellow, fontWeight: '700' }}>
            MAX
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : (
    <View
      style={{
        flexDirection: 'row',
        paddingTop: 6,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text style={{ color: '#617283', fontWeight: '500' }}> FEE: 0.00035 META1 </Text>
      <View
        style={{
          backgroundColor: '#fff',
          borderRadius: 4,
          padding: 8,
          paddingHorizontal: 12,
        }}
      >
        <TouchableOpacity {...tid('SendScreen/MAX')} onPress={onPress}>
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
  RESET = 'RESET',
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
    // Sanitize input
    if (action.payload !== '') {
      const clean = action.payload
        .replace(/[^(\d+(\.?\d+))]/gm, '')
        .match(/^\d+(\.)?(\d+)?$/)
        ?.at(0);

      if (!clean) {
        return { ...state };
      }
      action.payload = clean;
    }

    switch (action.type) {
      case UpdateType.COIN:
        asset.setAmount(action.payload);
        return { ...state, amt: action.payload, usd: asset.toUsdt(action.payload).toFixed(2) };
      case UpdateType.USD:
        const amt = asset.formUsdt(action.payload, true);
        return { ...state, amt: amt.toFixed(8), usd: action.payload };
      case UpdateType.RESET:
        asset.setAmount('0.00');
        return { ...state, amt: '0.00', usd: '0.00' };
      case UpdateType.MAX:
        asset.setMax();
        const max = asset.getMax();
        return { ...state, amt: max.toFixed(8), usd: asset.toUsdt(max).toFixed(2) };
      default:
        return { ...state };
    }
  };

const AmountInput = ({ asset, darkMode }: { asset: StandaloneAsset; darkMode?: boolean }) => {
  const [state, dispatch] = useReducer(amountReducer(asset), {
    amt: '0.00',
    usd: '0.00',
  });

  if (!darkMode) {
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
              {...tid('SendScreen/amount')}
              style={{
                width: '85%',
                fontSize: 20,
                fontWeight: '500',
                color: '#000',
              }}
              onChangeText={t => dispatch({ type: UpdateType.COIN, payload: t })}
              keyboardType="numeric"
              value={state.amt}
            />
            <TouchableOpacity
              {...tid('SendScreen/SelectAsset')}
              onPress={() => {
                asset.open();
                dispatch({ type: UpdateType.RESET, payload: '' });
              }}
            >
              <Text
                style={{
                  paddingTop: 8,
                  fontWeight: '600',
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
              {...tid('SendScreen/amountUsd')}
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

        <BottomRow
          onPress={() => dispatch({ type: UpdateType.MAX, payload: '' })}
          darkMode={darkMode}
        />
      </>
    );
  }

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
            {...tid('SendScreen/amount')}
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
          <TouchableOpacity
            {...tid('SendScreen/SelectAsset')}
            onPress={() => {
              asset.open();
              dispatch({ type: UpdateType.RESET, payload: '' });
            }}
          >
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
            {...tid('SendScreen/amountUsd')}
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
      <BottomRow
        onPress={() => dispatch({ type: UpdateType.MAX, payload: '' })}
        darkMode={darkMode}
      />
    </>
  );
};

interface PVProps {
  darkMode: boolean;
  password: string;
  setPassword: (s: string) => void;
}

const PasswordView = ({ darkMode, password, setPassword }: PVProps) => (
  <View style={{ padding: 16 }}>
    <Text style={styles.SectionTitleDex}>Password</Text>
    <TextInput
      {...tid('SendScreen/password')}
      style={{ fontSize: 18, fontWeight: '500', color: darkMode ? '#fff' : '#000' }}
      value={password}
      placeholder="Password"
      secureTextEntry
      placeholderTextColor={darkMode ? '#aaa' : '#bbb'}
      onChangeText={t => setPassword(t)}
    />
  </View>
);

const usePasswordView = () => {
  const saved = useStore(s => s.password);
  const [password, setPassword] = useState(saved || '');

  return { password, setPassword };
};

type DexProps = DexSSP & {
  hdr: React.FC<HeaderProps>;
};

const makeSendFn =
  (modal: any, onStart: () => void, onEnd: () => void) =>
  (password: string, standalone: StandaloneAsset, toAccount: string) => {
    const accountName = useStore.getState().accountName;
    onStart();
    catchError(
      async () => {
        if (accountName === toAccount) {
          throw new Error('Field "To" must be different form field "From"');
        }

        if (!toAccount) {
          throw new Error("To account can't be empty");
        }

        if (!(await getAccount(toAccount))) {
          throw new Error(`Account ${toAccount} not found`);
        }

        standalone.isAffordableForSend();
        await sendWithPassword(
          {
            accountName,
            password,
          },
          {
            toAccount,
            asset: standalone.asset.symbol,
            amount: Number(standalone.amount), // 0.00035 fixed fee
          },
        );
        await useAssetsStore.getState().fetchUserAssets(accountName);
        modal(
          `Successfully sent ${standalone.amount} ${standalone.asset.symbol}to ${toAccount}`,
          () => {},
        );
      },
      { onErr: () => onEnd() },
    );
  };

export const DexSend: React.FC<DexProps> = props => {
  const [toAccount, setToAccount] = useState('');
  const accountName = useStore(state => state.accountName);
  const { password, setPassword } = usePasswordView();

  const assets = useAssets();
  const meta1 = assets.find('META1');
  const anAsset = useAsset({ defaultValue: meta1!, title: 'Send' });
  const suc = useShowModal();
  const loader = useNewLoaderModal();
  const scroll = useScroll();
  scroll.contentContainerStyle.paddingBottom = 420; // Nice.
  const sendFn = makeSendFn(
    suc,
    () => loader.open(),
    () => loader.close(),
  );

  if (!assets || !anAsset) {
    refresh();
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
        <ScrollView {...scroll}>
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
                    {...tid('SendScreen/accountName')}
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
                  {...tid('SendScreen/toAccount')}
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
              <AmountInput asset={anAsset} darkMode />
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
            <PasswordView darkMode={true} password={password} setPassword={setPassword} />
          </List>

          <TouchableOpacity
            {...tid('SendScreen/Send')}
            onPress={() => sendFn(password, anAsset, toAccount)}
          >
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
