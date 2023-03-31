import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  SafeAreaView,
  View,
  Image,
  Dimensions,
  TextInput,
  Animated,
  TextInputProps,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { personAsset, personIconAsset } from '../../assets';
import { RootStackParamList } from '../AuthNav';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import config from '../config';
import { browserstackTestAccounts } from '../constants/browserstackTestAccounts';
import { useAppDispatch } from '../hooks';
import useAnimatedKeyboard from '../hooks/useAnimatedKeyboard';
import { useStore } from '../store';
import { login } from '../store/signIn/signIn.actions';
import { loginStep1 } from '../store/signIn/signIn.reducer';
import { authorize } from '../store/wallet/wallet.reducers';
import { tid, useScroll } from '../utils';
import { getAccount } from '../services/meta1Api';
import { required, RuleFn } from '../utils/useFormHelper/rules';
import { Input } from '../utils/useFormHelper/useFormHelper';

const { width, height } = Dimensions.get('screen');
const knownAccount: RuleFn = async text => {
  const acc = await getAccount(text).catch(console.debug);
  return !!acc || 'Wallet not found';
};

type Props = NativeStackScreenProps<RootStackParamList, 'LinkWallet'>;

const LinkWalletScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const auth = useStore(state => state.authorize);
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      account_name: '',
      password: '',
    },
  });

  const browserStackAccountsLogin = (accountName: string) => {
    dispatch(login({ accountName, email: `${accountName}@yopmail.com` }))
      .unwrap()
      .then(loginDetails => {
        console.log('Logged in successfully! loginDetails: ', loginDetails);
        dispatch(authorize({ accountName, email: `${accountName}@yopmail.com`, token: '' }));
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

  const handleLogin = handleSubmit(formState => {
    const { account_name } = formState;

    // Check account name on including to browserstackTestAccounts for simple login
    if (config.APP_KEY_PREFIX !== 'META1') {
      if (browserstackTestAccounts.includes(account_name)) {
        browserStackAccountsLogin(account_name);
        return false;
      }
    }

    dispatch(loginStep1(account_name));
    navigation.navigate('CustomProviders');
  });

  const offsetY = useAnimatedKeyboard();
  const scroll = useScroll(true);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <ScrollView
        {...scroll}
        contentContainerStyle={{
          paddingBottom: 75,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '110%',
        }}
      >
        <Animated.View style={{ marginHorizontal: 24, top: offsetY }}>
          <Image
            source={personAsset}
            style={{
              width: width - 48,
              height: height / 3,
              resizeMode: 'contain',
              marginBottom: 50,
            }}
          />
          <Heading style={{ marginBottom: 8 }}>META Lite Wallet</Heading>
          <TextSecondary style={{ marginBottom: 18, fontSize: 15 }}>
            Enter your wallet name in the box below and click "Link META Wallet"
          </TextSecondary>
          <Input
            control={control}
            style={{
              paddingHorizontal: 32,
            }}
            rules={{ required, validate: { knownAccount } }}
            name="account_name"
            label="Link META Wallet"
            render={(props: TextInputProps) => (
              <View key={123} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={personIconAsset}
                  style={{
                    width: 24,
                    height: 32,
                    resizeMode: 'contain',
                  }}
                />
                <TextInput
                  {...props}
                  {...tid('LinkWallet/AccountName')}
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  keyboardType={'email-address'}
                  style={[props.style, { paddingLeft: 8 }]}
                />
              </View>
            )}
          />
        </Animated.View>
        <View>
          <RoundedButton title="Submit" onPress={handleLogin} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LinkWalletScreen;
