import { useNavigation } from '@react-navigation/core';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { RootNavigationProp } from '../../AuthNav';
import RoundedButton from '../../components/RoundedButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { registerAccount } from '../../store/signUp/signUp.actions';

export const PaymentSuccess = () => {
  const nav = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const { email, accountName, passKey, mobile, lastName, firstName, registerStatus } =
    useAppSelector(state => state.signUp);

  useEffect(() => {
    if (!registerStatus) {
      dispatch(
        registerAccount({
          accountName,
          passKey,
          mobile,
          email,
          firstName,
          lastName,
        }),
      );
    }
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
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
          {!registerStatus ? 'Loading...' : 'Successfully Paid'}
        </Text>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {registerStatus && (
            <>
              <View style={{ marginTop: 20, marginBottom: 20 }}>
                <TextInput
                  style={{
                    padding: 10,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'black',
                  }}
                  value={passKey}
                />
              </View>
              <View
                style={{
                  backgroundColor: '#FFF2F2',
                  borderColor: '#FF2F2F',
                  borderWidth: 1,
                  padding: 20,
                }}
              >
                <View>
                  <Text style={{ fontSize: 22 }}>Important information</Text>
                  <Text style={{ fontSize: 15, paddingTop: 15 }}>
                    If you forget your password phrase you will be unable to access your account
                    and your funds. We cannot reset or restore your password! Memorise or white
                    your username and password!
                  </Text>
                </View>
              </View>
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
