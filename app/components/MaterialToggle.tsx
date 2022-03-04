import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, TouchableWithoutFeedback, View } from 'react-native';
import { colors } from '../styles/colors';
import { shadow } from '../utils/index';

interface Props {
  onChange?: (active: boolean) => void;
  defaultValue?: boolean;
}

const KNOB_SIZE = 24;
const MaterialToggle: React.FC<Props> = ({ onChange, defaultValue }) => {
  const [onoff, setOnOff] = useState(defaultValue || false);
  const anim = useRef(new Animated.Value(0)).current;
  const move = (x: number) =>
    Animated.timing(anim, {
      toValue: x,
      duration: 150,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.quad),
    }).start();

  const on = () => move(KNOB_SIZE * 0.7);

  const off = () => move(0);

  useEffect(() => {
    onChange && onChange(onoff);
    // if on -> off if off -> off
    onoff ? off() : on();
  }, [onoff]);
  return (
    <TouchableWithoutFeedback accessibilityLabel="MUI/Toggle" onPress={() => setOnOff(!onoff)}>
      <View
        style={{
          height: KNOB_SIZE,
          paddingTop: 1,
        }}
      >
        <View
          style={{
            width: KNOB_SIZE * 1.7,
            height: Math.ceil(KNOB_SIZE * 0.7),
            // + 88 Makes #RRGGBBAA form #RRGGBB
            backgroundColor: colors.BrandYellow + '88',
            borderRadius: KNOB_SIZE,
          }}
        />
        <Animated.View
          style={{
            ...shadow.D1,
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            backgroundColor: colors.BrandYellow,
            borderRadius: KNOB_SIZE,
            position: 'relative',
            top: KNOB_SIZE * -1 + Math.ceil(KNOB_SIZE * 0.7) / 5,
            left: anim,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MaterialToggle;
