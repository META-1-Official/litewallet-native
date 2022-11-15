import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TextInputProps, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../AuthNav';
import LoaderPopover from '../../components/LoaderPopover';
import RoundedButton from '../../components/RoundedButton';
import { Heading, TextSecondary } from '../../components/typography';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getAccount } from '../../services/meta1Api';
import migrationService from '../../services/migration.service';
import { getWeb3User } from '../../store/web3/web3.actions';
import { step1Save } from '../../store/signUp/signUp.reducer';
import { lettersOnly, required } from '../../utils/useFormHelper/rules';
//@ts-ignore todo: fix type
import { ChainValidation } from 'meta1-vision-js';
import { useForm } from 'react-hook-form';
import { Input, PhoneInput } from '../../utils/useFormHelper/useFormHelper';

const checkFreeName = async (accountName: string) => {
  const acc = await getAccount(accountName).catch(console.debug);
  return !acc || 'This account name has already taken';
};

const checkPremiumName = (accountName: string) =>
  // todo: fix of issue with validation | uncomment code below to roll it back
  // (ChainValidation.is_cheap_name(accountName) && /(-)/.test(accountName)) ||
  ChainValidation.is_cheap_name(accountName) ||
  'This is a premium name which is not supported by this faucet. Please enter a regular name containing least one dash or a number';

const checkAccountName = (accountName: string) =>
  ChainValidation.is_account_name_error(accountName);

type Props = NativeStackScreenProps<RootStackParamList, 'CreateWallet'>;

const CreateWalletScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { privateKey } = useAppSelector(state => state.web3);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: 'Tom',
      lastName: 'Sawyer',
      mobile: '+11111111111',
      accountName: 'tom-sawyer',
    },
  });

  const [migratable, setMigratable] = useState(false);
  const checkMigrationAvailability = async (accountName: string): Promise<boolean | string> => {
    const { data } = await migrationService.checkTransferableAccount(accountName);
    setMigratable(data?.found);
    return true;
  };

  const handleAccountNameValidation = async (accountName: string) => {
    const premiumName = await checkPremiumName(accountName);
    if (typeof premiumName === 'string') {
      return premiumName;
    }
    const validName = await checkAccountName(accountName);
    if (typeof validName === 'string') {
      return validName;
    }
    const freeName = await checkFreeName(accountName);
    if (typeof freeName === 'string') {
      return freeName;
    }
    const migrationAvailability = await checkMigrationAvailability(accountName);
    if (typeof migrationAvailability === 'string') {
      return migrationAvailability;
    }
    return true;
  };

  const handleSubmitForm = handleSubmit(formState => {
    dispatch(step1Save(formState));
    if (!privateKey) {
      // @ts-ignore | this hack is required to use form with all providers
      dispatch(getWeb3User({ provider: undefined }))
        .unwrap()
        .then(web3AuthData => {
          if (web3AuthData.privateKey) {
            navigation.navigate('FaceKI');
          }
        })
        .catch(error => console.error(error));
    } else {
      navigation.navigate('FaceKI');
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
                  handleAccountNameValidation,
                },
              }}
              render={(props: TextInputProps) => (
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
                  navigation.navigate('ImportWallet');
                })}
                disabled={isSubmitting}
              />
            </>
          )}
        </View>
        <View>
          <RoundedButton
            title="Create wallet"
            onPress={handleSubmitForm}
            disabled={isSubmitting}
          />
        </View>
      </ScrollView>
      <LoaderPopover loading={isSubmitting} />
    </SafeAreaView>
  );
};
export default CreateWalletScreen;
