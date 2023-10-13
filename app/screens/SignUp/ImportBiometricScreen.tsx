import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { SafeAreaView, View, Image, Dimensions, Animated } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { personAsset } from '../../../assets';
import { RootStackParamList } from '../../AuthNav';
import LoaderPopover from '../../components/LoaderPopover';
import RoundedButton from '../../components/RoundedButton';
import { Heading, TextSecondary } from '../../components/typography';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useAnimatedKeyboard from '../../hooks/useAnimatedKeyboard';
import { TASK } from '../../services/litewallet.services';
import { getFASToken } from '../../store/faceKI/faceKI.actions';
import { useScroll } from '../../utils';
import buildSignature4Fas from '../../utils/buildSignature4Fas';
import { required } from '../../utils/useFormHelper/rules';
import { Input } from '../../utils/useFormHelper/useFormHelper';
import PasswordInput from '../../components/PasswordInput';

const { width, height } = Dimensions.get('screen');

type Props = NativeStackScreenProps<RootStackParamList, 'ImportBiometric'>;

const ImportBiometricScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { accountName: signUpAccountName } = useAppSelector(state => state.signUp);
  const { accountName: signInAccountName } = useAppSelector(state => state.signIn);
  const isSigning = !!signInAccountName;
  const account = signInAccountName || signUpAccountName;
  const { email } = useAppSelector(state => state.web3);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      accountName: account,
      password: '',
    },
  });

  const offsetY = useAnimatedKeyboard();
  const scroll = useScroll(true);

  const handleImportWallet = handleSubmit(async formState => {
    const { password, accountName } = formState;
    const { publicKey, signature, signatureContent } = await buildSignature4Fas(
      accountName,
      password,
      email,
    );

    console.log('Build Signature For FAS', publicKey, signature, signatureContent);

    if (!publicKey || !signature) {
      Toast.show({ type: 'error', text1: 'Passkey is not valid!' });
      return;
    }

    dispatch(
      getFASToken({
        email,
        task: TASK.REGISTER,
        publicKey,
        signature,
        signatureContent,
      }),
    )
      .unwrap()
      .then(({ token }) => {
        if (token) {
          navigation.navigate('FaceKI', { upgradeBiometric: true });
        } else {
          Toast.show({ type: 'error', text1: 'Passkey is not valid!' });
        }
      })
      .catch(() => {
        Toast.show({ type: 'error', text1: 'Passkey is not valid!' });
      });
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
          <Heading style={{ marginBottom: 8 }}>Upgrade Biometric</Heading>
          <TextSecondary style={{ marginBottom: 18, fontSize: 15 }}>
            To complete the one time biometrics upgrade, please enter your passkey to migrate your
            2 Factor Biometric Authentication.
          </TextSecondary>
          <Input
            control={control}
            rules={{ required }}
            name="accountName"
            label="Existing wallet name"
            style={{
              display: isSigning ? 'none' : 'flex',
              paddingHorizontal: 32,
            }}
          />
          <Input
            control={control}
            rules={{ required }}
            name="password"
            label="Passkey or owner private key"
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
      <LoaderPopover loading={isSubmitting} />
    </SafeAreaView>
  );
};

export default ImportBiometricScreen;
