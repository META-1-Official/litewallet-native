import React from 'react';
import { useForm } from 'react-hook-form';
import { SafeAreaView, View, Image, Dimensions, TextInput, Animated, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { personAsset, personIconAsset } from '../../../assets';
import RoundedButton from '../../components/RoundedButton';
import { Heading, TextSecondary } from '../../components/typography';
import useAnimatedKeyboard from '../../hooks/useAnimatedKeyboard';
import migrationService from '../../services/migration.service';
import { tid, useScroll } from '../../utils';
import { getAccount } from '../../services/meta1Api';
import { required, RuleFn } from '../../utils/useFormHelper/rules';
import { Input } from '../../utils/useFormHelper/useFormHelper';
import PasswordInput from '../../components/PasswordInput';

const { width, height } = Dimensions.get('screen');
const knownAccount: RuleFn = async text => {
  const acc = await getAccount(text).catch(console.debug);
  return !!acc || 'Account not found';
};

const ImportWalletScreen: React.FC = () => {
  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      accountName: '',
      password: '',
    },
  });

  const offsetY = useAnimatedKeyboard();
  const scroll = useScroll(true);

  const importWallet = handleSubmit(async formState => {
    const { accountName, password } = formState;
    const response = await migrationService.validateSignature(accountName, password);
    if (response?.isValid) {
    } else {
      Alert.alert('Private Key is invalid!');
    }
  });

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
          <Heading style={{ marginBottom: 8 }}>Import META Wallet</Heading>
          <TextSecondary style={{ marginBottom: 18, fontSize: 15 }}>
            To import your wallet please enter your Meta Wallet name and your private passkey in
            the inputs below
          </TextSecondary>
          <Input
            control={control}
            style={{
              paddingHorizontal: 32,
            }}
            rules={{ required, validate: { knownAccount } }}
            name="accountName"
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
            label="Passkey"
            style={{
              paddingHorizontal: 32,
            }}
            render={PasswordInput}
          />
        </Animated.View>
        <View>
          <RoundedButton title="Import" onPress={importWallet} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImportWalletScreen;
