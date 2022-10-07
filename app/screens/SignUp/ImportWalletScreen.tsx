import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SafeAreaView, View, Image, Dimensions, Animated, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { personAsset } from '../../../assets';
import { RootNavigationProp } from '../../AuthNav';
import RoundedButton from '../../components/RoundedButton';
import { Heading, TextSecondary } from '../../components/typography';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useAnimatedKeyboard from '../../hooks/useAnimatedKeyboard';
import migrationService from '../../services/migration.service';
import { getWeb3User } from '../../store/signUp/signUp.actions';
import { step1Save } from '../../store/signUp/signUp.reducer';
import { useScroll } from '../../utils';
import { required } from '../../utils/useFormHelper/rules';
import { Input } from '../../utils/useFormHelper/useFormHelper';
import PasswordInput from '../../components/PasswordInput';

const { width, height } = Dimensions.get('screen');

const ImportWalletScreen: React.FC = () => {
  const nav = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const { accountName, mobile, firstName, lastName, privateKey } = useAppSelector(
    state => state.signUp,
  );

  useEffect(() => {
    if (privateKey) {
      nav.navigate('FaceKI');
    }
  }, [privateKey]);

  const { control, handleSubmit } = useForm({
    mode: 'onChange',
    defaultValues: {
      accountName: '',
      password: '',
    },
  });

  const offsetY = useAnimatedKeyboard();
  const scroll = useScroll(true);

  const handleImportWallet = handleSubmit(async formState => {
    const { password } = formState;
    const response = await migrationService.validateSignature(accountName, password);
    if (response?.isValid) {
      const {
        data: {
          snapshot: { transfer_status: transferStatus },
        },
      } = await migrationService.checkMigrationStatus(accountName);
      console.log('transferStatus: ', transferStatus);
      if (['PENDING', 'PARTIALLY_DONE'].includes(transferStatus)) {
        // todo: save migration
        dispatch(
          step1Save({ accountName, mobile, firstName, lastName, isMigration: true, password }),
        );
        // @ts-ignore | this hack is required to use form with all providers
        dispatch(getWeb3User({ provider: undefined }));
      } else {
        Alert.alert('This account is not able to be migrated');
      }
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
            To import your wallet please enter your Meta Wallet private passkey in the input below
          </TextSecondary>
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
          <RoundedButton title="Import" onPress={handleImportWallet} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ImportWalletScreen;