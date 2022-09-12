import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { RootNavigationProp } from '../App';
import RoundedButton from '../components/RoundedButton';
import { getUser } from '../services/eSignature';
import { signUp } from '../services/litewalletApi';
//@ts-ignore
import { PrivateKey, key } from 'meta1-vision-js';
import { catchError } from '../utils';
import createAccountWithPassword from '../utils/accountCreate';

const genKey = (seed: string) => `P${PrivateKey.fromSeed(key.normalize_brainKey(seed)).toWif()}`;

export const PaymentSuccess = ({ route, navigation }) => {
  const { email, accountName, passKey, mobile, lastName, firstName } = route.params;
  const nav = useNavigation<RootNavigationProp>();
  const [user, setUser] = useState<any>(null);
  const [auth, setAuth] = useState<string>('');

  useEffect(() => {
    (async () => {
      const response = await getUser(email);
      setUser(response.data);
      const password = genKey(`${accountName}${passKey}`);
      console.log('!Password:', password);
      setAuth(password);
      // const signupResponse = await signUp({ accountName }).catch(e => console.warn(e));
      // setAuth(signupResponse);
      await catchError(
        async () => {
          const _apiRes = await createAccountWithPassword(
            accountName,
            password,
            false,
            '',
            1,
            '',
            mobile,
            email,
            lastName,
            firstName,
          );
          console.log('_apiRes: ', _apiRes);
        },
        {
          // onErr: () => navigation.goBack(),
        },
      );

      console.log(setAuth);
    })();
  }, []);

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
          paddingLeft: 30,
          paddingRight: 30,
        }}
      >
        <View>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Success</Text>
          {user && (
            <>
              <Text>Email: {user?.email}</Text>
              <Text>VoiceitID: {user?.status?.voiceitID}</Text>
              <Text>Payment Status: {user?.status?.isPayed ? 'Paid' : 'Unpaid'}</Text>
              <Text>Sign Status: {user?.status?.isSign ? 'Signed' : 'Unsigned'}</Text>
              <Text style={{ fontSize: 30, fontWeight: 'bold', marginTop: 20 }}>Save Passkey</Text>
              <TextInput value={auth} />
            </>
          )}
        </View>
        <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <RoundedButton
            styles={{ flex: 1 }}
            title="Link wallet now"
            onPress={() => nav.navigate('LinkWallet')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentSuccess;
