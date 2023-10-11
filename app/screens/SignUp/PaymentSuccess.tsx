import Clipboard from '@react-native-clipboard/clipboard';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { BackHandler, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { SvgIcons } from '../../../assets';
import { RootStackParamList } from '../../AuthNav';
import LoaderPopover from '../../components/LoaderPopover';
import RoundedButton from '../../components/RoundedButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useStore } from '../../store';
import { login } from '../../store/signIn/signIn.actions';
import { authorize } from '../../store/wallet/wallet.reducers';
import { catchError } from '../../utils';
import { KeysT, savePdf } from '../CreatePaperWallet';
import RenderPdf from '../CreatePaperWallet/RenderPdf';
import styles from './PaymentSuccess.styles';
import { getAccountKeys } from '../CreatePaperWallet/CreatePaperWallet';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

export const PaymentSuccess = ({}: Props) => {
  const dispatch = useAppDispatch();
  const auth = useStore(state => state.authorize);
  const { accountName } = useAppSelector(state => state.signUp);
  const { token: fasToken } = useAppSelector(state => state.faceKI);
  const { passKey, email, idToken, appPubKey } = useAppSelector(state => state.web3);

  const [isLoading, setIsLoading] = useState(false);

  const [, setIsCopied] = useState(false);
  const handleCopy = () => {
    Clipboard.setString(passKey);
    setIsCopied(true);
    Toast.show({
      type: 'info',
      text1: 'Passkey has copied',
    });
  };

  const [keys, setKeys] = useState<KeysT | undefined>(undefined);
  const [document, setDocument] = useState('');
  const [readyToLogin, setReadToLogin] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return false;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useEffect(() => {
    if (document) {
      savePdf(document).then(() => {
        console.log('PDF saved from effect');
        setIsLoading(false);
      });
    }
  }, [document]);

  const handleDocumentReady = (doc: any) => {
    setDocument(doc);
  };

  const save = async () => {
    await catchError(async () => {
      const _keys = await getAccountKeys({ accountName, password: passKey });
      setKeys(_keys);
      if (document) {
        savePdf(document).then(() => {
          console.log('PDF saved from save function');
          setIsLoading(false);
        });
      }
    });
  };

  const handleDownloadPaperWallet = () => {
    setIsLoading(true);
    save().then(() => {
      setReadToLogin(true);
    });
  };

  const handleCreateWallet = () => {
    dispatch(login({ accountName, email, idToken, appPubKey, fasToken }))
      .unwrap()
      .then(loginDetails => {
        dispatch(authorize({ accountName, email, token: loginDetails.token }));
        auth();
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtitle}>You are now a META 1 Member! Click Submit to Continue</Text>
      </View>

      <View style={styles.passKeyForm}>
        <View style={styles.inputWrapper}>
          <TextInput style={styles.input} value={passKey} onFocus={handleCopy} />
          <Pressable style={styles.btnCopy} onPress={handleCopy}>
            <SvgIcons.Copy width={20} />
          </Pressable>
        </View>

        <View style={styles.importantInfo}>
          <View>
            <Text style={styles.importantInfoTitle}>Important information</Text>
            <Text style={styles.importantInfoDescription}>
              If you forget your passkey you will NOT be able to access your wallet or your funds.
              We are NO LONGER able to restore, reset, or redistribute lost coins, or help with
              lost passkeys. Please MAKE SURE you copy your wallet name and passkey on to your
              computer and then transfer it to an offline storage location for easy access like a
              USB drive! Check our passkey storage tips knowledge article for more info.
            </Text>
          </View>
        </View>
      </View>

      <RenderPdf keys={keys} onReady={handleDocumentReady} />

      <View style={styles.buttonGroup}>
        <RoundedButton
          styles={{ flex: 1 }}
          title="Download paper wallet"
          disabled={isLoading}
          onPress={handleDownloadPaperWallet}
        />
        <RoundedButton
          styles={{ flex: 1 }}
          title="Submit"
          onPress={handleCreateWallet}
          disabled={!readyToLogin}
        />
      </View>
      <LoaderPopover loading={isLoading} />
    </SafeAreaView>
  );
};

export default PaymentSuccess;
