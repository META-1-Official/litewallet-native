import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { SvgIcons } from '../../../assets';
import { RootStackParamList } from '../../AuthNav';
import LoaderPopover from '../../components/LoaderPopover';
import RoundedButton from '../../components/RoundedButton';
import { useAppSelector } from '../../hooks';
import { useStore } from '../../store';
import { catchError } from '../../utils';
import { KeysT, savePdf } from '../CreatePaperWallet';
import RenderPdf from '../CreatePaperWallet/RenderPdf';
import styles from './PaymentSuccess.styles';
import { getAccountKeys } from '../CreatePaperWallet/CreatePaperWallet';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

export const PaymentSuccess = ({}: Props) => {
  const authorize = useStore(state => state.authorize);
  const { accountName } = useAppSelector(state => state.signUp);
  const { passKey } = useAppSelector(state => state.web3);

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
  const [document, setDoc] = useState('');

  useEffect(() => {
    if (document) {
      savePdf(document);
    }
  }, [document]);

  const save = async () => {
    catchError(async () => {
      const _keys = await getAccountKeys({ accountName, password: passKey });
      setKeys(_keys);
      if (document) {
        savePdf(document);
        return;
      }
      setIsLoading(true);
    });
  };

  const handleDownloadPaperWallet = async () => {
    await save();
  };

  const handleCreateWallet = () => {
    authorize(accountName, passKey);
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
              lost passkeys. Please MAKE SURE you copy your wallet name and passkey.
            </Text>
          </View>
        </View>
      </View>

      <RenderPdf
        keys={keys}
        onReady={d => {
          setDoc(d);
          setIsLoading(false);
        }}
      />

      <View style={styles.buttonGroup}>
        <RoundedButton
          styles={{ flex: 1 }}
          title="Download paper wallet"
          onPress={handleDownloadPaperWallet}
        />
        <RoundedButton styles={{ flex: 1 }} title="Submit" onPress={handleCreateWallet} />
      </View>
      <LoaderPopover loading={isLoading} />
    </SafeAreaView>
  );
};

export default PaymentSuccess;
