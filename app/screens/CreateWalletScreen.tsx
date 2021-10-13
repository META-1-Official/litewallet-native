import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TextInputMask from 'react-native-text-input-mask';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
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
        <KeyboardAwareScrollView extraHeight={1}>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Input style={{ width: '48%' }} name="first_name" />
              <View style={{ width: '4%' }} />
              <Input style={{ width: '48%' }} name="last_name" />
            </View>
            <Input name="email" />
            <Input
              name="mobile"
              render={props => (
                //@ts-ignore
                <TextInputMask {...props}  mask="+[099] ([000]) [000] [00] [00]" />
              )}
            />
            <Input name="account_name" />
            <Input name="password" />
            <Input name="password_repeat" />
          </View>
        </KeyboardAwareScrollView>
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
