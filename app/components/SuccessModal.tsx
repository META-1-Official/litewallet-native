import React, { useState } from 'react';
import { View, Modal, Text, SafeAreaView, Platform } from 'react-native';
import { CheckCircle } from 'react-native-feather';
import RoundedButton from './RoundedButton';

interface Props {
  visible: boolean;
  onClose: () => void;
  text?: string;
}
const SuccessModal: React.FC<Props> = ({ visible, onClose, text }) => {
  const Backdrop: React.FC<{}> = ({ children }) => (
    <Modal visible={visible} onRequestClose={onClose} animationType="fade" transparent={true}>
      <SafeAreaView style={{ backgroundColor: '#0003', height: '100%', width: '100%' }} />
      {children}
    </Modal>
  );

  const Content: React.FC<{}> = ({ children }) => (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide" transparent={true}>
      {children}
      <SafeAreaView style={{ height: '100%' }}>
        <View
          style={{
            height: '50%',
            marginTop: 'auto',
            backgroundColor: '#fff',
            borderRadius: 32,
            borderBottomStartRadius: Platform.OS === 'ios' ? undefined : 0,
            borderBottomEndRadius: Platform.OS === 'ios' ? undefined : 0,
            padding: 24,
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <CheckCircle color="#2E933C" width={80} height={80} />
          <View>
            <Text
              style={{
                fontSize: 18,
                textAlign: 'center',
              }}
            >
              {text
                ? text
                : 'This is a very log description of what could possibly fit into a half sized Modal'}
            </Text>
          </View>
          <RoundedButton title="Close" onPress={() => onClose()} />
        </View>
      </SafeAreaView>
    </Modal>
  );

  if (Platform.OS === 'ios') {
    return (
      <Backdrop>
        <Content />
      </Backdrop>
    );
  } else if (Platform.OS === 'android') {
    return (
      <Content>
        <Backdrop />
      </Content>
    );
  }

  return <></>;
};

export const useSuccessModal = (openDefault?: boolean) => {
  const [open, setOpen] = useState(openDefault || false);
  const [text, setText] = useState('');
  const _Modal = ({ onClose }: { onClose?: () => void }) => (
    <SuccessModal
      visible={open}
      text={text}
      onClose={() => {
        onClose?.();
        setOpen(false);
      }}
    />
  );

  return {
    SuccessModal: _Modal,
    show: (t: string) => {
      setText(t);
      setOpen(true);
    },
  };
};

export default SuccessModal;
