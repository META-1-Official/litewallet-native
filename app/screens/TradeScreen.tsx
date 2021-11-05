/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, SafeAreaView, Text, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAssetPicker } from '../components/AssetSelectModal';
import { List } from '../components/List';
import Loader from '../components/Loader';
import { Heading, TextSecondary } from '../components/typography';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { catchError, promptPromise, shadow } from '../utils';
import { swapWithPassword, useAssets, useAssetsStore } from '../utils/meta1Api';
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

const TradeScreen: React.FC = () => {
  const [aAmt, setAAmt] = useState('0.00');
  const [bAmt, setBAmt] = useState('0.00');

  const accountName = useStore(state => state.accountName);
  const password = useStore(state => state.password);
  const allAssets = useAssets();
  const fetchAssets = useAssetsStore(state => state.fetchUserAssets);
  const avaliableAssets = useMemo(
    () => allAssets?.assetsWithBalance.sort((a, b) => a.symbol.localeCompare(b.symbol)),
    [allAssets],
  );

  const nav = useNavigation<WalletNavigationProp>();
  if (allAssets === null || !avaliableAssets) {
    return <Loader />;
  }
  const [selectedAssetA, openA, _closeA, ModalA] = useAssetPicker(avaliableAssets.at(0));
  const [selectedAssetB, openB, _closeB, ModalB] = useAssetPicker(avaliableAssets.at(3));

  const calcFromA = () => {
    const askPrice = selectedAssetA!.usdt_value * Number(aAmt);
    const amtB = askPrice / selectedAssetB!.usdt_value;
    setBAmt(amtB === 0 ? amtB.toFixed(2) : amtB.toFixed(8));
  };

  useEffect(() => {
    calcFromA();
  }, [selectedAssetA, selectedAssetB]);

  if (!selectedAssetA || !selectedAssetB) {
    return <Text> Nothing to swap</Text>;
  }

  console.log(avaliableAssets);

  return (
    <SafeAreaView>
      <Backdrop />
      <ModalA key="AssetPicker_A" title="Trade" />
      <ModalB key="AssetPicker_B" title="Trade" />
      <View>
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
              setAAmt(selectedAssetA.amount.toString());
              const amtB = selectedAssetA.total_value / selectedAssetB.usdt_value;
              setBAmt(amtB.toFixed(8));
            }}
          >
            <Text style={{ textAlign: 'center', color: colors.BrandYellow, fontWeight: '700' }}>
              MAX
            </Text>
          </TouchableOpacity>
        </View>

        <List style={{ backgroundColor: '#fff', borderRadius: 8, margin: 18 }}>
          <View style={{ padding: 16, borderBottomWidth: 2, borderBottomColor: '#eceef0' }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginBottom: 8,
              }}
            >
              Convert
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity onPress={() => openA()}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    style={{ width: 42, height: 42, resizeMode: 'contain', marginRight: 8 }}
                    source={selectedAssetA._asset.icon}
                  />
                  <View>
                    <Heading style={{ fontSize: 18, fontWeight: '500' }}>
                      {selectedAssetA.symbol}
                    </Heading>
                    <TextSecondary style={{ fontSize: 14 }}>BNB</TextSecondary>
                  </View>
                </View>
              </TouchableOpacity>

              <View>
                <TextInput
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    textAlign: 'right',
                    width: 100,
                    color: '#000',
                  }}
                  keyboardType="numeric"
                  onChangeText={t => {
                    setAAmt(t);
                    const askPrice = selectedAssetA.usdt_value * Number(t);
                    const amtB = askPrice / selectedAssetB.usdt_value;
                    setBAmt(amtB.toFixed(8));
                  }}
                  value={aAmt}
                />
                <TextSecondary style={{ fontSize: 14, textAlign: 'right' }}>
                  US$ {(selectedAssetA.usdt_value * Number(aAmt)).toFixed(2)}
                </TextSecondary>
              </View>
            </View>
          </View>
          <View style={{ padding: 16 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                marginBottom: 8,
              }}
            >
              To
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity onPress={() => openB()}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Image
                    style={{ width: 42, height: 42, resizeMode: 'contain', marginRight: 8 }}
                    source={selectedAssetB._asset.icon}
                  />
                  <View>
                    <Heading style={{ fontSize: 18, fontWeight: '500' }}>
                      {selectedAssetB.symbol}
                    </Heading>
                    <TextSecondary style={{ fontSize: 14 }}>BNB</TextSecondary>
                  </View>
                </View>
              </TouchableOpacity>
              <View>
                <TextInput
                  style={{
                    fontSize: 18,
                    fontWeight: '500',
                    textAlign: 'right',
                    minWidth: 100,
                    color: '#000',
                  }}
                  keyboardType="numeric"
                  onChangeText={t => {
                    setBAmt(t);
                    const askPrice = selectedAssetB.usdt_value * Number(t);
                    const amtA = askPrice / selectedAssetA.usdt_value;
                    setAAmt(amtA.toFixed(8));
                  }}
                  value={bAmt}
                />
                <TextSecondary style={{ fontSize: 14, textAlign: 'right' }}>
                  US$ {(selectedAssetB.usdt_value * Number(bAmt)).toFixed(2)}
                </TextSecondary>
              </View>
            </View>
          </View>
        </List>
      </View>
      <View
        style={{
          margin: 32,
          marginTop: 128,
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() =>
            catchError(async () => {
              console.log(aAmt, bAmt);
              console.log(password);
              if (password === '') {
                const pass = await promptPromise(
                  'Enter password',
                  'Password is required for this operation',
                  'secure-text',
                );
                await swapWithPassword(
                  {
                    accountName,
                    password: pass,
                  },
                  selectedAssetA!.symbol,
                  selectedAssetB.symbol,
                  Number(aAmt),
                );
                await fetchAssets(accountName);
                return nav.goBack();
              } else {
                await swapWithPassword(
                  {
                    accountName,
                    password,
                  },
                  selectedAssetA!.symbol,
                  selectedAssetB.symbol,
                  Number(aAmt),
                );
                await fetchAssets(accountName);
                return nav.goBack();
              }
            })
          }
        >
          <View
            style={{
              ...shadow.D3,
              padding: 12,
              paddingHorizontal: 32,
              borderRadius: 5,
              marginBottom: 24,
              backgroundColor: colors.BrandYellow,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              Exchange
            </Text>
          </View>
        </TouchableOpacity>
        <Text>The spread for this transaction is 0.423%</Text>
      </View>
    </SafeAreaView>
  );
};
export default TradeScreen;
