import { useNavigation } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, Modal, SafeAreaView, View } from 'react-native';
import { loaderGif } from '../../assets';
import { RootStackNP } from '../WalletNav';

const { width, height } = Dimensions.get('screen');

interface LoaderModalProps {
  visible: boolean;
  onClose: (...args: any[]) => void;
}

const LoaderModalContent = () => {
  return (
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
  );
};

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
      <LoaderModalContent />
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

export const useNewLoaderModal = () => {
  const navigation = useNavigation<RootStackNP>();
  const canClose = useRef(false);
  const open = () => {
    canClose.current = true;
    navigation.navigate('modal', {
      component: LoaderModalContent,
      props: {},
    });
  };

  const close = () => {
    console.log(canClose);
    if (canClose.current) {
      console.log('Closing');
      navigation.navigate('App');
      canClose.current = false;
    }
  };

  return { open, close };
};
export default LoaderModal;
