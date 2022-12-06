import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Share,
  Platform,
} from 'react-native';
import { useAssetPicker } from '../components/AssetSelectModal';
import useAppSelector from '../hooks/useAppSelector';
import { colors } from '../styles/colors';
import { shadow, tid } from '../utils';
import { AddrT, getAddressForAccountAsset } from '../services/meta1Api';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/core';
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

const INDICATOR_HEIGHT = 47;
const INDICATOR_WIDTH = width * 0.8;

const ReceiveScreen: React.FC<{}> = () => {
  const nav = useNavigation<WalletNavigationProp>();
  const accountName = useAppSelector(state => state.wallet.accountName);
  const [selected, open] = useAssetPicker({
    title: 'Receive',
    onClose: () => nav.goBack(),
    exclude: ['BNB', 'XLM', 'META1', 'EOS'],
  });
  const [realAddress, setRealAddress] = useState<AddrT | null>(null);

  useEffect(() => {
    const fn = async () => {
      if (selected) {
        const res = await getAddressForAccountAsset(accountName, selected.symbol);
        setRealAddress(res);
      }
    };
    fn();
  }, [accountName, selected]);

  const scrollX = useRef(new Animated.Value(0)).current;
  const left = scrollX.interpolate({
    inputRange: [0, width * 0.8 + 1],
    outputRange: [0, (INDICATOR_WIDTH / 2) * 0.9 + 1 + (Platform.OS === 'android' ? 2 : 0)],
  });

  const flatListRef = useRef<FlatList<any> | null>(null);
  if (!selected) {
    open();
    // FIXME: We no longer use react-native built in modals, so this not real
    return <SafeAreaView />;
  }

  const RealAddressView = () => {
    if (!realAddress) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    if (realAddress.addr === '') {
      return (
        <View>
          <Text>Failed to get address</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <SvgXml xml={realAddress.qr} width={width * 0.6} height={width * 0.6} />
          <Text style={{ textAlign: 'center', padding: 12 }}>{realAddress.addr}</Text>
        </View>
      );
    }
  };
  const RawWraper: React.FC<{ style?: ViewStyle; shareMsg: string }> = ({
    style,
    shareMsg,
    children,
  }) => {
    return (
      <View
        style={{
          ...shadow.D3,
          height: height * 0.55,
          width: width * 0.8,
          backgroundColor: '#fff',
          marginRight: 12,
          borderRadius: 18,
          padding: 24,
          justifyContent: 'space-between',
          alignItems: 'center',
          ...style,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
          }}
        >
          Deposit {selected.symbol}
        </Text>
        {children}
        <TouchableOpacity
          {...tid('Recive/CopyAddress')}
          onPress={() => {
            if (shareMsg) {
              Share.share({ message: shareMsg });
            }
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: colors.BrandYellow,
            }}
          >
            Copy or share address
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const UsernameDepositView = () => {
    return (
      <View
        style={{
          alignItems: 'center',
        }}
      >
        <View
          style={{
            ...shadow.D3,
            width: 100,
            height: 100,
            borderRadius: 100,
            backgroundColor: '#fff',
            padding: 8,
            margin: 32,
          }}
        >
          <Text
            style={{
              fontSize: 72,
              textAlign: 'center',
              color: colors.BrandYellow,
            }}
          >
            {accountName[0]}
          </Text>
        </View>
        <Text style={{ fontSize: 28, marginBottom: 16 }}>@{accountName}</Text>
        <Text style={{ textAlign: 'center', fontSize: 16 }}>
          Accept From Other META1 Wallet Users
        </Text>
      </View>
    );
  };
  return (
    <SafeAreaView>
      <Backdrop />
      <View>
        <Animated.View
          style={{
            position: 'relative',
            top: INDICATOR_HEIGHT * 0.9,
            left,
            marginHorizontal: width * 0.1 + 5,
            width: INDICATOR_WIDTH / 2,
            height: INDICATOR_HEIGHT * 0.8,
            zIndex: 2,
            elevation: 2,
            backgroundColor: '#fff',
            borderRadius: 32,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#00000033',
            width: INDICATOR_WIDTH,
            marginHorizontal: width * 0.1,
            padding: 12,
            height: INDICATOR_HEIGHT,
            paddingHorizontal: 32,
            borderRadius: 32,
          }}
        />
      </View>
      <View
        style={{
          position: 'relative',
          top: -1 * INDICATOR_HEIGHT,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          width: width * 0.8,
          marginHorizontal: width * 0.1,
          zIndex: 10,
          elevation: 10,
        }}
      >
        <TouchableOpacity
          {...tid('Recive/Pils/Address')}
          onPress={() => {
            flatListRef.current?.scrollToOffset({
              animated: true,
              offset: 0,
            });
          }}
        >
          <View
            style={{
              padding: 12,
              paddingHorizontal: 36,
              paddingLeft: 45,
              // width: INDICATOR_WIDTH / 2,
              // alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '600',
              }}
            >
              Address
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          {...tid('Recive/Pils/Username')}
          onPress={() => {
            flatListRef.current?.scrollToIndex({
              animated: true,
              index: 1,
            });
          }}
        >
          <View
            style={{
              padding: 12,
              paddingHorizontal: 36,
              paddingLeft: 24,
              zIndex: 10,
              elevation: 10,
              // width: Platform.OS === 'android' ? INDICATOR_WIDTH / 2 : undefined,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600' }}>Username</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <Animated.FlatList
          ref={flatListRef}
          data={[
            () => (
              <RawWraper shareMsg={realAddress?.addr || ''}>
                <RealAddressView />
              </RawWraper>
            ),
            () => (
              <RawWraper shareMsg={accountName}>
                <UsernameDepositView />
              </RawWraper>
            ),
          ]}
          renderItem={E => <E.item key={`List_${E.index}`} />}
          horizontal
          scrollEventThrottle={32}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          style={{
            paddingHorizontal: 32,
          }}
          contentContainerStyle={{
            padding: 8,
            paddingRight: 52,
          }}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};
export default ReceiveScreen;
