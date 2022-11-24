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
import { personAsset, personIconAsset } from '../../assets';
import { RootStackParamList } from '../AuthNav';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import { useAppDispatch } from '../hooks';
import useAnimatedKeyboard from '../hooks/useAnimatedKeyboard';
import { loginStep1 } from '../store/signIn/signIn.reducer';
import { getWeb3User } from '../store/web3/web3.actions';
import { tid, useScroll } from '../utils';
import { getAccount } from '../services/meta1Api';
import { required, RuleFn } from '../utils/useFormHelper/rules';
import { Input } from '../utils/useFormHelper/useFormHelper';

const { width, height } = Dimensions.get('screen');
const knownAccount: RuleFn = async text => {
  const acc = await getAccount(text).catch(console.debug);
  return !!acc || 'Account not found';
};

type Props = NativeStackScreenProps<RootStackParamList, 'LinkWallet'>;

const LinkWalletScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      account_name: '',
      password: '',
    },
  });

  const handleLogin = handleSubmit(formState => {
    const { account_name } = formState;
    dispatch(loginStep1(account_name));
    // @ts-ignore | this hack is required to use form with all providers
    dispatch(getWeb3User({ provider: undefined }))
      .unwrap()
      .then(web3AuthData => {
        if (web3AuthData.privateKey) {
          navigation.navigate('FaceKI');
        }
      })
      .catch(error => console.error(error));
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
            Type your wallet 'Wallet Name' in the box below and click the 'Link META Wallet' button
          </TextSecondary>
          <Input
            control={control}
            style={{
              paddingHorizontal: 32,
            }}
            rules={{ required, validate: { knownAccount } }}
            name="account_name"
            label="Wallet Name"
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
