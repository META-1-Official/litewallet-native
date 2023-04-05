import React from 'react';
import { Dimensions, View } from 'react-native';
import { colors } from '../../styles/colors';

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

export default Backdrop;
