import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../AuthNav';
import LoaderPopover from '../../components/LoaderPopover';
import RoundedButton from '../../components/RoundedButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { eSignatureUpdateWalletName } from '../../store/eSignature/eSignature.actions';
import {
  eSignatureProceed,
  getAccountPaymentStatus,
  registerAccount,
} from '../../store/signUp/signUp.actions';

import { SvgIcons } from '../../../assets';
import styles from './PasskeyScreen.styles';
import Toast from 'react-native-toast-message';

const E_SIGNATURE_STATUSES = ['dismiss', 'success'];

type Props = NativeStackScreenProps<RootStackParamList, 'Passkey'>;

export const PasskeyScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const {
    firstName,
    lastName,
    mobile,
    accountName,
    eSignatureStatus,
    eSignaturePending,
    pending,
  } = useAppSelector(state => state.signUp);
  const { email, passKey, privateKey } = useAppSelector(state => state.web3);

  const [isCopied, setIsCopied] = useState(false);
  const [checkboxesState, setCheckBoxesState] = useState([false, false, false, false, false]);
  const [emailSubscription, setEmailSubscription] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(getAccountPaymentStatus(email))
      .unwrap()
      .then(user => {
        if (user && user.status?.isSign) {
          if (user.status?.isPayed || user.status?.isPaidByCrypto) {
            handleCheckBox(4, true);
          }
        }
      });
  }, []);

  const handleEmailSubscription = () => {
    setEmailSubscription(prevState => !prevState);
  };

  const handleRegistrationIssue = (message: string) => {
    // dispatch(clearESignature());
    console.error(message);
    Toast.show({
      type: 'error',
      text1: message,
    });
  };

  const getPaymentDetails = () => {
    dispatch(getAccountPaymentStatus(email))
      .unwrap()
      .then(user => {
        console.log('User: ', user);
        if (user && user.status?.isSign) {
          if (user.status?.isPayed || user.status?.isPaidByCrypto) {
            handleCheckBox(4, true);
            console.log('Payments: ', user.pays);
          } else {
            handleRegistrationIssue('Please pay 1$ for wallet');
          }
        } else {
          handleRegistrationIssue('Please sign the document');
        }
      });
  };

  const handleSign = () => {
    if (!checkboxesState[4]) {
      dispatch(eSignatureProceed({ firstName, lastName, mobile, email, accountName, privateKey }))
        .unwrap()
        .then(promiseResult => {
          if (Platform.OS === 'ios') {
            console.log('Handle Sign PromiseResult: ', promiseResult);
            getPaymentDetails();
          }
        });
    }
  };

  const handleNext = () => {
    if (isCopied) {
      setIsLoading(true);
      console.log('Wallet registration!');
      dispatch(
        registerAccount({
          accountName,
          passKey,
          mobile,
          email,
          firstName,
          lastName,
          emailSubscription,
        }),
      )
        .unwrap()
        .then(registrationStatus => {
          console.log('RegistrationStatus:', registrationStatus);
          if (registrationStatus) {
            dispatch(eSignatureUpdateWalletName({ email, accountName }));

            console.log('Wallet has been registered!', registrationStatus);
            navigation.navigate('PaymentSuccess');
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error);
          handleRegistrationIssue("Wallet hasn't been created!");
          setIsLoading(false);
        });
    } else {
      Toast.show({
        type: 'info',
        text1: 'Please copy your passkey to continue!',
      });
    }
  };

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // todo: fix type of appState
  const handleAppStateChange = (nextAppState: any) => {
    console.log('AppState change action');
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!', appState.current);
    }
    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log('AppState current: ', appState.current);
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    console.log('Subscription on appState change');
    return () => {
      console.log('Subscription on appState change removed');
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    console.log('AppState visibility:', appStateVisible);
    console.log('ESignatureStatus: ', eSignatureStatus);
    console.log('ESignaturePending: ', eSignaturePending);
    if (
      Platform.OS === 'android' &&
      appStateVisible === 'active' &&
      E_SIGNATURE_STATUSES.includes(eSignatureStatus) &&
      !eSignaturePending
    ) {
      console.log('Action onVisible');
      getPaymentDetails();
    }
  }, [appStateVisible, eSignaturePending, eSignatureStatus]);

  const handleCheckBox = (id: number, value: boolean = false) => {
    setCheckBoxesState(prevState => {
      const newState = [...prevState];
      newState[id] = value || !newState[id];
      return newState;
    });
  };

  const handleCopy = () => {
    Clipboard.setString(passKey);
    setIsCopied(true);
    Toast.show({
      type: 'info',
      text1: 'Passkey has copied',
    });
  };

  const isEveryCheckBoxesValid = useMemo(() => {
    return (
      checkboxesState[0] &&
      checkboxesState[1] &&
      checkboxesState[2] &&
      checkboxesState[3] &&
      checkboxesState[4]
    );
  }, [checkboxesState]);

  const openUrl = () => {
    const url = 'https://support.meta1coin.vision/password-storage-tips';
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.header}>
          <Text style={styles.title}>Save Passkey</Text>
          <Text style={styles.subtitle}>
            Please keep your Passkey in a safe place. Don't share it with any third-parties or send
            it online.
          </Text>

          <View style={styles.inputWrapper}>
            <TextInput style={styles.input} value={passKey} onFocus={handleCopy} />
            <Pressable style={styles.btnCopy} onPress={handleCopy}>
              <SvgIcons.Copy width={20} />
            </Pressable>
          </View>
        </View>

        <View style={styles.importantInfo}>
          <View>
            <Text style={styles.importantInfoTitle}>Important information</Text>
            <Text style={styles.importantInfoDescription}>
              If you forget your passkey you will NOT be able to access your wallet or your funds.
              We are NO LONGER able to restore, reset, or redistribute lost coins, or help with
              lost passkeys. Please MAKE SURE you copy your wallet name and passkey on to your
              computer and then transfer it to an offline storage location for easy access like a
              USB drive! Check our passkey storage tips knowledge article for more info{' '}
              <Text style={{ color: 'blue' }} onPress={openUrl}>
                here
              </Text>
              .
            </Text>
          </View>
        </View>

        <View style={styles.checkboxGroup}>
          <View style={styles.checkboxRow}>
            <CheckBox
              boxType="square"
              value={checkboxesState[0]}
              onValueChange={() => handleCheckBox(0)}
            />
            <Text style={styles.checkboxText}>
              I understand that I will lose access to my funds if I lose my passkey
            </Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              boxType="square"
              value={checkboxesState[1]}
              onValueChange={() => handleCheckBox(1)}
            />
            <Text style={styles.checkboxText}>
              I understand that no one can recover my passkey if I lose or forget it
            </Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              boxType="square"
              value={checkboxesState[2]}
              onValueChange={() => handleCheckBox(2)}
            />
            <Text style={styles.checkboxText}>I have copied and stored my passkey</Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              boxType="square"
              value={checkboxesState[3]}
              onValueChange={() => handleCheckBox(3)}
            />
            <Text style={styles.checkboxText}>
              I am a living man or woman hence a living being
            </Text>
          </View>
          <View style={[styles.checkboxRow, { justifyContent: 'space-between' }]}>
            {pending && <ActivityIndicator />}
            {!pending && (
              <CheckBox
                boxType="square"
                value={checkboxesState[4]}
                onValueChange={handleSign}
                disabled={pending || checkboxesState[4]}
              />
            )}
            <Text style={styles.checkboxText}>Sign META Association Membership Agreement</Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              boxType="square"
              value={emailSubscription}
              onValueChange={handleEmailSubscription}
            />
            <Text style={styles.checkboxText}>
              I consent to receive emails about member events, platform news and other information
              from META Membership Association
            </Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <RoundedButton
            title="Next"
            disabled={isLoading || !isEveryCheckBoxesValid || eSignaturePending}
            onPress={handleNext}
            pending={eSignaturePending}
          />
        </View>
        <LoaderPopover loading={isLoading} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasskeyScreen;
