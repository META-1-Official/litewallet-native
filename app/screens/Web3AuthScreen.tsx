import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, Button } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootNavigationProp } from '../App';
import RoundedButton from '../components/RoundedButton';

import * as WebBrowser from '@toruslabs/react-native-web-browser';
import Web3Auth, { OPENLOGIN_NETWORK, LOGIN_PROVIDER } from '@web3auth/react-native-sdk';

const resolvedRedirectUrl = 'io.meta1.appbeta://auth';

export const Web3AuthScreen = ({ route }) => {
  const nav = useNavigation<RootNavigationProp>();
  const [key, setKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { firstName, lastName, mobile, accountName } = route.params;

  useEffect(() => {
    if (key) {
      nav.navigate('FaceKI', { key, firstName, lastName, mobile, accountName });
    }
  }, [key, firstName, lastName, mobile, accountName]);

  const login = async () => {
    try {
      const web3auth = new Web3Auth(WebBrowser, {
        clientId:
          'BENfRWt5wyCFCi-nKzu6gIlPABHbvgub3lhZUhUp_r4XD2xmdph0MZMaXY89xnfPVs9wMao5vlBiA6dtP-4H1i0',
        network: OPENLOGIN_NETWORK.TESTNET,
      });

      const state = await web3auth.login({
        loginProvider: LOGIN_PROVIDER.GOOGLE,
        redirectUrl: resolvedRedirectUrl,
      });

      setKey(state.privKey || 'no key');
    } catch (e) {
      console.error(e);
      setErrorMsg(String(e));
    }
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
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: '#2E2E2E',
            padding: 40,
          }}
        >
          Now, its time to setup your passwordless authentication for your new META 1 wallet
        </Text>

        <Text>Key: {key}</Text>
        <Text>Error: {errorMsg}</Text>
        <Text>Linking URL: {resolvedRedirectUrl}</Text>
        <Button title="Login with Web3Auth" onPress={login} />

        <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <RoundedButton
            styles={{ flex: 1 }}
            title="Next"
            disabled={!key}
            onPress={() =>
              nav.navigate('FaceKI', { key, firstName, lastName, mobile, accountName })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Web3AuthScreen;
