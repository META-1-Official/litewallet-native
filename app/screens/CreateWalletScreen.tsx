import React from 'react';
import { Platform, SafeAreaView, TextInput, View, TouchableOpacity } from 'react-native';
import { Copy } from 'react-native-feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TextInputMask from 'react-native-text-input-mask';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { catchError } from '../utils';
import createAccountWithPassword from '../utils/accountCreate';
import useForm from '../utils/useForm';
import { email, includes, required, same } from '../utils/useForm/rules';
import Clipboard from '@react-native-clipboard/clipboard';

const CreateWalletScreen: React.FC = () => {
  const authorize = useStore(state => state.authorize);
  const { Input, formState, valid } = useForm([
    { name: 'first_name', lable: 'First name', rules: [required] },
    { name: 'last_name', lable: 'Last name', rules: [required] },
    { name: 'email', lable: 'Email', rules: [required, email] },
    { name: 'mobile', lable: 'Mobile number', rules: [required] },
    { name: 'account_name', lable: 'Account name', rules: [required, includes('-')] },
    {
      name: 'password',
      lable: 'Password',
      value: 'P5KMuEeXky2vKWQNt4w1RyNR73DMS1dqEdkwVULnX7jmJ7G7JZRA',
      valid: true,
    },
    {
      name: 'password_repeat',
      lable: 'Password Confirmation',
      rules: [required, same('password')],
    },
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
        <KeyboardAwareScrollView
          extraHeight={Platform.OS === 'ios' ? 1 : 120}
          enableOnAndroid={true}
        >
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Input style={{ width: '48%' }} name="first_name" />
              <View style={{ width: '4%' }} />
              <Input style={{ width: '48%' }} name="last_name" />
            </View>
            <Input
              name="email"
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="email"
            />
            <Input
              name="mobile"
              render={props => (
                //@ts-ignore
                <TextInputMask {...props} mask="+[099] ([000]) [000] [00] [00]" />
              )}
            />
            <Input name="account_name" autoCapitalize="none" autoCorrect={false} />
            <Input
              name="password"
              render={props => (
                <View key={123} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    {...props}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    onChangeText={() => {}}
                    style={[props.style, { maxWidth: '88%', paddingRight: 8 }]}
                  />
                  <TouchableOpacity onPress={() => Clipboard.setString(formState.password)}>
                    <View
                      style={{
                        backgroundColor: colors.BrandYellow,
                        padding: 6,
                        borderRadius: 5,
                      }}
                    >
                      <Copy width={24} height={24} color="#000" />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
            <Input name="password_repeat" secureTextEntry={true} />
          </View>
        </KeyboardAwareScrollView>
      </View>
      <View>
        <RoundedButton
          title="Submit"
          onPress={() => {
            console.log({ formState, valid: valid() });
            if (valid()) {
              catchError(async () => {
                const _apiRes = await createAccountWithPassword(
                  formState.account_name,
                  formState.password,
                  // --Who cares
                  false,
                  '',
                  1,
                  '',
                  // --
                  formState.phone,
                  formState.email,
                  formState.last_name,
                  formState.first_name,
                );
                authorize(formState.account_name, formState.password);
              });
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateWalletScreen;
