import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Dimensions,
  TextInput,
  Animated,
  Keyboard,
} from 'react-native';
import { personAsset, personIconAsset } from '../../assets';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';
import { useStore } from '../store';
import { tid } from '../utils';
import { getAccount } from '../utils/meta1Api';
import useForm from '../utils/useForm';
import { asyncRule, required, RuleFn } from '../utils/useForm/rules';

const { width, height } = Dimensions.get('screen');

const LinkWalletScreen: React.FC = () => {
  const knownAccount: RuleFn = text =>
    asyncRule(async () => {
      const acc = await getAccount(text).catch(console.debug);
      return Boolean(acc);
    }, 'Account not found');
  const { Input, formState, valid } = useForm([
    { name: 'account_name', lable: 'Account Name', rules: [required, knownAccount] },
  ]);
  const offsetY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, []);

  const authorzie = useStore(state => state.authorize);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
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
          Type your wallet 'Account Name' in the box below and click the 'Link META Wallet' button
        </TextSecondary>
        <Input
          style={{
            paddingHorizontal: 32,
          }}
          name="account_name"
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
      </Animated.View>
      <View>
        <RoundedButton
          title="Submit"
          onPress={() => {
            if (valid()) {
              authorzie(formState.account_name);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default LinkWalletScreen;
