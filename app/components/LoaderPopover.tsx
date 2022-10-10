import React from 'react';
import { Dimensions, Image, SafeAreaView } from 'react-native';
import { loaderGif } from '../../assets';

const { width, height } = Dimensions.get('screen');

interface ILoadingPopover {
  loading?: boolean;
}

const LoaderPopover: React.FC<ILoadingPopover> = ({ loading }) => {
  return (
    <>
      {loading && (
        <SafeAreaView
          style={{
            position: 'absolute',
            width,
            height,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            backgroundColor: 'rgba(255,255,255,0.5)',
          }}
        >
          <Image
            style={{
              width: width / 2,
              height: height / 3,
              resizeMode: 'contain',
              marginTop: '50%',
            }}
            source={loaderGif}
          />
        </SafeAreaView>
      )}
    </>
  );
};

export default LoaderPopover;
