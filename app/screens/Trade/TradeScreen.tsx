import { useNavigation } from '@react-navigation/core';
import throttle from 'lodash.throttle';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DKSAV } from '../../components/DismissKeyboard';
import { List } from '../../components/List';
import Loader from '../../components/Loader';
import { useNewLoaderModal } from '../../components/LoaderModal';
import { useShowModal } from '../../components/SuccessModal';
import { useStore } from '../../store';
import { colors } from '../../styles/colors';
import { catchError, ensure, getPassword, tid } from '../../utils';
import {
  refreshAssets,
  swapWithPassword,
  useAssets,
  useAssetsStore,
} from '../../services/meta1Api';
import meta1dex from '../../utils/meta1dexTypes';
import FloatingButton from './components/FloatingButton';
import DarkFloatingButton from './components/DarkFloatingButton';
import useAssetPair from './hooks/useAssetPair';
import AssetDisplay from './components/AssetDisplay';
import optStyleFactory from './helpers/optStyleFactory';
import Backdrop from './components/Backdrop';
import AmountsInput from './components/AmountsInput';

import ErrorContext from './helpers/ErrorContext';
import { ScreenAssets, Props } from './types';
import { makeMessage } from './constants';

import styles from './TradeScreen.styles';

const getCrossCheckPrice = async ({ A, B }: ScreenAssets) => {
  try {
    const ticker = await meta1dex.db.get_ticker(A.asset.symbol, B.asset.symbol);
    if (!ticker || !ticker.lowest_ask || ticker.lowest_ask === '0') {
      return;
    }
    const price = Number(A.amount) / Number(B.amount);
    const tickerPrice = Number(ticker.lowest_ask);
    const mesq = (1 / 2) * (price - tickerPrice) ** 2;
    console.log('mesq', mesq);
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

    if (!(await getCrossCheckPrice(assets))) {
      // Noop
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
          <Text style={{ textAlign: 'right', alignSelf: 'center', color: '#888' }}>
            Current Price:{' '}
            {Number(assets.A.ticker?.lowest_ask).toFixed(assets.A.asset._asset.precision)}{' '}
            {assets.A.asset.symbol}/{assets.B.asset.symbol} {'\n'}(
            {
              // Math bs
              (() => {
                const la = Number(assets.A.ticker?.lowest_ask);
                if (!la) {
                  return 0;
                }
                return assets.B.toUsdt(1 / la);
              })().toFixed(2)
            }{' '}
            USDT/{assets.A.asset.symbol})
          </Text>
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
