import React, { createContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, SafeAreaView, TouchableOpacity, View } from 'react-native';
import {
  Archive,
  ArrowLeft,
  CreditCard,
  HelpCircle,
  PieChart,
  UserPlus,
} from 'react-native-feather';
import { Text } from 'react-native-paper';
import { SvgIcons } from '../../assets';
import { useStore } from '../store';

const { width, height } = Dimensions.get('screen');
const overlayWidth = width * 0.78;

interface ListItemProps {
  title: string;
  icon?: any;
  onPress?: () => void;
}
const ListItem: React.FC<ListItemProps> = ({ title, icon, onPress }) => {
  let TheIcon: any = () => null;
  let isRawSvg = false;
  if (icon) {
    isRawSvg = icon.name === 'SvgComponent';
    TheIcon = icon;
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: 'row', padding: 12 }}>
        <TheIcon fill={isRawSvg ? '#fff' : undefined} color="#fff" width={24} height={24} />
        <Text style={{ color: '#fff', fontSize: 18, marginLeft: 24 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const OverlayContent: React.FC = () => {
  const accountName = useStore(state => state.accountName);
  return (
    <View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            backgroundColor: 'lightblue',
            borderRadius: 100,
            marginBottom: 20,
          }}
        />
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>{accountName}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {}}
        style={{
          margin: 4,
          marginTop: 18,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            borderColor: '#4b4b4b',
            borderWidth: 1,
            padding: 12,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>Edit Profile & Settings</Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          marginVertical: 24,
        }}
      >
        <ListItem title="Lite Wallet" icon={SvgIcons.Wallet} />
        <ListItem title="DEX" icon={SvgIcons.Trade} />
        <ListItem title="Buy / Sell" icon={CreditCard} />
        <ListItem title="Invite Friends" icon={UserPlus} />
        <ListItem title="Backing Assets" icon={PieChart} />
        <ListItem title="Create Paper Wallet" icon={Archive} />
        <ListItem title="Help" icon={HelpCircle} />
      </View>
      <TouchableOpacity
        onPress={() => {}}
        style={{
          margin: 4,
          marginTop: 18,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            borderColor: '#4b4b4b',
            borderWidth: 1,
            padding: 12,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

interface OverlayProps {
  isOpen: boolean;
  requestClose: () => void;
}
const Overlay: React.FC<OverlayProps> = ({ isOpen, requestClose }) => {
  const offsetX = useRef(new Animated.Value(0)).current;

  const translatedX = offsetX.interpolate({
    inputRange: [0, 1],
    outputRange: [-overlayWidth, 0],
  });

  const open = () =>
    Animated.timing(offsetX, {
      toValue: 1,
      duration: 180,
      useNativeDriver: false,
      easing: Easing.out(Easing.elastic(0.8))
    }).start();

  const close = () =>
    Animated.timing(offsetX, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
      easing: Easing.in(Easing.elastic(0.1))
    }).start();

  useEffect(() => {
    isOpen ? open() : close();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: translatedX,
        height,
        width: overlayWidth,
        backgroundColor: '#120f0f',
        zIndex: 100,
        elevation: 100,
      }}
    >
      <SafeAreaView>
        <View style={{ padding: 8 }}>
          <TouchableOpacity onPress={() => requestClose()}>
            <ArrowLeft width={32} height={32} color="#fff" />
          </TouchableOpacity>
          <OverlayContent />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export const overlayContext = createContext({
  isOpen: false,
  overlayClose: () => {},
  overlayOpen: () => {},
});

export const OverlayContextWrapper: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const overlayOpen = () => setIsOpen(true);
  const overlayClose = () => setIsOpen(false);

  return (
    <>
      <overlayContext.Provider value={{ isOpen, overlayClose, overlayOpen }}>
        <Overlay isOpen={isOpen} requestClose={overlayClose} />
        {children}
      </overlayContext.Provider>
    </>
  );
};

export default Overlay;
