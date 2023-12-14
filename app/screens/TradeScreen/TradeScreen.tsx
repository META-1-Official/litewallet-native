import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useMemo, useState } from 'react';
import { Keyboard, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DKSAV } from '../../components/DismissKeyboard';
import IconButton from '../../components/IconButton';
import { List } from '../../components/List';
import Loader from '../../components/Loader';
import { useNewLoaderModal } from '../../components/LoaderModal';
import { useShowModal } from '../../components/SuccessModal';
import useAppSelector from '../../hooks/useAppSelector';
import useAssetsOnFocus from '../../hooks/useAssetsOnFocus';
import { colors } from '../../styles/colors';
import { tid } from '../../utils';
import AssetDisplay from './AssetDisplay';
import FloatingButton from './FloatingButton';
import { editing, makeMessage, mkPerformSwap, optStyleFactory, refresh } from './helpers';
import styles from './TradeScreen.styles';
import useAssetPair from './useAssetPair';
import ErrorContext from './ErrorContext';

interface Props {
  darkMode?: boolean;
}

const TradeScreen: React.FC<Props> = ({ darkMode }) => {
  const nav = useNavigation();
  const [error, setError] = useState('');

  const [assetAAmount, setAssetAAmount] = useState('0.00');
  const [assetUSDTAmount, setAssetUSDTAmount] = useState('0.00');
  const [assetBAmount, setAssetBAmount] = useState('0.00');
  const [isSwapClicked, setIsSwapClicked] = useState(false);
  // todo: fix type here
  const [inputDelay, setInputDelay] = useState<NodeJS.Timeout>(null);

  const allAssets = useAssetsOnFocus();
  const availableAssets = useMemo(
    () => allAssets?.assetsWithBalance.sort((a, b) => a.symbol.localeCompare(b.symbol)),
    [allAssets],
  );
  const pair = useAssetPair(availableAssets.at(8), availableAssets.at(11));
  const assets = pair?.assets;

  const open = useShowModal();

  const loader = useNewLoaderModal();

  const { accountName } = useAppSelector(state => state.wallet);

  const [disabled, setDisabled] = useState(false);
  const [isVisible, setIsVisible] = useState('flex');
  const [errors, setErrors] = useState([]);

  useEffect(() => setDisabled(errors.length !== 0), [errors]);

  useEffect(() => {
    if (assets) {
      console.log('! Asset A Amount: ', assets.A.amount);
      console.log('! Asset A Symbol: ', assets.A.asset.symbol);
      console.log('! Asset A Market Price: ', assets.A.marketPrice);
      console.log('! Asset A Market Liquidity: ', assets.A.marketLiquidity);
      console.log('! Asset B Amount: ', assets.B.amount);
      console.log('! Asset B Symbol: ', assets.B.asset.symbol);
      console.log('! Asset B Market Price: ', assets.B.marketPrice);
      console.log('! Asset B Market Liquidity: ', assets.B.marketLiquidity);
      if (+assetAAmount > assets.A.asset.amount) {
        setError("You don't have enough balance!");
        setDisabled(true);
      } else if (+assetBAmount > assets.B.marketLiquidity) {
        setError(
          `Market doesn't have enough liquidity. \n Market liquidity: ${assets.B.marketLiquidity} ${assets.B.asset.symbol}`,
        );
        setDisabled(true);
      } else {
        setError('');
        setDisabled(false);
      }
    }
  }, [
    assetAAmount,
    assetBAmount,
    assets?.A.amount,
    assets?.B.amount,
    assets?.A.asset.symbol,
    assets?.B.asset.symbol,
    assets?.A.marketPrice,
    assets?.B.marketPrice,
    assets?.A.marketLiquidity,
    assets?.B.marketLiquidity,
  ]);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', () => {
      setIsVisible('none');
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setIsVisible('flex');
    });

    return () => {
      keyboardDidShow.remove();
      keyboardDidHide.remove();
    };
  }, []);

  useEffect(() => {
    if (assets && (isSwapClicked || +assetAAmount)) {
      // setEditable(true);
      assets.A.setAmount(assetAAmount);
      const assetB = (+assetAAmount / +assets?.A.marketPrice).toFixed(
        assets?.B.asset._asset.precision,
      );
      setAssetUSDTAmount((+assets?.A.toUsdt(assetAAmount)).toFixed(2));
      assets.B.setAmount(assetB);
      setAssetBAmount(assetB);
    } else {
      setAssetBAmount('0.00');
    }
  }, [pair?.swapAssetFlag, assets?.A.marketPrice, assetAAmount]);

  if (!allAssets || !availableAssets || !assets) {
    refresh();
    return <Loader />;
  }
  const onPressMaxButton = () => {
    editing.current?.(false);
    setAssetAAmount(
      (assets.A.asset._balance.balance / 10 ** assets?.A.asset._asset.precision).toFixed(
        assets?.A.asset._asset.precision,
      ),
    );
  };

  const performSwap = mkPerformSwap(
    assets,
    () => {
      loader.open();
    },
    () => {
      console.log('Should hide');
      loader.close();
      open(makeMessage(assets), () => {
        nav.goBack();
        darkMode && nav.goBack();
      });
    },
    () => {
      loader.close();
      assets.B.setAmount((+assets.A.amount * +assets.B.marketPrice).toString());
    },
    accountName,
  );

  const fixInputNumber = (value: string, lostFocus?: boolean) => {
    if (lostFocus) {
      if (value === '') {
        value = '0';
      }
      return value.trim().replace(/\.$/g, '');
    }
    const number = value
      .trim()
      .replace(/[^0-9.,]/g, '')
      .replace(/,/g, '.')
      .replace(/^0+/g, '')
      .replace(/^\./, '0.')
      .replace(/(^.*\.\d*)\.+/, '$1');
    return !isNaN(+number) || number === '' ? number : '0';
  };
  const changeAmountA = (inputData: string) => {
    // setEditable(false);
    setAssetAAmount(inputData);
    const validatedNumber = fixInputNumber(inputData);
    if (inputDelay !== null) {
      clearTimeout(inputDelay);
    }
    setInputDelay(
      setTimeout(() => {
        // setDisabled(true);
        setAssetAAmount(validatedNumber);
      }, 500),
    );
  };

  const changeAmountB = (inputData: string) => {
    const validatedNumber = fixInputNumber(inputData);
    setAssetBAmount(inputData);
    if (inputDelay !== null) {
      clearTimeout(inputDelay);
    }
    setInputDelay(
      setTimeout(() => {
        setAssetBAmount(validatedNumber);
        setAssetAAmount(
          (+validatedNumber * +assets?.A.marketPrice).toFixed(assets?.A.asset._asset.precision),
        );
      }, 500),
    );
  };

  const swapButtonClick = () => {
    setIsSwapClicked(true);
    // todo: fix type here
    pair?.swapAssets();
    // setAssetB(assetA);
    setAssetAAmount(assetBAmount);
  };

  const darkStyle = optStyleFactory(darkMode);

  return (
    <DKSAV style={darkStyle(styles.darkRoot)}>
      <ErrorContext.Provider value={{ errors, setErrors }}>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              zIndex: 10,
              top: 32,
              paddingRight: 48,
              justifyContent: 'flex-end',
            }}
          >
            <IconButton
              style={{
                alignSelf: 'flex-end',
                zIndex: 200,
                backgroundColor: '#330000',
                borderRadius: 5,
                padding: 6,
                paddingHorizontal: 10,
                marginRight: 10,
              }}
              iconName={'loop'}
              iconSize={23}
              iconColor="#ffc000"
              onClick={swapButtonClick}
              isDisabled={pair?.isButtonDisabled}
            />
            <FloatingButton assets={assets} onPressMaxButton={onPressMaxButton} />
          </View>
          <List style={darkStyle(styles.darkList, styles.listStyle)}>
            <View style={darkStyle(styles.darkListView, styles.listView)}>
              <View style={[styles.rowJustifyBetween, styles.center, { paddingVertical: 8 }]}>
                <Text style={darkStyle({ color: colors.BrandYellow }, styles.listHeading)}>
                  Convert
                </Text>
              </View>
              <View style={[styles.rowJustifyBetween]}>
                <AssetDisplay darkMode={darkMode} asset={assets.A} />
                <View style={{ padding: 0 }}>
                  <TextInput
                    maxLength={16}
                    style={[darkStyle(styles.whiteText, styles.amountInput)]}
                    inputMode={'numeric'}
                    keyboardType={'phone-pad'}
                    value={assetAAmount}
                    onChangeText={changeAmountA}
                  />
                  {assets.A.asset.symbol !== 'USDT' && assets.B.asset.symbol !== 'USDT' && (
                    <Text style={[styles.secondary, styles.font14, styles.rowEndNoPadding]}>
                      {assetUSDTAmount} US$
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View style={{ padding: 16 }}>
              <View style={[styles.rowJustifyBetween, styles.center]}>
                <Text style={darkStyle({ color: colors.BrandYellow }, styles.listHeading)}>
                  To
                </Text>
              </View>
              <View style={styles.rowJustifyBetween}>
                <AssetDisplay darkMode={darkMode} asset={assets.B} />
                <TextInput
                  editable={false}
                  maxLength={16}
                  style={[darkStyle(styles.whiteText, styles.amountInput), { color: 'gray' }]}
                  inputMode={'numeric'}
                  keyboardType={'phone-pad'}
                  value={assetBAmount}
                  onChangeText={changeAmountB}
                />
              </View>
            </View>
          </List>
          <Text style={{ textAlign: 'right', alignSelf: 'center', color: '#888' }}>
            {`Current Price: ${Number(assets.A.ticker?.lowest_ask).toFixed(
              assets.A.asset._asset.precision,
            )} `}
            {`${assets.A.asset.symbol}/${assets.B.asset.symbol}\n`}
            {`Market Price: ${assets?.A.marketPrice.toFixed(assets.A.asset._asset.precision)} `}
            {`${assets.A.asset.symbol}/${assets.B.asset.symbol}\n`}
            {assets.A.basePrice.toFixed(2)}
            {` USD/${assets.A.asset.symbol}`}
          </Text>
          {error && (
            <Text style={{ textAlign: 'right', alignSelf: 'center', color: 'red' }}>{error}</Text>
          )}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            {...tid('TradeScreen/Trade')}
            onPress={performSwap}
            disabled={disabled}
          >
            <View
              style={{
                ...styles.button,
                display: isVisible,
                backgroundColor: disabled ? colors.dotGray : colors.BrandYellow,
              }}
            >
              <Text style={styles.buttonText}>Exchange</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ErrorContext.Provider>
    </DKSAV>
  );
};

export default TradeScreen;
