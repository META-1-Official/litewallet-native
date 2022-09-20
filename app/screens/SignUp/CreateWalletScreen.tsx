import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { SafeAreaView, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import RoundedButton from '../../components/RoundedButton';
import { Heading, TextSecondary } from '../../components/typography';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getAccount } from '../../services/meta1Api';
import { getWeb3User } from '../../store/signUp/signUp.actions';
import { step1Save } from '../../store/signUp/signUp.reducer';
import { lettersOnly, required } from '../../utils/useFormHelper/rules';
//@ts-ignore
import { ChainValidation } from 'meta1-vision-js';
import { useForm } from 'react-hook-form';
import { RootNavigationProp } from '../../App';
import { Input, PhoneInput } from '../../utils/useFormHelper/useFormHelper';

const freeName = async (text: string) => {
  const acc = await getAccount(text).catch(console.debug);
  return !acc || 'This account name is already taken';
};

const premiumName = (t: string) =>
  ChainValidation.is_cheap_name(t) ||
  'This is a premium name which is not supported by this faucet. Please enter a regular name containing least one dash or a number';

const chainValidate = (t: string) => ChainValidation.is_account_name_error(t);

const CreateWalletScreen: React.FC = () => {
  const nav = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const { privateKey } = useAppSelector(state => state.signUp);

  useEffect(() => {
    if (privateKey) {
      nav.navigate('FaceKI');
    }
  }, [privateKey]);

  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      mobile: '',
      accountName: '',
    },
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ marginHorizontal: 24 }}>
          <Heading style={{ marginBottom: 8 }}>Create META Wallet</Heading>
          <TextSecondary style={{ marginBottom: 18 }}>
            Provide access to your META Lite Wallet
          </TextSecondary>

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
            <PhoneInput control={control} name="mobile" />
            <Input
              control={control}
              name="accountName"
              label="Wallet Name"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              rules={{
                required,
                validate: {
                  premiumName,
                  chainValidate,
                  freeName,
                },
              }}
              render={props => (
                <TextInput {...props} onChangeText={t => props.onChangeText?.(t.toLowerCase())} />
              )}
            />
          </View>
        </View>
        <View>
          <RoundedButton
            title="Submit"
            onPress={handleSubmit(formState => {
              dispatch(step1Save(formState));
              // @ts-ignore | this hack is required to use form with all providers
              dispatch(getWeb3User({ provider: undefined }));
            })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default CreateWalletScreen;
