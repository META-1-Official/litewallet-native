import React from 'react';
import { SafeAreaView,  View } from 'react-native';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import useForm from '../utils/useForm';
import { required } from '../utils/useForm/rules';

const CreateWalletScreen: React.FC = () => {
  const { Input, formState } = useForm([
    { name: 'first_name', lable: 'First name' },
    { name: 'last_name', lable: 'Last name' },
    { name: 'email', lable: 'Email', rules: [
      required
    ]},
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
        <Heading style={{ marginBottom: 18 }}>Create META Wallet</Heading>
        <TextSecondary>Provide acess to your META Lite Wallet</TextSecondary>
        <View style={{ flexDirection: 'row' }}>
          <Input style={{ width: '48%' }} name="first_name" onError={() => {}}/>
          <View style={{ width: '4%' }} />
          <Input style={{ width: '48%' }} name="last_name" onError={() => {}}/>
        </View>
        <Input name="email" />
        <Input name="mobile" />
        <Input name="account_name" />
        <Input name="password" />
        <Input name="password_repeat" />
      </View>
      <View>
        <RoundedButton title="Submit" onPress={() => {console.log(formState)}} />
      </View>
    </SafeAreaView>
  );
};

export default CreateWalletScreen;
