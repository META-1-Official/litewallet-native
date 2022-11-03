import React from 'react';
import { useForm } from 'react-hook-form';
import { SafeAreaView, View, Image, Dimensions, TextInput, Animated, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { personAsset, personIconAsset } from '../../assets';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import useAnimatedKeyboard from '../hooks/useAnimatedKeyboard';
import { useStore } from '../store';
import { loginStep1 } from '../store/signIn/signIn.reducer';
import { getWeb3User } from '../store/web3/web3.actions';
import { tid, useScroll } from '../utils';
import { getAccount } from '../services/meta1Api';
// import meta1dex from '../utils/meta1dexTypes';
import { required, RuleFn } from '../utils/useFormHelper/rules';
import { Input } from '../utils/useFormHelper/useFormHelper';

const { width, height } = Dimensions.get('screen');
const knownAccount: RuleFn = async text => {
  const acc = await getAccount(text).catch(console.debug);
  return !!acc || 'Account not found';
};

// const validatePassword = async (login: string, password: string) => {
//   try {
//     await meta1dex.login(login, password);
//     return true;
//   } catch (e: any) {
//     console.error(e, e.stack);
//     Alert.alert('The pair of login and passkey do not match!');
//     return false;
//   }
// };

const LinkWalletScreen: React.FC = () => {
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      account_name: '',
      password: '',
    },
  });

  const handleLogin = handleSubmit(async formState => {
    // const { account_name, password } = formState;
    // if (await validatePassword(account_name, password)) {
    //   authorize(account_name, password);
    // }
    const { account_name } = formState;
    loginStep1(account_name);
    // @ts-ignore | this hack is required to use form with all providers
    dispatch(getWeb3User({ provider: undefined }));
  });

  const offsetY = useAnimatedKeyboard();
  const scroll = useScroll(true);

  const authorize = useStore(state => state.authorize);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <ScrollView {...scroll} contentContainerStyle={{ paddingBottom: 75 }}>
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
            Type your wallet 'Account Name' in the box below and click the 'Link META Wallet'
            button
          </TextSecondary>
          <Input
            control={control}
            style={{
              paddingHorizontal: 32,
            }}
            rules={{ required, validate: { knownAccount } }}
            name="account_name"
            label="Account Name"
            render={props => (
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
          {/*<Input*/}
          {/*  control={control}*/}
          {/*  rules={{ required }}*/}
          {/*  name="password"*/}
          {/*  label="Passkey"*/}
          {/*  style={{*/}
          {/*    paddingHorizontal: 32,*/}
          {/*  }}*/}
          {/*  render={PasswordInput}*/}
          {/*/>*/}
        </Animated.View>
        <View>
          <RoundedButton title="Submit" onPress={handleLogin} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LinkWalletScreen;
