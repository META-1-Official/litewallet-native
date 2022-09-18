import { useNavigation } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { SafeAreaView, Text, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootNavigationProp } from '../../App';
import RoundedButton from '../../components/RoundedButton';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { getWeb3User } from '../../store/signUp/signUp.actions';

export const Web3AuthScreen = () => {
  const nav = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const { privateKey } = useAppSelector(state => state.signUp);

  useEffect(() => {
    if (privateKey) {
      nav.navigate('FaceKI');
    }
  }, [privateKey]);

  const login = async () => {
    dispatch(getWeb3User());
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: '#2E2E2E',
            padding: 40,
            marginBottom: 80,
          }}
        >
          Now, its time to setup your passwordless authentication for your new META 1 wallet
        </Text>

        <Button title="Login with Web3Auth" onPress={login} />

        <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <RoundedButton
            styles={{ flex: 1 }}
            title="Next"
            disabled={!privateKey}
            onPress={() => nav.navigate('FaceKI')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Web3AuthScreen;
