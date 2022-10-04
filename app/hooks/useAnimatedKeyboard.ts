import { useEffect, useRef } from 'react';
import { Animated, Keyboard } from 'react-native';

const useAnimatedKeyboard = () => {
  const offsetY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    console.log('re-render');
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(offsetY, {
        toValue: -300,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(offsetY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  });

  return offsetY;
};

export default useAnimatedKeyboard;
