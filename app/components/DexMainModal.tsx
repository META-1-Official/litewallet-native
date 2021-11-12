import React from 'react';
import { Modal, Platform, SafeAreaView, Text, View } from 'react-native';
import { ArrowDownRight, ArrowUpLeft, Maximize2 } from 'react-native-feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../styles/colors';

interface DexModalProps {
  visible: boolean;
  onRequestClose: () => void;
}
const DexModal: React.FC<DexModalProps> = ({ visible, onRequestClose }) => {
  const Backdrop: React.FC<{}> = ({ children }) => (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="fade"
      transparent={true}
    >
      <TouchableOpacity onPress={onRequestClose}>
        <SafeAreaView style={{ backgroundColor: '#0003', height: '100%', width: '100%' }} />
      </TouchableOpacity>
      {children}
    </Modal>
  );

  const Content: React.FC<{}> = ({ children }) => (
    <Modal
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="slide"
      transparent={true}
    >
      {children}

      <View style={{ height: '100%' }}>
        <TouchableOpacity
          style={{
            height: '55%',
          }}
          onPress={onRequestClose}
        />
        <View
          style={{
            height: '45%',
            backgroundColor: '#330000',
            padding: 24,
            paddingTop: 8,
            alignItems: 'flex-start',
            justifyContent: 'space-evenly',
          }}
        >
          <TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Maximize2 width={32} height={32} color="#fff" />
              <View style={{ marginLeft: 24 }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: '#fff',
                    fontWeight: '600',
                  }}
                >
                  Convert
                </Text>
                <Text
                  style={{
                    color: colors.BrandYellow,
                    fontWeight: '500',
                    fontSize: 16,
                  }}
                >
                  Covert one crypto to another
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ArrowUpLeft width={32} height={32} color="#fff" />
              <View style={{ marginLeft: 24 }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: '#fff',
                    fontWeight: '600',
                  }}
                >
                  Send
                </Text>
                <Text
                  style={{
                    color: colors.BrandYellow,
                    fontWeight: '500',
                    fontSize: 16,
                  }}
                >
                  Sebd crypto to another wallet
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ArrowDownRight width={32} height={32} color="#fff" />
              <View style={{ marginLeft: 24 }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: '#fff',
                    fontWeight: '600',
                  }}
                >
                  Receive
                </Text>
                <Text
                  style={{
                    color: colors.BrandYellow,
                    fontWeight: '500',
                    fontSize: 16,
                  }}
                >
                  Receive crypto from another wallet
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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

export default DexModal;
