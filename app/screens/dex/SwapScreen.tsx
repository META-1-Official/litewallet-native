/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import throttle from 'lodash.throttle';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DexSSP } from '.';
import { SvgIcons } from '../../../assets';
import { useAssetPicker } from '../../components/AssetSelectModal';
import { List } from '../../components/List';
import Loader from '../../components/Loader';
import { useLoaderModal } from '../../components/LoaderModal';
import { useSuccessModal } from '../../components/SuccessModal';
import { Heading, TextSecondary } from '../../components/typography';
import { useStore } from '../../store';
import { colors } from '../../styles/colors';
import { catchError, promptPromise, style } from '../../utils';
import { swapWithPassword, useAssets, useAssetsStore } from '../../utils/meta1Api';

type HeaderProps = {
  title: string;
  titleSubscript?: JSX.Element;
} & DexSSP;
const Header: React.FC<HeaderProps> = ({ title, navigation, titleSubscript }) => {
  const BackButton = ({ color }: { color: string }) => (
    <TouchableOpacity
      style={{ marginHorizontal: 12 }}
      activeOpacity={0.5}
      onPress={() => navigation.navigate('__Tabs')}
    >
      <ArrowLeft width={32} height={32} stroke={color} />
    </TouchableOpacity>
  );
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#1e0000',
        height: (Platform.OS === 'ios' ? 89 : 48) + 8,
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <BackButton color="#fff" />
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 20,
            color: '#fff',
            fontWeight: '500',
          }}
        >
          {title}
        </Text>
        {titleSubscript ? titleSubscript : null}
      </View>
      {/* Empty view for space between alignment, mimics back button sizing*/}
      <View style={{ width: 32, height: 32, marginHorizontal: 12 }} />
    </SafeAreaView>
  );
};

const DexSwapScreen: React.FC<DexSSP> = props => {
  const nav = props.navigation;
  const [aAmt, setAAmt] = useState('0.00');
  const [bAmt, setBAmt] = useState('0.00');

  const [aUsd, setAUsd] = useState('0.00');
  const [bUsd, setBUsd] = useState('0.00');

  const accountName = useStore(state => state.accountName);
  const password = useStore(state => state.password);
  const allAssets = useAssets();
  const fetchAssets = useAssetsStore(state => state.fetchUserAssets);
  const avaliableAssets = useMemo(
    () => allAssets?.assetsWithBalance.sort((a, b) => a.symbol.localeCompare(b.symbol)),
    [allAssets],
  );

  if (allAssets === null || !avaliableAssets) {
    return <Loader />;
  }
  const [selectedAssetA, openA, _closeA, ModalA] = useAssetPicker(avaliableAssets.at(0));
  const [selectedAssetB, openB, _closeB, ModalB] = useAssetPicker(avaliableAssets.at(3));

  const { LoaderModal, showLoader, hideLoader } = useLoaderModal();
  const { SuccessModal, show } = useSuccessModal(false);
  useEffect(() => {
    setAAmt('0.00');
    setBAmt('0.00');
    setAUsd('0.00');
    setBUsd('0.00');
  }, [selectedAssetA, selectedAssetB]);

  useEffect(() => setAUsd((selectedAssetA!.usdt_value * Number(aAmt)).toFixed(2)), [aAmt]);
  useEffect(() => setBUsd((selectedAssetB!.usdt_value * Number(bAmt)).toFixed(2)), [bAmt]);
  if (!selectedAssetA || !selectedAssetB) {
    return <Text> Nothing to swap</Text>;
  }

  console.log(avaliableAssets);

  const updateFromUSD = (usdVal: string) => {
    const targetUsd = Number(usdVal);
    const amtA = targetUsd / selectedAssetA.usdt_value;
    const amtB = targetUsd / selectedAssetB.usdt_value;
    setAAmt(amtA.toFixed(8));
    setBAmt(amtB.toFixed(8));
  };

  const convertFn = () =>
    catchError(
      async () => {
        console.log(aAmt, bAmt);
        console.log(password);
        const pass = await (async () => {
          if (password) {
            return password;
          } else {
            console.log('Propmting for password');
            return await promptPromise(
              'Enter password',
              'Password is required for this operation',
              'secure-text',
            );
          }
        })();

        showLoader();

        if (pass === null) {
          return;
        }

        await swapWithPassword(
          {
            accountName,
            password: pass,
          },
          selectedAssetA!.symbol,
          selectedAssetB!.symbol,
          Number(bAmt),
        );
        setTimeout(() => fetchAssets(accountName), 3000);
        await fetchAssets(accountName);
        hideLoader();
        show(
          `Succesfully traded ${aAmt} ${selectedAssetA!.symbol}` +
            ' to ' +
            `${bAmt} ${selectedAssetB!.symbol}`,
        );
      },
      () => {},
      () => hideLoader(),
    );

  return (
    <>
      <Header {...props} title="Convert Crypto" />
      <SafeAreaView style={{ backgroundColor: '#320001', height: '100%' }}>
        <ModalA key="AssetPicker_A" title="Trade" />
        <ModalB key="AssetPicker_B" title="Trade" />
        <LoaderModal />
        <SuccessModal onClose={() => nav.goBack()} />
        <View>
          <List style={{ backgroundColor: '#3c0000', borderRadius: 8, margin: 18 }}>
            <View
              style={{
                margin: 16,
                paddingBottom: 16,
                marginBottom: 0,
                borderBottomWidth: 1,
                borderBottomColor: colors.BrandYellow,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    marginBottom: 8,
                    color: colors.BrandYellow,
                  }}
                >
                  Convert
                </Text>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 4,
                    padding: 8,
                    paddingHorizontal: 12,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setAAmt(selectedAssetA.amount.toFixed(8));
                      const amtB = selectedAssetA.total_value / selectedAssetB.usdt_value;
                      setBAmt(amtB.toFixed(8));
                    }}
                  >
                    <View style={{ flexDirection: 'row' }}>
                      <SvgIcons.Wallet width={18} height={18} fill={colors.BrandYellow} />
                      <Text style={{ textAlign: 'center', fontWeight: '700', marginLeft: 8 }}>
                        MAX
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
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
                      <Heading style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}>
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
                      color: '#fff',
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
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <TextSecondary
                      style={{ fontSize: 14, textAlign: 'right', padding: 0, color: '#fff' }}
                    >
                      US$
                    </TextSecondary>
                    <TextInput
                      onChangeText={t => throttle(updateFromUSD, 700)(t)}
                      defaultValue={aUsd}
                      style={styles.usdInput}
                    />
                  </View>
                </View>
              </View>
            </View>
            <View style={{ padding: 16 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  marginBottom: 8,
                  color: colors.BrandYellow,
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
                      <Heading style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}>
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
                      color: '#fff',
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
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TextSecondary
                      style={{ fontSize: 14, textAlign: 'right', padding: 0, color: '#fff' }}
                    >
                      US$
                    </TextSecondary>
                    <TextInput value={bUsd} style={styles.usdInput} />
                  </View>
                </View>
              </View>
            </View>
          </List>
        </View>
        <View
          style={{
            margin: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff' }}>The spread for this transaction is 0.423%</Text>
        </View>
        <TouchableOpacity onPress={convertFn}>
          <View
            style={{
              backgroundColor: colors.BrandYellow,
              alignItems: 'center',
              padding: 18,
              margin: 24,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '500' }}>Convert</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};
export default DexSwapScreen;

const styles = StyleSheet.create({
  usdInput: style(
    {
      marginLeft: 8,
      fontSize: 14,
      color: '#fff',
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
