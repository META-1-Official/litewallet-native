import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Platform, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import { RootStackParamList } from '../../AuthNav';
import RoundedButton from '../../components/RoundedButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { eSignatureProceed } from '../../store/signUp/signUp.actions';

import { SvgIcons } from '../../../assets';
import styles from './PasskeyScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'Passkey'>;

export const PasskeyScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const { firstName, lastName, mobile, accountName, eSignatureStatus, eSignaturePending } =
    useAppSelector(state => state.signUp);
  const { email, passKey, privateKey } = useAppSelector(state => state.web3);

  const [checkboxesState, setCheckBoxesState] = useState([false, false, false, false, false]);

  const handleNext = () => {
    dispatch(eSignatureProceed({ firstName, lastName, mobile, email, accountName, privateKey }))
      .unwrap()
      .then(promiseResult => {
        if (Platform.OS === 'ios') {
          console.log('PromiseResult: ', promiseResult);
          navigation.navigate('PaymentSuccess');
        }
      });
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
      eSignatureStatus === 'dismiss' &&
      !eSignaturePending
    ) {
      console.log('Action onVisible');
      navigation.navigate('PaymentSuccess');
    }
  }, [appStateVisible, eSignaturePending, eSignatureStatus]);

  const handleCheckBox = (id: number) => {
    setCheckBoxesState(prevState => {
      const newState = [...prevState];
      newState[id] = !newState[id];
      return newState;
    });
  };

  const handleCopy = () => {
    Clipboard.setString(passKey);
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
            <TextInput style={styles.input} value={passKey} />
            <Pressable style={styles.btnCopy} onPress={handleCopy}>
              <SvgIcons.Copy width={20} />
            </Pressable>
          </View>
        </View>

        <View style={styles.importantInfo}>
          <View>
            <Text style={styles.importantInfoTitle}>Important information</Text>
            <Text style={styles.importantInfoDescription}>
              If you forget your password phrase you will be unable to access your account and your
              funds. We cannot reset or restore your password! Memorise or white your username and
              password!
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
            <Text style={styles.checkboxText}>
              I have written down or otherwise stored my passkey
            </Text>
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
            <CheckBox
              boxType="square"
              value={checkboxesState[4]}
              onValueChange={() => handleCheckBox(4)}
            />
            <Text style={styles.checkboxText}>Sign META Association Membership Agreement</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <RoundedButton
            styles={{ flex: 1 }}
            title="Next"
            disabled={!isEveryCheckBoxesValid || eSignaturePending}
            onPress={handleNext}
            pending={eSignaturePending}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasskeyScreen;
