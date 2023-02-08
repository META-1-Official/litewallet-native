import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LOGIN_PROVIDER } from '@web3auth/react-native-sdk';
import React, { useState } from 'react';
import { Text, View, SafeAreaView, ScrollView } from 'react-native';
import { RootStackParamList } from '../../AuthNav';
import { useAppDispatch } from '../../hooks';
import { getWeb3User } from '../../store/web3/web3.actions';
import CountryNumber from './CountryNumber';
import styles from './CustomProvidersScreen.styles';
import { Button, Flex, Input } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

const providersList = [
  'google',
  'facebook',
  'twitter',
  'discord',
  'line',
  'reddit',
  'apple',
  'github',
  'twitch',
  'linkedin',
  'weibo',
];
const providersListSmall = providersList.filter((item, index) => index < 6);

type Props = NativeStackScreenProps<RootStackParamList, 'CustomProviders'>;

const CustomProvidersScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [providers, setProviders] = useState(providersListSmall);
  const isSmall = providers.length === providersListSmall.length;
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const toggleProviders = () => {
    setProviders(isSmall ? providersList : providersListSmall);
  };

  const handleLogin = (loginProvider: string, login = '') => {
    dispatch(
      getWeb3User({
        loginProvider,
        extraLoginOptions: {
          login_hint: login,
        },
      }),
    )
      .unwrap()
      .then(web3AuthData => {
        if (web3AuthData.privateKey) {
          navigation.navigate('FaceKI');
        }
      })
      .catch(error => console.error(error));
  };

  return (
    <SafeAreaView style={{}}>
      <ScrollView contentContainerStyle={{}}>
        <View style={styles.Container}>
          <View style={styles.Header}>
            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Welcome onboard</Text>
            <Text>Select how you would like to continue</Text>
          </View>

          <Flex direction="row" wrap="wrap" marginTop={2} marginBottom={2}>
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
              placeholder="Email"
              bg="#fff"
              m={2}
              onChange={e => setEmail(e.nativeEvent.text)}
              value={email}
            />
            <Button
              m={2}
              bgColor="#000"
              onPress={() => handleLogin(LOGIN_PROVIDER.EMAIL_PASSWORDLESS, email)}
            >
              Continue with Email
            </Button>
          </Flex>

          <Flex direction="column" justifyContent="space-between" w="100%">
            <Flex direction="row" justifyContent="space-between" m={2}>
              <CountryNumber />
              <Input
                placeholder="Eg: 9009009009"
                bg="#fff"
                flexGrow={1}
                marginLeft={2}
                onChange={e => setPhone(e.nativeEvent.text)}
                value={phone}
              />
            </Flex>

            <Button
              m={2}
              bgColor="#000"
              onPress={() => handleLogin(LOGIN_PROVIDER.SMS_PASSWORDLESS, phone)}
            >
              Continue with Mobile
            </Button>

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomProvidersScreen;
