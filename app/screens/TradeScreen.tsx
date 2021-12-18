import { useNavigation } from '@react-navigation/core';
import throttle from 'lodash.throttle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAssetPicker } from '../components/AssetSelectModal';
import { List } from '../components/List';
import Loader from '../components/Loader';
import { useLoaderModal } from '../components/LoaderModal';
import { useSuccessModal } from '../components/SuccessModal';
import { Heading, TextSecondary } from '../components/typography';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { catchError, ensure, promptPromise, shadow, style } from '../utils';
import { AssetBalanceT, swapWithPassword, useAssets, useAssetsStore } from '../utils/meta1Api';
import { WalletNavigationProp } from './WalletScreen';

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

type theAsset = {
  asset: AssetBalanceT;
  open: () => void;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  Modal: ReturnType<typeof useAssetPicker>[3];
  formUsdt: (usdtAmount: string | number, updateAmount?: boolean) => number;
  toUsdt: (amt?: string | number | undefined) => number;
  opponent: () => theAsset;
};

const useAsset = (dv?: AssetBalanceT): Omit<theAsset, 'opponent'> => {
  const [asset, open, _close, Modal] = useAssetPicker(dv);
  if (!asset) {
    throw new Error('No such asset');
  }

  const formUsdt = (usdtAmount: string | number, updateAmount = true) => {
    const n = Number(usdtAmount);
    if (!n && n !== 0) {
      console.error('Invalid amount');
      return 0;
    }

    const newAmount = n / asset.usdt_value;

    if (updateAmount) {
      setAmount(newAmount.toFixed(8));
    }

    return newAmount;
  };

  const toUsdt = (amt?: string | number) => {
    const n = Number(typeof amt === 'undefined' ? amount : amt);
    if (!n && n !== 0) {
      console.error('Invalid amount');
      return 0;
    }
    const usdt = n * asset.usdt_value;
    return usdt;
  };

  const [amount, setAmount] = useState('0.00');
  return {
    asset,
    open,
    amount,
    setAmount,
    Modal,
    formUsdt,
    toUsdt,
  };
};

const useAssetPair = (defaultAssetA?: AssetBalanceT, defaultAssetB?: AssetBalanceT) => {
  const _A = useAsset(defaultAssetA);
  const _B = useAsset(defaultAssetB);

  const A: theAsset = { ..._A, opponent: () => B };
  const B: theAsset = { ..._B, opponent: () => A };

  return {
    assets: { A, B },
    Modal: () => (
      <>
        <A.Modal key="AssetPicker_A" title="Trade" />
        <B.Modal key="AssetPicker_B" title="Trade" />
      </>
    ),
  };
};

type ScreenAssets = ReturnType<typeof useAssetPair>['assets'];
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

interface AssetProp {
  asset: theAsset;
}

const AssetDisplay = ({ asset }: AssetProp) => {
  return (
    <TouchableOpacity onPress={() => asset.open()}>
      <View style={styles.rowCenter}>
        <Image style={styles.assetIcon} source={asset.asset._asset.icon /*Bruh wtf is dis */} />
        <View>
          <Heading style={styles.font18x500}>{asset.asset.symbol}</Heading>
          <TextSecondary style={styles.font14}>BNB</TextSecondary>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AmountInput = ({ asset }: AssetProp) => {
  const [amt, setAmt] = useState(asset.amount);
  const [usd, setUsd] = useState(asset.toUsdt().toFixed(2));

  useEffect(() => {
    console.log('change');
    setAmt(asset.amount);
    setUsd(asset.toUsdt().toFixed(2));
  }, [asset]);

  const throttled = useCallback(
    throttle((tt: string) => {
      console.log('throttled');
      asset.formUsdt(tt);
      asset.opponent().formUsdt(tt);
    }, 1500),
    [],
  );
  return (
    <View>
      <TextInput
        style={styles.amountInput}
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
        <TextSecondary style={styles.usdtLable}>US$</TextSecondary>
        <TextInput
          onChangeText={
            t => {
              setUsd(t);
              throttled(t);
            }
            // throttle(tt => {
            //   setUsd(tt);
            //   asset.formUsdt(tt);
            //   asset.opponent().formUsdt(tt);
            // }, 700)(t)
          }
          value={usd}
          style={styles.usdInput}
        />
      </View>
    </View>
  );
};

const usePerformSwap = (
  assets: ScreenAssets,
  onBeforeSwap: () => void,
  onAfterSwap: () => void,
  onFail: () => void,
) => {
  const { accountName, password } = useStore();
  const update = useAssetsStore(e => e.fetchUserAssets);
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

    await swapWithPassword(
      accountInfo,
      assets.A.asset.symbol,
      assets.B.asset.symbol,
      Number(assets.B.amount),
    );

    onAfterSwap();
  };

  return () =>
    catchError(
      fn,
      () => update(accountName),
      e => {
        onFail();
        if ((e as Error).message === 'Expected value, got null') {
          return true; // Swallow this exception
        }
      },
    );
};

const makeMessage = (assets: ScreenAssets) =>
  `Succesfully traded ${assets.A.amount} ${assets.A.asset.symbol}` +
  ' to ' +
  `${assets.B.amount} ${assets.A.asset.symbol}`;

const TradeScreen: React.FC = () => {
  const allAssets = useAssets();
  const avaliableAssets = useMemo(
    () => allAssets?.assetsWithBalance.sort((a, b) => a.symbol.localeCompare(b.symbol)),
    [allAssets],
  );

  const { assets, Modal } = useAssetPair(avaliableAssets.at(0), avaliableAssets.at(3));

  const nav = useNavigation<WalletNavigationProp>();

  const { LoaderModal, showLoader, hideLoader } = useLoaderModal();
  const { SuccessModal, show } = useSuccessModal(false);

  const fn = usePerformSwap(
    assets,
    () => showLoader(),
    () => show(makeMessage(assets)),
    () => hideLoader(),
  );

  if (allAssets === null || !avaliableAssets) {
    return <Loader />;
  }

  return (
    <SafeAreaView>
      <Backdrop />
      <Modal />
      <LoaderModal />
      <SuccessModal onClose={() => nav.goBack()} />
      <View>
        <FloatingButton assets={assets} />
        <List style={styles.listStyle}>
          <View style={styles.listView}>
            <Text style={styles.listHeading}>Convert</Text>
            <View style={styles.rowJustifyBetween}>
              <AssetDisplay asset={assets.A} />
              <AmountInput asset={assets.A} />
            </View>
          </View>
          <View style={{ padding: 16 }}>
            <Text style={styles.listHeading}>To</Text>
            <View style={styles.rowJustifyBetween}>
              <AssetDisplay asset={assets.B} />
              <AmountInput asset={assets.B} />
            </View>
          </View>
        </List>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={fn}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Exchange</Text>
          </View>
        </TouchableOpacity>
        <Text>The spread for this transaction is 0.423%</Text>
      </View>
    </SafeAreaView>
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
    width: 100,
    color: '#000',
  },
  rowEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  usdtLable: { fontSize: 14, textAlign: 'right', padding: 0 },
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
});
