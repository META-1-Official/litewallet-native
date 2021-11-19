import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { List } from '../../components/List';
import Loader from '../../components/Loader';
import { useStore } from '../../store';
import { colors } from '../../styles/colors';
import { catchError } from '../../utils';
import { sendWithPassword, useAssets, useAssetsStore } from '../../utils/meta1Api';
import { useAssetPicker } from '../../components/AssetSelectModal';
import { useLoaderModal } from '../../components/LoaderModal';
import { DexSSP } from '.';
import { ArrowLeft } from 'react-native-feather';
import { SvgIcons } from '../../../assets';

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
const DexSend: React.FC<DexSSP> = props => {
  const nav = props.navigation;
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
    <>
      <Header {...props} title={`Send ${selectedAsset.symbol}`} />
      <SafeAreaView style={{ height: '100%', backgroundColor: '#320001' }}>
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
                      color: '#999',
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
                      color: '#fff',
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
                        color: '#fff',
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
                    backgroundColor: '#fff',
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
              <Text style={styles.SectionTitle}>Password</Text>
              <TextInput
                style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}
                value={password}
                placeholder="Password"
                placeholderTextColor="#fff"
                onChangeText={t => setPassword(t)}
              />
            </View>
          </List>

          <TouchableOpacity
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

export default DexSend;

const styles = StyleSheet.create({
  SectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: Platform.OS === 'ios' ? 8 : 2,
    color: colors.BrandYellow,
  },
});
