import React, { useState } from 'react';
import { Dimensions, Image, Modal, SafeAreaView, View } from 'react-native';
import { loaderGif } from '../../assets';

const { width, height } = Dimensions.get('screen');

interface LoaderModalProps {
  visible: boolean;
  onClose: (...args: any[]) => void;
}

const LoaderModal: React.FC<LoaderModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      key={`Loader_Modal__${Math.floor(Math.random() * 10)}`}
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose(!visible);
      }}
    >
      <SafeAreaView
        style={{
          backgroundColor: '#33333333',
          width,
          height,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ padding: 32, backgroundColor: '#fff', borderRadius: 8 }}>
          <Image
            source={loaderGif}
            style={{ width: height / 4, height: height / 4, resizeMode: 'contain' }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export const useLoaderModal = (openDefault?: boolean) => {
  const [open, setOpen] = useState(openDefault || false);

  const _Modal = () => <LoaderModal visible={open} onClose={() => setOpen(false)} />;

  return {
    LoaderModal: _Modal,
    showLoader: () => setOpen(true),
    hideLoader: () => setOpen(false),
  };
};
export default LoaderModal;
