import Clipboard from '@react-native-clipboard/clipboard';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  Dimensions,
  Share,
} from 'react-native';
import { ArrowLeft, Info, Search } from 'react-native-feather';
import { SvgXml } from 'react-native-svg';
import { DexSSP } from '.';
import Loader from '../../components/Loader';
import { useStore } from '../../store';
import { colors } from '../../styles/colors';
import { tid } from '../../utils';
import { AddrT, AssetBalanceT, getAddressForAccountAsset, useAssets } from '../../utils/meta1Api';

type HeaderProps = {
  title: string;
  titleSubscript?: JSX.Element;
} & DexSSP;
const Header: React.FC<HeaderProps> = ({ title, navigation, titleSubscript }) => {
  const BackButton = ({ color }: { color: string }) => (
    <TouchableOpacity
      {...tid('Back')}
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
        backgroundColor: '#000',
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

type AddressViewProps = {
  asset: AssetBalanceT;
} & DexSSP;
const { width } = Dimensions.get('screen');
const AddressView: React.FC<AddressViewProps> = ({ asset }) => {
  const accountName = useStore(state => state.accountName);
  const [compoundAddress, setCA] = useState<AddrT | null>(null);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const fn = async () =>
      await getAddressForAccountAsset(accountName, asset.symbol)
        .then(e => setCA(e))
        .catch(e => {
          console.error(e);
          setErr(true);
        });
    fn();
  }, [accountName, asset.symbol]);

  if (!compoundAddress) {
    if (err) {
      return (
        <SafeAreaView
          style={{
            backgroundColor: '#000',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#a33',
              fontSize: 18,
              width: '60%',
              textAlign: 'center',
            }}
          >
            Failed to get deposit address, try again later.
          </Text>
        </SafeAreaView>
      );
    }
    return <Loader bgc="#000" />;
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#000', height: '100%' }}>
      <View
        style={{
          marginHorizontal: 24,
          backgroundColor: '#fff',
          borderRadius: 8,
          marginTop: 12,
          borderWidth: 1,
          borderColor: '#342325',
        }}
      >
        <SvgXml xml={compoundAddress.qr} height={width} />
        <View style={{ backgroundColor: '#1c1314', padding: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ color: '#fff', fontSize: 15 }}>Address</Text>
              <Text style={{ color: '#fff', fontSize: 16 }}>
                {compoundAddress.addr.slice(0, 10)}...{compoundAddress.addr.slice(-10)}
              </Text>
            </View>
            <TouchableOpacity
              {...tid('DexReceive/CopyAddress')}
              onPress={() => Clipboard.setString(compoundAddress.addr)}
            >
              <View
                style={{
                  justifyContent: 'center',
                  backgroundColor: '#000',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                }}
              >
                <Text
                  style={{
                    alignSelf: 'center',
                    color: colors.BrandYellow,
                    fontSize: 15,
                    fontWeight: '600',
                  }}
                >
                  Copy
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        {...tid('DexReceive/ShareAddress')}
        onPress={() => Share.share({ message: compoundAddress.addr })}
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
          <Text style={{ fontSize: 18, fontWeight: '500' }}>Share Address</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

type AssetSelectionProps = {
  select: (asset: AssetBalanceT) => void;
} & DexSSP;
const AssetSelection: React.FC<AssetSelectionProps> = ({ select }) => {
  const accountAssets = useAssets();
  const [searchText, setSearchText] = useState('');

  if (!accountAssets) {
    return <Loader bgc="#000" />;
  }

  const assets = accountAssets!.assetsWithBalance.filter(
    e => !searchText || e.symbol.includes(searchText.toLocaleUpperCase()),
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#000', height: '100%' }}>
      <View
        style={{
          marginTop: 24,
          flexDirection: 'row',
          marginHorizontal: 12,
          borderWidth: 1,
          padding: 12,
          borderColor: '#444',
          borderRadius: 8,
        }}
      >
        <Search width={24} height={24} color="#fff" />
        <TextInput
          {...tid('ReceiveScreen/AssetSelection/Search')}
          style={{
            alignSelf: 'stretch',
            flexGrow: 1,
            marginLeft: 8,
            color: '#fff',
            fontSize: 18,
            height: 24,
            padding: 0,
          }}
          placeholder="Search"
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={t => setSearchText(t)}
        />
      </View>
      <ScrollView style={{ marginHorizontal: 12 }}>
        <View
          style={{
            marginTop: 8,
            padding: 18,
          }}
        >
          {assets.map(e => {
            return (
              <TouchableOpacity
                {...tid(`DexReceive/Asset_${e.symbol}`)}
                key={`Asset_${e.symbol}`}
                onPress={() => select(e)}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    // padding: 8,
                    marginVertical: 12,
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flexDirection: 'row', width: 144 }}>
                    <Image
                      source={e._asset.icon}
                      style={{
                        width: 48,
                        height: 48,
                        resizeMode: 'contain',
                      }}
                    />
                    <View style={{ marginLeft: 8 }}>
                      <Text style={{ color: '#fff', fontSize: 16 }}>{e.symbol}</Text>
                      <Text style={{ color: '#fff', fontSize: 12 }}>{e.symbol}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      marginLeft: 18,
                      alignItems: 'flex-end',
                    }}
                  >
                    <Text style={{ color: '#fff', fontSize: 16 }}>
                      ${e.total_value.toFixed(2)}
                    </Text>
                    <Text style={{ color: '#aaa' }}>{e.amount}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DexRecive: React.FC<DexSSP> = props => {
  const [asset, selectAsset] = useState<AssetBalanceT | undefined>(undefined);
  const selectCoinText = <Text style={{ color: colors.BrandYellow }}> Select a coin</Text>;
  const shareThisAddressText = (
    <View style={{ flexDirection: 'row' }}>
      <Info width={18} height={18} color={colors.BrandYellow} />
      <Text style={{ color: colors.BrandYellow }}> Share this addres</Text>
    </View>
  );

  return (
    <>
      <Header
        {...props}
        title={`Receive ${asset ? asset.symbol : ''}`}
        titleSubscript={asset ? shareThisAddressText : selectCoinText}
      />
      {asset ? (
        <AddressView {...props} asset={asset} />
      ) : (
        <AssetSelection {...props} select={a => selectAsset(a)} />
      )}
    </>
  );
};

export default DexRecive;
