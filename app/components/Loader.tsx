import React from 'react';
import { Dimensions, Image, SafeAreaView } from 'react-native';
import { loaderGif } from '../../assets';

const { width, height } = Dimensions.get('screen');

const Loader: React.FC<{ bgc?: string }> = ({ bgc }) => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: bgc,
      }}
    >
      {/* <ActivityIndicator /> */}
      <Image
        style={{
          width: width / 2,
          height: height / 3,
          resizeMode: 'contain',
          marginTop: '30%',
        }}
        source={loaderGif}
      />
    </SafeAreaView>
  );
};

export default Loader;
