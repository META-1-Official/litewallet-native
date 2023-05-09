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
import { SvgIcons } from '../../../assets';
import { DKSAV } from '../../components/DismissKeyboard';
import { List } from '../../components/List';
import Loader from '../../components/Loader';
import { useNewLoaderModal } from '../../components/LoaderModal';
import { useShowModal } from '../../components/SuccessModal';
import { Heading, TextSecondary } from '../../components/typography';
import useAppSelector from '../../hooks/useAppSelector';
import { colors } from '../../styles/colors';
import { catchError, ensure, getPassword, shadow, style, tid } from '../../utils';
import {
  AssetBalanceT,
  refreshAssets,
  swapWithPassword,
  useAssets,
  useAssetsStore,
} from '../../services/meta1Api';
import calculateMarketPrice from '../../utils/marketOrder/calculateMarketPrice';
import meta1dex from '../../utils/meta1dexTypes';
import { createPair, theAsset, useAsset } from '../../utils/useAsset';
import AmountsInput from './AmountsInput';
import AssetDisplay from './AssetDisplay';
import Backdrop from './Backdrop';
import DarkFloatingButton from './DarkFloatingButton';
import FloatingButton from './FloatingButton';
import { makeMessage, mkPerformSwap, optStyleFactory, refresh } from './helpers';
import styles from './TradeScreen.styles';
import useAssetPair from './useAssetPair';
import ErrorContext from './ErrorContext';

interface Props {
  darkMode?: boolean;
}

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

  const { accountName } = useAppSelector(state => state.wallet);

  //FIXME: Bruh moment, just checking every half a second if we can proceed
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => setDisabled(errors.length !== 0), [errors]);
  if (!allAssets || !availableAssets || !pair) {
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
    accountName,
  );

  // console.log('!!!!!!!!Pair: ', pair);

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
            {`Current Price: ${calculateMarketPrice(assets.A, assets.B)} `}
            {`${assets.A.asset.symbol}/${assets.B.asset.symbol} \n`}
            {
              // Math bs
              (() => {
                const marketPrice = calculateMarketPrice(assets.A, assets.B);
                return !marketPrice ? 0 : assets.B.toUsdt(1 / marketPrice);
              })().toFixed(2)
            }
            {` USD/${assets.A.asset.symbol}`}
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
