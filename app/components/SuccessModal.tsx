import { useNavigation } from '@react-navigation/native';
import { useCardAnimation } from '@react-navigation/stack';

import React from 'react';
import { View, Text, SafeAreaView, Platform, Animated } from 'react-native';
import { CheckCircle } from 'react-native-feather';
import { RootStackNP } from '../WalletNav';
import RoundedButton from './RoundedButton';

type Props = { text: string; onClose: () => void };

const SuccessModal: React.FC<Props> = ({ text, onClose }) => {
  const navigation = useNavigation();
  const { current } = useCardAnimation();
  return (
    <View
      style={{
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}
    >
      <SafeAreaView style={{ height: '100%' }}>
        <Animated.View
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
            transform: [
              {
                scale: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                  extrapolate: 'clamp',
                }),
              },
            ],
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
          <RoundedButton
            title="Close"
            onPress={() => {
              navigation.goBack();
              onClose();
            }}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

export const useShowModal = () => {
  const navigation = useNavigation<RootStackNP>();
  return (text: string, onClose: () => void) => {
    navigation.navigate('modal', {
      component: SuccessModal,
      props: {
        text,
        onClose,
      },
    });
  };
};
