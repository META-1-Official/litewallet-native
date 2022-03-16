import { useNavigation } from '@react-navigation/core';
import throttle from 'lodash.throttle';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  TextInput,
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
import { catchError, ensure, promptPromise, shadow, style, tid } from '../utils';
import {
  AssetBalanceT,
  refreshAssets,
  swapWithPassword,
  useAssets,
  useAssetsStore,
} from '../utils/meta1Api';
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
    console.log('One of Assets Changed');
    if (!A || !B) {
      return;
    }
    const baseUsdt = A.toUsdt();
    const _targetAmount = B.formUsdt(baseUsdt);
  }, [A?.asset, B?.asset]);

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
          const aMax = assets.A.asset.amount;
          assets.A.setAmount(aMax.toString());
          assets.B.formUsdt(assets.A.toUsdt(aMax));
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
          const aMax = assets.A.asset.amount;
          assets.A.setAmount(aMax.toString());
          assets.B.formUsdt(assets.A.toUsdt(aMax));
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
          <TextSecondary style={styles.font14}>BNB</TextSecondary>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AmountInput = ({ asset, darkMode }: DM<AssetProp>) => {
  const [amt, setAmt] = useState(asset.amount);
  const [usd, setUsd] = useState(asset.toUsdt().toFixed(2));

  const darkStyle = optStyleFactory(darkMode);

  useEffect(() => {
    setAmt(asset.amount);
    setUsd(asset.toUsdt().toFixed(2));
  }, [asset]);

  const throttled = useMemo(
    () =>
      throttle((tt: string) => {
        asset.formUsdt(tt);
        asset.opponent().formUsdt(tt);
      }, 1500),
    [asset],
  );
  return (
    <View>
      <TextInput
        {...tid('TradeScreen/AmountInput/amount')}
        style={darkStyle({ color: '#fff' }, styles.amountInput)}
        keyboardType="numeric"
        onChangeText={t => {
          setAmt(t);
          const opp = asset.opponent();
          asset.setAmount(t);
          opp.formUsdt(asset.toUsdt(t));
        }}
        value={amt}
      />
      <View style={styles.rowEnd}>
        <TextSecondary style={darkStyle({ color: '#fff' }, styles.usdtLabel)}>US$</TextSecondary>
        <TextInput
          {...tid('TradeScreen/AmountInput/amountUsd')}
          onChangeText={t => {
            setUsd(t);
            throttled(t);
          }}
          value={usd}
          keyboardType="numeric"
          style={darkStyle({ color: '#fff' }, styles.usdInput)}
        />
      </View>
    </View>
  );
};

const mkPerformSwap = (
  assets: ScreenAssets,
  onBeforeSwap: () => void,
  onAfterSwap: () => void,
  onFail: () => void,
) => {
  const { accountName, password } = useStore.getState();
  const update = useAssetsStore.getState().fetchUserAssets;
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

  const fn = async () => {
    const accountInfo = await getAccountInfo();

    onBeforeSwap();
    assets.A.isAffordableForSwap();
    if (assets.A.asset.symbol === assets.B.asset.symbol) {
      throw new Error("Can't swap the same assets");
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
      open(makeMessage(assets), () => nav.goBack());
    },
    () => loader.close(),
  );

  const DarkMode: React.FC = ({ children }) => <>{darkMode ? children : null}</>;

  const darkStyle = optStyleFactory(darkMode);

  const LightMode: React.FC = ({ children }) => <>{darkMode ? null : children}</>;
  return (
    <DKSAV style={darkStyle(styles.darkRoot)}>
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
              <AmountInput darkMode={darkMode} asset={assets.A} />
            </View>
          </View>
          <View style={{ padding: 16 }}>
            <Text style={darkStyle({ color: colors.BrandYellow }, styles.listHeading)}>To</Text>
            <View style={styles.rowJustifyBetween}>
              <AssetDisplay darkMode={darkMode} asset={assets.B} />
              <AmountInput darkMode={darkMode} asset={assets.B} />
            </View>
          </View>
        </List>
      </View>
      <LightMode>
        <View style={styles.buttonContainer}>
          <TouchableOpacity {...tid('TradeScreen/Trade')} onPress={fn}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Exchange</Text>
            </View>
          </TouchableOpacity>
        </View>
      </LightMode>
      <DarkMode>
        <View style={[styles.center, styles.m12]} />
        <TouchableOpacity {...tid('TradeScreen/Trade')} onPress={fn}>
          <View style={styles.darkBtnView}>
            <Text style={styles.font18x500}>Convert</Text>
          </View>
        </TouchableOpacity>
      </DarkMode>
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
    fontWeight: '500',
    textAlign: 'right',
    width: 150,
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
