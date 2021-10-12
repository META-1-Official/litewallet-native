import React, { useRef, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { HelperText } from 'react-native-paper';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import { getObjectSetter } from '../utils';
import useForm from '../utils/useForm';
import { required } from '../utils/useForm/rules';

const CreateWalletScreen: React.FC = () => {
  const { Input, formState, valid } = useForm([
    { name: 'first_name', lable: 'First name', rules: [required] },
    { name: 'last_name', lable: 'Last name', rules: [required] },
    { name: 'email', lable: 'Email', rules: [required] },
    { name: 'mobile', lable: 'Mobile number' },
    { name: 'account_name', lable: 'Account name' },
    { name: 'password', lable: 'Password' },
    { name: 'password_repeat', lable: 'Password Confirmation' },
  ]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <View style={{ marginHorizontal: 24 }}>
        <Heading style={{ marginBottom: 8 }}>Create META Wallet</Heading>
        <TextSecondary style={{ marginBottom: 18 }}>
          Provide acess to your META Lite Wallet
        </TextSecondary>
        <View style={{ flexDirection: 'row' }}>
          <Input style={{ width: '48%' }} name="first_name" />
          <View style={{ width: '4%' }} />
          <Input style={{ width: '48%' }} name="last_name" />
        </View>
        <Input name="email" />
        <Input name="mobile" />
        <Input name="account_name" />
        <Input name="password" />
        <Input name="password_repeat" />
      </View>
      <View>
        <RoundedButton
          title="Submit"
          onPress={() => {
            console.log({ formState, valid: valid() });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateWalletScreen;
