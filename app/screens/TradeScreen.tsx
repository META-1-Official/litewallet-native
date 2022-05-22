import { useNavigation } from '@react-navigation/core';
import throttle from 'lodash.throttle';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SvgIcons } from '../../assets';
import { DKSAV } from '../components/DismissKeyboard';
import { List } from '../components/List';
import Loader from '../components/Loader';
import { useNewLoaderModal } from '../components/LoaderModal';
import { useShowModal } from '../components/SuccessModal';
import { Heading, TextSecondary } from '../components/typography';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { catchError, ensure, getPassword, shadow, style, tid } from '../utils';
import {
  AssetBalanceT,
  refreshAssets,
  swapWithPassword,
  useAssets,
  useAssetsStore,
} from '../utils/meta1Api';
import meta1dex from '../utils/meta1dexTypes';
import { createPair, theAsset, useAsset } from '../utils/useAsset';

const { width, height } = Dimensions.get('screen');

const Backdrop = () => (
  <View
    style={{
      width,
      height: height / 6 + 18,
      backgroundColor: colors.BrandYellow,
      zIndex: 0,
      position: 'absolute',
    }}
  />
);

const useAssetPair = (defaultAssetA?: AssetBalanceT, defaultAssetB?: AssetBalanceT) => {
  const [A, B] = createPair(
    useAsset({ defaultValue: defaultAssetA, title: 'Trade' }),
    useAsset({ defaultValue: defaultAssetB, title: 'Trade' }),
  );

  useEffect(() => {
    console.log('One of Assets symbol Changed');
    if (!A || !B) {
      return;
    }
    A.setAmount('0.00');
    B.setAmount('0.00');
  }, [A?.asset.symbol, B?.asset.symbol]);

  useEffect(() => {
    async function load() {
      if (!A || !B) {
        return;
      }
      console.log('Update ticker');
      const tickerA = await meta1dex.db
        .get_ticker(A.asset.symbol, B.asset.symbol)
        .catch(console.log);
      console.log({ tickerA });
      A.setTicker(tickerA || undefined);

      const tickerB = await meta1dex.db
        .get_ticker(B.asset.symbol, A.asset.symbol)
        .catch(console.log);
      console.log({ tickerB });

      B.setTicker(tickerB || undefined);
    }
    load();
  }, [A?.asset.symbol, B?.asset.symbol]);

  if (!A || !B) {
    return null;
  }

  return {
    assets: { A, B },
  };
};

type ScreenAssets = {
  A: theAsset;
  B: theAsset;
};
interface AssetsProp {
  assets: ScreenAssets;
}

function setMaxAmount(assets: ScreenAssets) {
  const { A, B } = assets;
  if (A.ticker && A.ticker.lowest_ask !== '0') {
    const aMax = A.getMax();
    const pow = 10 ** B.asset._asset.precision;
    const x = (aMax / Number(A.ticker.lowest_ask)) * pow;
    const bMax = Math.floor(x) / pow;
    A.setAmount(aMax.toFixed(A.asset._asset.precision));
    B.setAmount(bMax.toFixed(B.asset._asset.precision));
  } else {
    Alert.alert('Failed to get exchange rate', 'No open orders found');
  }
}

