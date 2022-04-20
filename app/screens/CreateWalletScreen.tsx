import React, { useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, TextInput, View, TouchableOpacity, Text } from 'react-native';
import { ChevronDown, Copy } from 'react-native-feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TextInputMask from 'react-native-text-input-mask';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { catchError, getRadomByteArray, tid } from '../utils';
import createAccountWithPassword from '../utils/accountCreate';
import useForm, { InputProps } from '../utils/useForm';
import {
  asyncRule,
  email,
  lettersOnly,
  required,
  rule,
  RuleFn,
  same,
} from '../utils/useForm/rules';
import Clipboard from '@react-native-clipboard/clipboard';
import { getAccount } from '../utils/meta1Api';
import { ScrollView } from 'react-native-gesture-handler';
//@ts-ignore
import { ChainValidation } from 'meta1js';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../App';
import { CountryData, CountryUS, isoToEmoji } from '../components/CountryPicker/CountryList';

const freeName: RuleFn = text =>
  asyncRule(async () => {
    const acc = await getAccount(text).catch(console.debug);
    return !acc;
  }, 'This account name is already taken');

const chainValidate: RuleFn = t => ChainValidation.is_account_name_error(t);

const premiumName: RuleFn = t =>
  rule(
    ChainValidation.is_cheap_name(t),
    `This is a premium name which is not supported by this faucet. Please enter a regular name containing least one dash or a number
    `,
  );

const UPPERCASE_RE = /[A-Z]/;
const LOWERCASE_RE = /[a-z]/;
const upperAndLowerCase: RuleFn = (t, n) =>
  rule(
    UPPERCASE_RE.test(t) && LOWERCASE_RE.test(t),
    `${n} should have both upper and lower case letters`,
  );

function noRepeatImpl(t: string) {
  const { substrs } = [...t].reduce(
    (acc, cv) => {
      if (acc.prev === cv) {
        acc.substrs[acc.substrs.length - 1] += cv;
      } else {
        acc.substrs.push(cv);
      }
      acc.prev = cv;
      return acc;
    },
    {
      prev: '',
      substrs: [] as string[],
    },
  );

  const aboveThreshold = substrs.filter(e => e.length > 2);

  return aboveThreshold.length !== 1;
}

const noRepeat: RuleFn = (t, n) =>
  rule(noRepeatImpl(t), `${n} should not have repeating characters`);
const CreateWalletScreen: React.FC = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const authorize = useStore(state => state.authorize);

  const { Input, formState, valid, validState } = useForm([
    { name: 'first_name', lable: 'First name', rules: [required, lettersOnly] },
    { name: 'last_name', lable: 'Last name', rules: [required, lettersOnly] },
    { name: 'email', lable: 'Email', rules: [required, email] },
    { name: 'mobile', lable: 'Mobile number', rules: [required] },
    {
      name: 'account_name',
      lable: 'Account name',
      rules: [required, premiumName, freeName, chainValidate],
    },
    {
      name: 'password',
      lable: 'Password',
      value: Buffer.from(getRadomByteArray(24)).toString('base64').replace(/\W/g, ''),
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
      <ScrollView>
        <View style={{ marginHorizontal: 24 }}>
          <Heading style={{ marginBottom: 8 }}>Create META Wallet</Heading>
          <TextSecondary style={{ marginBottom: 18 }}>
            Provide access to your META Lite Wallet
          </TextSecondary>

          <KeyboardAwareScrollView extraHeight={Platform.OS === 'ios' ? 1 : 120}>
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
              <PhoneInput component={Input} />
              <Input
                name="account_name"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                render={props => (
                  <TextInput
                    {...props}
                    onChangeText={t => props.onChangeText?.(t.toLowerCase())}
                  />
                )}
              />
              <Input
                name="password"
                render={props => (
                  <View key={123} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      {...props}
                      {...tid('CreateWallet/password')}
                      autoCapitalize={'none'}
                      autoCorrect={false}
                      onChangeText={() => {}}
                      style={[props.style, { maxWidth: '88%', paddingRight: 8 }]}
                      editable={false}
                      secureTextEntry
                    />
                    <TouchableOpacity
                      {...tid('CreateWallet/copyPassword')}
                      onPress={() => Clipboard.setString(formState.password)}
                    >
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
              <TextSecondary style={{ fontSize: 14 }}>
                Please keep your password in a safe place. Don’t share it with any third-parties or
                send it online.
              </TextSecondary>
              <Input name="password_repeat" secureTextEntry={true} />
            </View>
          </KeyboardAwareScrollView>
        </View>
        <View>
          <RoundedButton
            title="Submit"
            disabled={!validState}
            onPress={() => {
              if (valid()) {
                navigation.navigate('Loader');
                catchError(
                  async () => {
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
                  },
                  {
                    onErr: () => navigation.goBack(),
                  },
                );
              }
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function PhoneInput({ component }: { component: React.FC<InputProps> }) {
  const navigation = useNavigation<RootNavigationProp>();
  const [country, setCountry] = useState(CountryUS);
  const [internalValue, setInternal] = useState('');

  let mask = '';
  if (country.patterns) {
    const zeros = country.patterns[0].replace(/X/g, '0');
    const brackets = zeros.replace(/ /g, '] [');
    mask = `[${brackets}]`;
  }

  const Input = component;
  const onChangeRef = useRef<(s: string) => void | undefined>();
  const onChangeText = (s: string) => {
    setInternal(s);
    if (onChangeRef.current) {
      onChangeRef.current(`+${country.countryCode} ${s}`);
    }
  };

  useEffect(() => {
    onChangeText('');
  }, [country.countryCode]);

  useEffect(() => {
    if (country.prefixes) {
      // If phone number not starts with prefix.
      // If internal value is shorter than prefix 
      //    make sure they are start the same.
      const prefix = country.prefixes.find(e =>
        internalValue.startsWith(e.slice(0, internalValue.length)),
      );

      if (!prefix) {
        // Find and select fallback
        const fallback = CountryData.find(
          e => e.countryCode === country.countryCode && !e.prefixes,
        );
        // Set US if no fallback
        setCountry(fallback || CountryUS);
      }
    }
  }, [internalValue]);

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('CountryPickerModal', { callback: c => setCountry(c) })}
        style={{ marginRight: 8 }}
      >
        <View style={{ flex: 0.35, marginTop: 28, flexDirection: 'row' }}>
          <Text style={{ fontSize: 18, marginRight: 2 }}>
            {isoToEmoji(country.iso2)} +{country.countryCode}
          </Text>
          <ChevronDown color={'#000'} width={12} height={24} />
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Input
          name="mobile"
          style={{ width: '100%' }}
          render={props => {
            onChangeRef.current = props.onChangeText;
            return (
              //@ts-ignore
              <TextInputMask
                {...props}
                {...tid('CreateWallet/phoneNum')}
                onChangeText={onChangeText}
                value={props.value?.replace(`+${country.countryCode}`, '')}
                mask={mask}
              />
            );
          }}
        />
      </View>
    </View>
  );
}

export default CreateWalletScreen;
