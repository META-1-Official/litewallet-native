import React, { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  SafeAreaView,
  View,
  Image,
  Dimensions,
  TextInput,
  Animated,
  Keyboard,
  Alert,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';
import { Eye, EyeOff, Key } from 'react-native-feather';
import { ScrollView } from 'react-native-gesture-handler';
import { RenderProps } from 'react-native-paper/src/components/TextInput/types';
import { personAsset, personIconAsset } from '../../assets';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { tid, useScroll } from '../utils';
import { getAccount } from '../services/meta1Api';
import meta1dex from '../utils/meta1dexTypes';
import { required, RuleFn } from '../constants/formRules';
import Input from '../components/Input/Input';

const { width, height } = Dimensions.get('screen');

const validatePassword = async (login: string, password: string) => {
  try {
    await meta1dex.login(login, password);
    return true;
  } catch (e: any) {
    console.error(e, e.stack);
    Alert.alert('The pair of login and password do not match!');
    return false;
  }
};
const LinkWalletScreen: React.FC = () => {
  const { control, handleSubmit, setError } = useForm({
    mode: 'onChange',
    defaultValues: {
      account_name: '',
      password: '',
    },
  });

  let accountNameInputValue = '';

  const knownAccount: RuleFn = async text => {
    const acc = await getAccount(text).catch(console.debug);
    if (accountNameInputValue) {
      return !!acc || 'Account not found';
    } else {
      setTimeout(
        () => setError('account_name', { type: 'required', message: 'This field is required' }),
        1,
      );
      return true;
    }
  };

  const offsetY = useRef(new Animated.Value(0)).current;
  const scroll = useScroll(true);
  useEffect(() => {
    console.log('re-render');
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      Animated.timing(offsetY, {
        toValue: -300,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(offsetY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  });

  const setAccountNameInputValue = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    accountNameInputValue = e.nativeEvent.text;
  };

  const authorzie = useStore(state => state.authorize);
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
            onChange={e => setAccountNameInputValue(e)}
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
          <Input
            control={control}
            rules={{ required }}
            name="password"
            label="Password"
            style={{
              paddingHorizontal: 32,
            }}
            render={PasswordInput}
          />
        </Animated.View>
        <View>
          <RoundedButton
            title="Submit"
            onPress={handleSubmit(async formState => {
              const { account_name, password } = formState;
              if (await validatePassword(account_name, password)) {
                authorzie(account_name, password);
              }
            })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function PasswordInput(props: RenderProps) {
  const [visible, setVisible] = useState(true);
  return (
    <View key={123} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Key width={24} height={32} color="#333" strokeWidth={1.5} />
      <TextInput
        {...props}
        {...tid('CreateWallet/password')}
        autoCapitalize={'none'}
        autoCorrect={false}
        style={[props.style, { maxWidth: '88%', paddingRight: 8, paddingLeft: 8 }]}
        secureTextEntry={visible}
      />
      <TouchableOpacity {...tid('CreateWallet/copyPassword')} onPress={() => setVisible(!visible)}>
        <View
          style={{
            backgroundColor: colors.BrandYellow,
            marginTop: 14,
            padding: 6,
            borderRadius: 5,
          }}
        >
          {visible ? (
            <EyeOff width={20} height={20} color="#000" />
          ) : (
            <Eye width={20} height={20} color="#000" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default LinkWalletScreen;
