import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { useAssetPicker } from '../../components/AssetSelectModal';
import useAppSelector from '../../hooks/useAppSelector';
import { colors } from '../../styles/colors';
import { tid } from '../../utils';
import { AddrT, getAddressForAccountAsset } from '../../services/meta1Api';
import { useNavigation } from '@react-navigation/core';
import { WalletNavigationProp } from '../WalletScreen';
import RawWrapper from './RawWrapper';
import RealAddressView from './RealAddressView';
import UsernameDepositView from './UsernameDepositView';

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
    exclude: ['BNB', 'XLM', 'META1', 'EOS', 'DOGE', 'SOL', 'TRX', 'XRP', 'ADA', 'BUSD', 'XMR'],
  });
  const [realAddress, setRealAddress] = useState<AddrT | null>(null);

  const fetchAddress = useCallback(async () => {
    if (selected) {
      const res = await getAddressForAccountAsset(accountName, selected.symbol);
      setRealAddress(res);
    }
  }, [accountName, selected?.symbol]);

  useEffect(() => {
    fetchAddress();
  }, [accountName, selected?.symbol]);

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

  const RealAddress = () => (
    <RawWrapper
      shareMsg={realAddress?.addr || ''}
      width={width}
      height={height}
      selected={selected}
    >
      <RealAddressView realAddress={realAddress} width={width} />
    </RawWrapper>
  );

  const UserNameDepositeView = () => (
    <RawWrapper shareMsg={accountName} width={width} height={height} selected={selected}>
      <UsernameDepositView accountName={accountName} />
    </RawWrapper>
  );

  const scrollToOffset = () => {
    flatListRef.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
  };

  const scrollToIndex = () => {
    flatListRef.current?.scrollToIndex({
      animated: true,
      index: 1,
    });
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
        <TouchableOpacity {...tid('Recive/Pils/Address')} onPress={scrollToOffset}>
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
        <TouchableOpacity {...tid('Recive/Pils/Username')} onPress={scrollToIndex}>
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
          data={[RealAddress, UserNameDepositeView]}
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
