import React, { createContext, useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'react-native-feather';

const { width, height } = Dimensions.get('screen');
const overlayWidth = width * 0.75;

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
    }).start();

  const close = () =>
    Animated.timing(offsetX, {
      toValue: 0,
      duration: 180,
      useNativeDriver: false,
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
        <TouchableOpacity onPress={() => requestClose()}>
          <ArrowLeft width={32} height={32} color="#fff" />
        </TouchableOpacity>
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
