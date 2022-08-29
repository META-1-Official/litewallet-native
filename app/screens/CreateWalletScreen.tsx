import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform, SafeAreaView, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import { useStore } from '../store';
import { catchError } from '../utils';
import createAccountWithPassword from '../utils/accountCreate';
import { getAccount } from '../services/meta1Api';
import {
  // email,
  // hasSpecialChars,
  lettersOnly,
  // minLen,
  // noRepeat,
  // noSpace,
  required,
  // upperAndLowerCase,
} from '../utils/useFormHelper/rules';
//@ts-ignore
import { ChainValidation } from 'meta1-vision-js';
import { useForm } from 'react-hook-form';
import { RootNavigationProp } from '../App';
import { Input, PasswordInput, PhoneInput } from '../utils/useFormHelper/useFormHelper';

const freeName = async (text: string) => {
  const acc = await getAccount(text).catch(console.debug);
  return !acc || 'This account name is already taken';
};

const premiumName = (t: string) =>
  ChainValidation.is_cheap_name(t) ||
  'This is a premium name which is not supported by this faucet. Please enter a regular name containing least one dash or a number';

const chainValidate = (t: string) => ChainValidation.is_account_name_error(t);

const CreateWalletScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const authorize = useStore(state => state.authorize);
  const { control, handleSubmit, getValues } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      accountName: '',
      password: '',
      passwordRepeat: '',
    },
  });

  // const { Input, formState, valid, validState } = useForm([
  //   { name: 'first_name', lable: 'First name', rules: [required, lettersOnly] },
  //   { name: 'last_name', lable: 'Last name', rules: [required, lettersOnly] },
  //   { name: 'email', lable: 'Email', rules: [required, email] },
  //   { name: 'mobile', lable: 'Mobile number', rules: [mobile] },
  //   {
  //     name: 'account_name',
  //     lable: 'Account name',
  //     rules: [required, premiumName, freeName, chainValidate],
  //   },
  //   {
  //     name: 'password',
  //     lable: 'Password',
  //     rules: [required, minLen(8), hasSpecialChars, upperAndLowerCase, noRepeat, noSpace],
  //   },
  //   {
  //     name: 'password_repeat',
  //     lable: 'Confirm Password',
  //     rules: [required, same('password')],
  //   },
  // ]);

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
          justifyContent: 'space-between',
        }}
      >
        <View style={{ marginHorizontal: 24 }}>
          <Heading style={{ marginBottom: 8 }}>Create META Wallet</Heading>
          <TextSecondary style={{ marginBottom: 18 }}>
            Provide access to your META Lite Wallet
          </TextSecondary>

          {/*<KeyboardAwareScrollView extraHeight={Platform.OS === 'ios' ? 1 : 120}>*/}
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Input
                control={control}
                style={{ width: '48%' }}
                name="firstName"
                label="First Name"
                rules={{
                  required,
                  validate: {
                    lettersOnly,
                  },
                }}
              />
              <View style={{ width: '4%' }} />
              <Input
                control={control}
                style={{ width: '48%' }}
                name="lastName"
                label="Last Name"
                rules={{ required, validate: { lettersOnly } }}
              />
            </View>
            {/*<Input*/}
            {/*  control={control}*/}
            {/*  name="email"*/}
            {/*  label="Email"*/}
            {/*  autoCapitalize="none"*/}
            {/*  autoCorrect={false}*/}
            {/*  autoCompleteType="email"*/}
            {/*  rules={{*/}
            {/*    required,*/}
            {/*    validate: {*/}
            {/*      email,*/}
            {/*    },*/}
            {/*  }}*/}
            {/*/>*/}
            <PhoneInput control={control} name="mobile" />
            <Input
              control={control}
              name="accountName"
              label="Wallet Name"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              rules={{
                required,
                validate: {
                  premiumName,
                  chainValidate,
                  freeName,
                },
              }}
              render={props => (
                <TextInput {...props} onChangeText={t => props.onChangeText?.(t.toLowerCase())} />
              )}
            />
            {/*<Input*/}
            {/*  control={control}*/}
            {/*  name="password"*/}
            {/*  label="Password"*/}
            {/*  rules={{*/}
            {/*    required,*/}
            {/*    validate: {*/}
            {/*      _minLen: minLen(8),*/}
            {/*      hasSpecialChars,*/}
            {/*      upperAndLowerCase,*/}
            {/*      noRepeat,*/}
            {/*      noSpace,*/}
            {/*    },*/}
            {/*  }}*/}
            {/*  render={PasswordInput}*/}
            {/*/>*/}
            {/*<TextSecondary style={{ fontSize: 14 }}>*/}
            {/*  Please keep your password in a safe place. Don’t share it with any third-parties or*/}
            {/*  send it online.*/}
            {/*</TextSecondary>*/}
            {/*<Input*/}
            {/*  control={control}*/}
            {/*  name="passwordRepeat"*/}
            {/*  label="Confirm Password"*/}
            {/*  secureTextEntry={true}*/}
            {/*  rules={{*/}
            {/*    required,*/}
            {/*    validate: {*/}
            {/*      same: t =>*/}
            {/*        t === getValues('password') ||*/}
            {/*        'Confirm password should be the same as Password',*/}
            {/*    },*/}
            {/*  }}*/}
            {/*/>*/}
          </View>
          {/*</KeyboardAwareScrollView>*/}
        </View>
        <View>
          <RoundedButton
            title="Submit"
            // disabled={!Object(errors.values)}
            // onPress={handleSubmit(fs => {
            //   navigation.navigate('Loader');
            //   catchError(
            //     async () => {
            //       const _apiRes = await createAccountWithPassword(
            //         fs.accountName,
            //         fs.password,
            //         // --Who cares
            //         false,
            //         '',
            //         1,
            //         '',
            //         // --
            //         fs.mobile,
            //         fs.email,
            //         fs.lastName,
            //         fs.firstName,
            //       );
            //       authorize(fs.accountName, fs.password);
            //     },
            //     {
            //       onErr: () => navigation.goBack(),
            //     },
            //   );
            // })}
            onPress={handleSubmit(formState => {
              const { firstName, lastName, mobile, accountName } = formState;
              navigation.navigate('Web3Auth', { firstName, lastName, mobile, accountName });
            })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default CreateWalletScreen;
