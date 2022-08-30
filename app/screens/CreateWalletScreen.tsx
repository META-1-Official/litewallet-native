import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  NativeSyntheticEvent,
  Platform,
  SafeAreaView,
  TextInput,
  TextInputChangeEventData,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import { useStore } from '../store';
import { catchError } from '../utils';
import createAccountWithPassword from '../utils/accountCreate';
import { getAccount } from '../services/meta1Api';
import {
  email,
  hasSpecialChars,
  lettersOnly,
  minLen,
  noRepeat,
  noSpace,
  required,
  upperAndLowerCase,
} from '../constants/formRules';
//@ts-ignore
import { ChainValidation } from 'meta1-vision-js';
import { useForm } from 'react-hook-form';
import { RootNavigationProp } from '../App';
// import { Input, PasswordInput, PhoneInput } from '../hooks/useFormHelper';
import Input from '../components/Input/Input';
import PasswordInput from '../components/PasswordInput';
import PhoneInput from '../components/PhoneInput';

const premiumName = (t: string) =>
  /^[a-z][a-z0-9]*((([-][a-z0-9]+)+)|[0-9]+)$/.test(t) ||
  'This is a premium name which is not supported by this faucet. Please enter a regular name containing least one dash or a number';

const chainValidate = (t: string) => ChainValidation.is_account_name_error(t);

const CreateWalletScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const authorize = useStore(state => state.authorize);
  let accountNameInputValue = '';
  const { control, handleSubmit, getValues, setError } = useForm({
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

  const freeName = async (text: string) => {
    const acc = await getAccount(text).catch(console.debug);
    if (accountNameInputValue) {
      return !acc || 'This account name is already taken';
    } else {
      setTimeout(
        () => setError('accountName', { type: 'required', message: 'This field is required' }),
        1,
      );
      return true;
    }
  };

  const setAccountNameInputValue = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    accountNameInputValue = e.nativeEvent.text;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <ScrollView>
        <View style={{ marginHorizontal: 24 }}>
          <Heading style={{ marginBottom: 8 }}>Create META Wallet</Heading>
          <TextSecondary style={{ marginBottom: 18 }}>
            Provide access to your META Lite Wallet
          </TextSecondary>

          <KeyboardAwareScrollView extraHeight={Platform.OS === 'ios' ? 1 : 120}>
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
              <Input
                control={control}
                name="email"
                label="Email"
                autoCapitalize="none"
                autoCorrect={false}
                autoCompleteType="email"
                rules={{
                  required,
                  validate: {
                    email,
                  },
                }}
              />
              <PhoneInput control={control} name="mobile" />
              <Input
                control={control}
                name="accountName"
                label="Account Name"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChange={e => setAccountNameInputValue(e)}
                rules={{
                  required,
                  validate: {
                    chainValidate,
                    freeName,
                    premiumName,
                  },
                }}
                render={props => (
                  <TextInput
                    {...props}
                    onChangeText={t => props.onChangeText?.(t.toLowerCase())}
                  />
                )}
              />
              <Input
                control={control}
                name="password"
                label="Password"
                rules={{
                  required,
                  validate: {
                    _minLen: minLen(8),
                    hasSpecialChars,
                    upperAndLowerCase,
                    noRepeat,
                    noSpace,
                  },
                }}
                render={PasswordInput}
              />
              <TextSecondary style={{ fontSize: 14 }}>
                Please keep your password in a safe place. Don’t share it with any third-parties or
                send it online.
              </TextSecondary>
              <Input
                control={control}
                name="passwordRepeat"
                label="Confirm Password"
                secureTextEntry={true}
                rules={{
                  required,
                  validate: {
                    same: t =>
                      t === getValues('password') ||
                      'Confirm password should be the same as Password',
                  },
                }}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
        <View>
          <RoundedButton
            title="Submit"
            // disabled={!Object(errors.values)}
            onPress={handleSubmit(fs => {
              navigation.navigate('Loader');
              catchError(
                async () => {
                  const _apiRes = await createAccountWithPassword(
                    fs.accountName,
                    fs.password,
                    // --Who cares
                    false,
                    '',
                    1,
                    '',
                    // --
                    fs.mobile,
                    fs.email,
                    fs.lastName,
                    fs.firstName,
                  );
                  authorize(fs.accountName, fs.password);
                },
                {
                  onErr: () => navigation.goBack(),
                },
              );
            })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default CreateWalletScreen;
