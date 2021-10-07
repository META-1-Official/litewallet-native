import React from 'react';
import { SafeAreaView,  View } from 'react-native';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import useForm from '../utils/useForm';

const CreateWalletScreen: React.FC = () => {
  const { Input, formState } = useForm([
    { name: 'first_name', placeholder: 'First name' },
    { name: 'last_name', placeholder: 'Last name' },
    { name: 'email', placeholder: 'Email' },
    { name: 'mobile', placeholder: 'Mobile number' },
    { name: 'account_name', placeholder: 'Account name' },
    { name: 'password', placeholder: 'Password' },
    { name: 'password_repeat', placeholder: 'Password Confirmation' },
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
          <Input style={{ width: '45%' }} name="first_name" />
          <View style={{ width: '10%' }} />
          <Input style={{ width: '45%' }} name="last_name" />
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