const FloatingButton = ({ assets }: AssetsProp) => {
  return (
    <View
      style={{
        alignSelf: 'flex-end',
        position: 'relative',
        left: -48,
        top: 32,
        zIndex: 1000,
        elevation: 3,
        backgroundColor: '#330000',
        borderRadius: 4,
        padding: 8,
        paddingHorizontal: 12,
      }}
    >
      <TouchableOpacity
        {...tid('TradeScreen/MAX')}
        onPress={() => {
          editing.current?.(false);
          setMaxAmount(assets);
        }}
      >
        <Text style={{ textAlign: 'center', color: colors.BrandYellow, fontWeight: '700' }}>
          MAX
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const DarkFloatingButton = ({ assets }: AssetsProp) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 4,
        padding: 8,
        paddingHorizontal: 12,
      }}
    >
      <TouchableOpacity
        {...tid('TradeScreen/MAX')}
        onPress={() => {
          editing.current?.(false);
          setMaxAmount(assets);
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <SvgIcons.Wallet width={18} height={18} fill={colors.BrandYellow} />
          <Text style={{ textAlign: 'center', fontWeight: '700', marginLeft: 8 }}>MAX</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

type DM<T> = { darkMode?: boolean } & T;
interface AssetProp {
  asset: theAsset;
  slave?: boolean;
}

const AssetDisplay = ({ asset, darkMode }: DM<AssetProp>) => {
  const darkStyle = optStyleFactory(darkMode);

  return (
    <TouchableOpacity {...tid('TradeScreen/SelectAsset')} onPress={() => asset.open()}>
      <View style={styles.rowCenter}>
        <Image style={styles.assetIcon} source={asset.asset._asset.icon /*Bruh wtf is dis */} />
        <View>
          <Heading style={darkStyle({ color: '#fff' }, styles.font18x500)}>
            {asset.asset.symbol}
          </Heading>
          <TextSecondary style={styles.font14}>
            Balance: {asset.asset.amount.toFixed(asset.asset._asset.precision)}
          </TextSecondary>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const ErrorContext = React.createContext({
  errors: [],
  setErrors: (_: any) => {},
});
type InputProps = {
  validate: (value: string) => boolean;
  onChange: (value: string, valid: boolean) => void;
} & Omit<TextInputProps, 'onChange'>;

const Input = (props: InputProps) => {
  const { validate, onChange, ...inputProps } = props;
  const [err, setErr] = useState(false);

  // This is surprisingly effective
  const { errors, setErrors } = useContext(ErrorContext);
  useEffect(() => {
    err ? setErrors([...errors, true]) : setErrors([...errors.slice(0, -1)]);
  }, [err]);

  useEffect(() => {
    if (props.value) {
      setErr(!validate(props.value));
    }
  }, [props.value]);

  const _onChange = (t: string, v: boolean) => {
    console.log('valid', v);
    setErr(!v);
    onChange(t, v);
  };

  const errorHighlight = err ? { color: 'red' } : {};
  inputProps.style = [inputProps.style || {}, errorHighlight];

  return (
    <TextInput maxLength={11} {...inputProps} onChangeText={t => _onChange(t, validate(t))} />
  );
};

const editing: any = { current: null };
// Basically do not update if meself is editing
const useCause = () => {
  const [isCause, setCause] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();
  return {
    isCause,
    cause: () => {
      if (!isCause) {
        setCause(true);
        editing.current = setCause;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setCause(false);
        editing.current = null;
      }, 5000);
    },
  };
};

const validateNumber = (t: string) => /^(\d+([.,]\d+)?)$/m.test(t);
const AmountInput = ({ asset, darkMode }: DM<AssetProp>) => {
  const [amount, setAmount] = useState(asset.amount);
  const { isCause, cause } = useCause();
  useEffect(() => {
    if (!isCause) {
      setAmount(asset.amount);
    }
  }, [asset.amount, isCause]);

  const darkStyle = optStyleFactory(darkMode);
  return (
    <Input
      {...tid('TradeScreen/AmountInput/amount')}
      style={darkStyle({ color: '#fff' }, styles.amountInput)}
      value={amount}
      validate={validateNumber}
      keyboardType="numeric"
      onChange={(txt, valid) => {
        cause();
        setAmount(txt);
        if (valid) {
          asset.setAmount(txt);
          const opponent = asset.opponent();
          const ticker = asset.ticker;
          if (ticker && ticker.lowest_ask !== '0') {
            const bAmt = Number(txt) / Number(ticker.lowest_ask);
            opponent.setAmount(bAmt.toFixed(opponent.asset._asset.precision));
          } else {
            opponent.formUsdt(asset.toUsdt(txt));
          }
        }
      }}
    />
  );
};

const UsdInput = ({ asset, darkMode, slave }: DM<AssetProp>) => {
  const [amount, setAmount] = useState(asset.toUsdt().toFixed());
  const { isCause, cause } = useCause();

  useEffect(() => {
    if (!isCause) {
      setAmount((slave ? asset.opponent().toUsdt() : asset.toUsdt()).toFixed(2));
    }
  }, [asset.amount, isCause]);

  const darkStyle = optStyleFactory(darkMode);
  return (
    <Input
      {...tid('TradeScreen/AmountInput/amountUsd')}
      style={darkStyle({ color: '#fff' }, styles.usdInput)}
      maxLength={7}
      value={amount}
      validate={validateNumber}
      keyboardType="numeric"
      onChange={(txt, valid) => {
        cause();
        setAmount(txt);
        if (valid) {
          asset.formUsdt(txt);
          asset.opponent().formUsdt(txt);
        }
      }}
    />
  );
};

const AmountsInput = ({ asset, darkMode, slave }: DM<AssetProp>) => {
  const darkStyle = optStyleFactory(darkMode);

  return (
    <View style={{ width: 120 }}>
      <AmountInput asset={asset} darkMode={darkMode} />
      <View style={styles.rowEnd}>
        <TextSecondary style={darkStyle({ color: '#fff' }, styles.usdtLabel)}>US$</TextSecondary>
        <UsdInput asset={asset} darkMode={darkMode} slave={slave} />
      </View>
    </View>
  );
};

const crossCheckPrice = async ({ A, B }: ScreenAssets) => {
  try {
    const ticker = await meta1dex.db.get_ticker(A.asset.symbol, B.asset.symbol);
    if (!ticker || !ticker.lowest_ask || ticker.lowest_ask === '0') {
      return;
    }
    const price = Number(A.amount) / Number(B.amount);
    const tickerPrice = Number(ticker.lowest_ask);
    const mesq = (1 / 2) * (price - tickerPrice) ** 2;
    console.log(mesq);
    return mesq < 1e-10;
  } catch (e: any) {
    console.warn(e);
  }
};

const mkPerformSwap = (
  assets: ScreenAssets,
  onBeforeSwap: () => void,
  onAfterSwap: () => void,
  onFail: () => void,
) => {
  const { accountName } = useStore.getState();
  const update = useAssetsStore.getState().fetchUserAssets;

  const getAccountInfo = async () => ({
    accountName,
    password: ensure(await getPassword()),
  });

  const fn = async () => {
    console.log(assets.B.amount);
    const accountInfo = await getAccountInfo();

    onBeforeSwap();
    assets.A.isAffordableForSwap();
    if (assets.A.asset.symbol === assets.B.asset.symbol) {
      throw new Error("Can't swap the same assets");
    }

    if (!(await crossCheckPrice(assets))) {
      throw new Error(
        'Price deviation too high, enter the exact amount to swap or try again later',
      );
    }

    await swapWithPassword(
      accountInfo,
      assets.A.asset.symbol,
      assets.B.asset.symbol,
      Number(assets.B.amount),
    );

    onAfterSwap();
  };

  return () =>
    catchError(fn, {
      anyway: () => setTimeout(() => update(accountName), 100),
      onErr: e => {
        onFail();
        if ((e as Error).message === 'Expected value, got null') {
          return true; // Swallow this exception
        }
      },
    });
};

const makeMessage = (assets: ScreenAssets) =>
  `Successfully traded ${assets.A.amount} ${assets.A.asset.symbol}` +
  ' to ' +
  `${assets.B.amount} ${assets.B.asset.symbol}`;

interface Props {
  darkMode?: boolean;
}
type kindaStyle = Partial<typeof styles> | ViewStyle | TextStyle | ImageStyle;

const optStyleFactory =
  (darkMode?: boolean) =>
  (x: kindaStyle, defaults?: kindaStyle): any => {
    if (darkMode) {
      return [defaults, x];
    }
    return [defaults];
  };

const refresh = throttle(() => {
  console.log('BEGIN Refresh');
  refreshAssets().then(() => console.log('END Refresh'));
}, 30000);

const TradeScreen: React.FC<Props> = ({ darkMode }) => {
  const nav = useNavigation();
  const allAssets = useAssets();
  const availableAssets = useMemo(
    () => allAssets?.assetsWithBalance.sort((a, b) => a.symbol.localeCompare(b.symbol)),
    [allAssets],
  );
  const pair = useAssetPair(availableAssets.at(0), availableAssets.at(3));

  const open = useShowModal();

  const loader = useNewLoaderModal();

  //FIXME: Bruh moment, just checking every half a second if we can proceed
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState([]);
  useEffect(() => setDisabled(errors.length !== 0), [errors]);
  if (allAssets === null || !availableAssets || !pair) {
    refresh();
    return <Loader />;
  }

  const { assets } = pair;
  const fn = mkPerformSwap(
    assets,
    () => loader.open(),
    () => {
      console.log('Should hide');
      loader.close();
      open(makeMessage(assets), () => {
        nav.goBack();
        darkMode && nav.goBack();
      });
    },
    () => loader.close(),
  );

  const DarkMode: React.FC = ({ children }) => <>{darkMode ? children : null}</>;

  const darkStyle = optStyleFactory(darkMode);

  const LightMode: React.FC = ({ children }) => <>{darkMode ? null : children}</>;
  return (
    <DKSAV style={darkStyle(styles.darkRoot)}>
      <ErrorContext.Provider value={{ errors, setErrors }}>
        <LightMode>
          <Backdrop />
        </LightMode>
        <View>
          <LightMode>
            <FloatingButton assets={assets} />
          </LightMode>
          <DarkMode>
            <View style={{ margin: 18 }} />
          </DarkMode>
          <List style={darkStyle(styles.darkList, styles.listStyle)}>
            <View style={darkStyle(styles.darkListView, styles.listView)}>
              <View style={[styles.rowJustifyBetween, styles.center, { paddingVertical: 8 }]}>
                <Text style={darkStyle({ color: colors.BrandYellow }, styles.listHeading)}>
                  Convert
                </Text>
                <DarkMode>
                  <DarkFloatingButton assets={assets} />
                </DarkMode>
              </View>
              <View style={styles.rowJustifyBetween}>
                <AssetDisplay darkMode={darkMode} asset={assets.A} />
                <AmountsInput darkMode={darkMode} asset={assets.A} />
              </View>
            </View>
            <View style={{ padding: 16 }}>
              <Text style={darkStyle({ color: colors.BrandYellow }, styles.listHeading)}>To</Text>
              <View style={styles.rowJustifyBetween}>
                <AssetDisplay darkMode={darkMode} asset={assets.B} />
                <AmountsInput darkMode={darkMode} asset={assets.B} slave />
              </View>
            </View>
          </List>
        </View>
        <LightMode>
          <View style={styles.buttonContainer}>
            <TouchableOpacity {...tid('TradeScreen/Trade')} onPress={fn} disabled={disabled}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Exchange</Text>
              </View>
            </TouchableOpacity>
          </View>
        </LightMode>
        <DarkMode>
          <View style={[styles.center, styles.m12]} />
          <TouchableOpacity {...tid('TradeScreen/Trade')} onPress={fn} disabled={disabled}>
            <View style={styles.darkBtnView}>
              <Text style={styles.font18x500}>Convert</Text>
            </View>
          </TouchableOpacity>
        </DarkMode>
      </ErrorContext.Provider>
    </DKSAV>
  );
};

export default TradeScreen;

const styles = StyleSheet.create({
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: { width: 42, height: 42, resizeMode: 'contain', marginRight: 8 },
  font18x500: { fontSize: 18, fontWeight: '500' },
  font14: { fontSize: 14 },
  amountInput: {
    fontSize: 18,
    padding: 0,
    fontWeight: '500',
    textAlign: 'right',
    color: '#000',
  },
  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  usdtLabel: { fontSize: 14, textAlign: 'right', padding: 0 },
  listStyle: { backgroundColor: '#fff', borderRadius: 8, margin: 18 },
  listView: { padding: 16, borderBottomWidth: 2, borderBottomColor: '#eceef0' },
  rowJustifyBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listHeading: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  buttonContainer: {
    margin: 32,
    marginTop: 128,
    alignItems: 'center',
  },
  button: {
    ...shadow.D3,
    padding: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginBottom: 24,
    backgroundColor: colors.BrandYellow,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  usdInput: style(
    {
      marginLeft: 8,
      fontSize: 14,
      color: colors.mutedGray,
      textAlign: 'right',
    },
    {
      android: {
        height: 18,
        padding: 0,
        marginTop: 1,
      },
    },
  ),
  // Dark mode
  darkRoot: { backgroundColor: '#320001', height: '100%' },
  darkBtnView: {
    backgroundColor: colors.BrandYellow,
    alignItems: 'center',
    padding: 18,
    margin: 24,
    borderRadius: 8,
  },
  darkListView: {
    padding: 0,
    margin: 16,
    paddingBottom: 16,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.BrandYellow,
  },
  darkList: {
    backgroundColor: '#3f0000',
    borderRadius: 18,
  },
  center: {
    alignItems: 'center',
  },
  m12: {
    margin: 12,
  },
});
