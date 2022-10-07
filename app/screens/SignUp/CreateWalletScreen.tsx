import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import RoundedButton from '../../components/RoundedButton';
import { Heading, TextSecondary } from '../../components/typography';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getAccount } from '../../services/meta1Api';
import migrationService from '../../services/migration.service';
import { getWeb3User } from '../../store/signUp/signUp.actions';
import { step1Save } from '../../store/signUp/signUp.reducer';
import { lettersOnly, required } from '../../utils/useFormHelper/rules';
//@ts-ignore
import { ChainValidation } from 'meta1-vision-js';
import { useForm } from 'react-hook-form';
import { RootNavigationProp } from '../../AuthNav';
import { Input, PhoneInput } from '../../utils/useFormHelper/useFormHelper';

const freeName = async (accountName: string) => {
  const acc = await getAccount(accountName).catch(console.debug);
  return !acc || 'This account name has already taken';
};

const premiumName = (accountName: string) =>
  ChainValidation.is_cheap_name(accountName) ||
  'This is a premium name which is not supported by this faucet. Please enter a regular name containing least one dash or a number';

const chainValidate = (accountName: string) => ChainValidation.is_account_name_error(accountName);

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

  const [migratable, setMigratable] = useState(false);
  const checkMigrationAvailability = async (accountName: string) => {
    const { data } = await migrationService.checkTransferableAccount(accountName);
    console.log(data, accountName);
    setMigratable(data?.found);
    return true;
  };

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
                  checkMigrationAvailability,
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
          {migratable && (
            <>
              <Text style={{ marginBottom: 8 }}>
                We found account with the same name in our old blockchain. Do you want to import
                it?
              </Text>
              <RoundedButton
                title="Import wallet"
                onPress={handleSubmit(formState => {
                  dispatch(step1Save(formState));
                  nav.navigate('ImportWallet');
                })}
              />
            </>
          )}
        </View>
        <View>
          <RoundedButton
            title="Create wallet"
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
