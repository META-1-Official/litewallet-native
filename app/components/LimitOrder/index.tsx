import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, LayoutRectangle, Text, TouchableOpacity, View } from 'react-native';
import { tid } from '../../utils';
import { AssetViewSSP } from './../../screens/dex/AssetView/AssetView';
import { BuyTab, SellTab } from './Tab';

const { height } = Dimensions.get('window');

const useKeyboard = () => {
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const l1 = Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true));
    const l2 = Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false));
    return () => {
      l1.remove();
      l2.remove();
    };
  }, []);

  return keyboardOpen;
};

const AssetViewModal: React.FC<AssetViewSSP> = ({ navigation }) => {
  const [leftTabSelected, setLTSelected] = useState(true);
  const [backdropY, setBackdropY] = useState(height * 0.45);
  const kbdHeight = useRef<number | null>(null);
  const [contentSize, setContentSize] = useState<LayoutRectangle>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });

  const keyboardOpen = useKeyboard();
  useEffect(() => {
    const l = Keyboard.addListener('keyboardDidShow', e => {
      kbdHeight.current = e.endCoordinates.height;
    });

    const forKb = height - contentSize.height - (kbdHeight.current || 0);
    const regular = height - contentSize.height;
    setBackdropY(keyboardOpen ? forKb : regular);
    return () => l.remove();
  }, [keyboardOpen, contentSize]);

  return (
    <View style={{ height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.35)' }}>
      <TouchableOpacity
        {...tid('LimitOrder/CloseModal')}
        style={{
          height: backdropY,
        }}
        onPress={() => navigation.goBack()}
      />
      <View
        style={{
          // height: '65%',
          backgroundColor: '#330000',
          // flexGrow: 1,
        }}
        onLayout={e => setContentSize(e.nativeEvent.layout)}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              flexGrow: 1,
              padding: 12,
              backgroundColor: leftTabSelected ? '#330000' : '#1a0001',
            }}
          >
            <TouchableOpacity {...tid('LimitOrder/BuyTab')} onPress={() => setLTSelected(true)}>
              <Text
                style={{
                  color: leftTabSelected ? '#0f0' : '#888',
                  fontSize: 18,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                BUY
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexGrow: 1,
              padding: 12,
              backgroundColor: !leftTabSelected ? '#330000' : '#1a0001',
            }}
          >
            <TouchableOpacity {...tid('LimitOrder/SellTab')} onPress={() => setLTSelected(false)}>
              <Text
                style={{
                  color: !leftTabSelected ? '#f00' : '#888',
                  fontSize: 18,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}
              >
                SELL
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {leftTabSelected ? <BuyTab /> : <SellTab />}
      </View>
    </View>
  );
};
export default AssetViewModal;
