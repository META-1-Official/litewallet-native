import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import { RootNavigationProp } from '../../AuthNav';
import RoundedButton from '../../components/RoundedButton';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { eSignatureProceed } from '../../store/signUp/signUp.actions';

import { SvgIcons } from '../../../assets';
import styles from './PasskeyScreen.styles';

export const PasskeyScreen = () => {
  const nav = useNavigation<RootNavigationProp>();
  const dispatch = useAppDispatch();
  const {
    passKey,
    privateKey,
    firstName,
    lastName,
    mobile,
    email,
    accountName,
    eSignatureStatus,
  } = useAppSelector(state => state.signUp);
  const [checkboxesState, setCheckBoxesState] = useState([false, false, false, false, false]);

  const handleNext = async () => {
    dispatch(eSignatureProceed({ firstName, lastName, mobile, email, accountName, privateKey }));
  };

  useEffect(() => {
    if (eSignatureStatus === 'cancel' || eSignatureStatus === 'dismiss') {
      nav.navigate('PaymentSuccess');
    }
  });

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
            disabled={!isEveryCheckBoxesValid}
            onPress={() => handleNext()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasskeyScreen;
