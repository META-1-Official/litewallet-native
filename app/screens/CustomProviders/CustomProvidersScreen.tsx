import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MFA_LEVELS } from '@toruslabs/openlogin/src/constants';
import { LOGIN_PROVIDER } from '@web3auth/react-native-sdk';
// import { SdkLoginParams } from '@web3auth/react-native-sdk/src/types/sdk';
import React, { useState } from 'react';
import { Animated, Text, View, SafeAreaView, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../AuthNav';
import { browserstackTestAccounts } from '../../constants/browserstackTestAccounts';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useAnimatedKeyboard from '../../hooks/useAnimatedKeyboard';
import { useStore } from '../../store';
import { login } from '../../store/signIn/signIn.actions';
import { authorize } from '../../store/wallet/wallet.reducers';
import { getWeb3User } from '../../store/web3/web3.actions';
// import CountryNumber from './CountryNumber';
import styles from './CustomProvidersScreen.styles';
import { Button, Flex, Input } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import providersList from '../../constants/providersList';

const providersListSmall = providersList.filter((item, index) => index < 6);

type Props = NativeStackScreenProps<RootStackParamList, 'CustomProviders'>;

const CustomProvidersScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const auth = useStore(state => state.authorize);
  // const { mobile } = useAppSelector(state => state.signUp);
  // const rawMobile = mobile?.split(/\s+/).join('').replace('+', '');
  const [providers, setProviders] = useState(providersListSmall);
  const isSmall = providers.length === providersListSmall.length;
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const { accountName } = useAppSelector(state => state.signIn);
  // const [phone, setPhone] = useState(rawMobile?.slice(-10) || '');
  // const [countryCode, setCountryCode] = useState(rawMobile?.slice(0, -10) || '1');
  // const [phone, setPhone] = useState('');
  // const [countryCode, setCountryCode] = useState('1');
  const offsetY = useAnimatedKeyboard();

  const toggleProviders = () => {
    setProviders(isSmall ? providersList : providersListSmall);
  };

  const handleChangeEmail = (text: string) => {
    setEmailError(false);
    setEmail(text);
  };

  // const handleChangePhone = (text: string) => {
  //   setPhone(String(parseInt(text, 10) || ''));
  // };

  const loginToAppHandler = () => {
    dispatch(login({ accountName, email }))
      .unwrap()
      .then(loginDetails => {
        console.log('Logged in successfully! loginDetails: ', loginDetails);
        dispatch(authorize({ accountName, email, token: loginDetails.token }));
        auth();
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Something went wrong!',
          text2: 'Try to login again.',
        });
        console.error(error);
      });
  };

  const handleLogin = (loginProvider: string, login = '') => {
    dispatch(
      getWeb3User({
        loginProvider,
        extraLoginOptions: {
          login_hint: login,
          // isVerifierIdCaseSensitive
        },
        mfaLevel: MFA_LEVELS.NONE,
      }),
    )
      .unwrap()
      .then(web3AuthData => {
        if (web3AuthData.privateKey) {
          if (browserstackTestAccounts.includes(accountName)) {
            loginToAppHandler();
          } else {
            navigation.navigate('FaceKI');
          }
        }
      })
      .catch(error => console.error(error));
  };

  const handleLoginWithEmail = () => {
    const isEmailValid = /^(.*@.*).(.*)$/.test(email);
    if (isEmailValid) {
      handleLogin(LOGIN_PROVIDER.EMAIL_PASSWORDLESS, email.toLowerCase());
    } else {
      setEmailError(true);
    }
  };

  return (
    <SafeAreaView style={{}}>
      <ScrollView contentContainerStyle={{}}>
        <Animated.View style={{ ...styles.Container, top: isSmall ? 0 : offsetY }}>
          <View style={styles.Header}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Welcome onboard</Text>
            <Text>Select how you would like to continue</Text>
          </View>

          <Flex
            direction="row"
            marginTop={2}
            marginBottom={2}
            wrap="wrap"
            justifyContent="space-between"
          >
            {providers.map(item => (
              <Button
                key={item}
                startIcon={<Icon name={item} size={30} />}
                size={75}
                m={2}
                bg="#fff"
                onPress={() => handleLogin(item)}
              />
            ))}
          </Flex>

          <Text>or</Text>

          <Flex direction="column" justifyContent="space-between" w="100%">
            <Input
              keyboardType="email-address"
              placeholder="Email"
              autoCapitalize="none"
              autoComplete="email"
              bg="#fff"
              m={2}
              borderColor={emailError ? 'danger.600' : 'muted.200'}
              onChangeText={handleChangeEmail}
              value={email}
            />
            {}
            <Button m={2} bgColor="#000" onPress={handleLoginWithEmail}>
              Continue with Email
            </Button>
          </Flex>

          <Flex direction="column" justifyContent="space-between" w="100%">
            {/*  <Flex direction="row" justifyContent="space-between" m={2}>*/}
            {/*    <CountryNumber setCountryCode={setCountryCode} />*/}
            {/*    <Input*/}
            {/*      keyboardType="numeric"*/}
            {/*      placeholder="Eg: 9009009009"*/}
            {/*      bg="#fff"*/}
            {/*      flexGrow={1}*/}
            {/*      marginLeft={2}*/}
            {/*      onChangeText={handleChangePhone}*/}
            {/*      value={phone}*/}
            {/*      maxLength={10}*/}
            {/*    />*/}
            {/*  </Flex>*/}

            {/*  <Button*/}
            {/*    m={2}*/}
            {/*    bgColor="#000"*/}
            {/*    onPress={() =>*/}
            {/*      handleLogin(LOGIN_PROVIDER.SMS_PASSWORDLESS, `+${countryCode}-${phone}`)*/}
            {/*    }*/}
            {/*  >*/}
            {/*    Continue with Mobile*/}
            {/*  </Button>*/}

            <Button
              onPress={toggleProviders}
              size="sm"
              bg="#fff"
              w="50%"
              m={2}
              alignSelf="center"
              variant="unstyled"
              endIcon={<Icon name={isSmall ? 'chevron-down' : 'chevron-up'} size={10} />}
            >
              {isSmall ? 'View more options' : 'View less options'}
            </Button>
          </Flex>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomProvidersScreen;
