import React, { useMemo, useState } from 'react';
import { Linking, Platform, SafeAreaView, Text, TextInput, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import * as url from 'url';
import RoundedButton from '../components/RoundedButton';
import * as WebBrowser from '@toruslabs/react-native-web-browser';
import config from '../config';
import { createUser, getToken } from '../services/eSignature';

const handleNext = async (email, firstName, lastName, mobile, passKey) => {
  const redirectUrl = 'io.meta1.appbeta://auth';
  const faceKiId = email + passKey.privKey;
  let token;

  console.log('!!! createUser', email, email + passKey.privKey);
  const user = await createUser(email, faceKiId);
  console.log('!!! Response: ', user);

  console.log('!!! getToken', email);
  const response = await getToken(email);
  console.log('!!!Response getToken ', response);

  if (response && response.headers) {
    if (response.headers.authorization) {
      token = response.headers.authorization;
    }
  }

  console.log('!Token: ', token);
  console.log('!Data: ', firstName, lastName, mobile, token);
  const phoneNumber = mobile.replace(/\s/g, '');
  const encodedEmail = encodeURIComponent(email);

  let result = await WebBrowser.openBrowserAsync(
    `${config.E_SIGNATURE_API_URL}/e-sign?email=${encodedEmail}&firstName${firstName}&lastName=${lastName}&phoneNumber=${phoneNumber}&token=${token}&redirectUrl=${redirectUrl}`,
  );
  console.log('!!!WebBrowser: ', result);
};

export const PasskeyScreen = ({ route, navigation }) => {
  const { passKey, firstName, lastName, mobile, email, accountName } = route.params;
  const [checkboxesState, setCheckBoxesState] = useState([false, false, false, false, false]);
  const handleCheckBox = (id: number) => {
    setCheckBoxesState(prevState => {
      const newState = [...prevState];
      newState[id] = !newState[id];
      return newState;
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
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingLeft: 30,
          paddingRight: 30,
        }}
      >
        <View style={{}}>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Save Passkey</Text>
          <TextInput value={passKey.privKey} />
          <Text style={{ fontSize: 18, paddingTop: 33, paddingBottom: 33 }}>
            Please keep your Passkey in a safe place. Don't share it with any third-parties or send
            it online.
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#FFF2F2',
            borderColor: '#FF2F2F',
            borderWidth: 1,
            padding: 20,
          }}
        >
          <View>
            <Text style={{ fontSize: 22 }}>Important information</Text>
            <Text style={{ fontSize: 15, paddingTop: 15 }}>
              If you forget your password phrase you will be unable to access your account and your
              funds. We cannot reset or restore your password! Memorise or white your username and
              password!
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            marginTop: 35,
            width: '100%',
            flexGrow: 0.75,
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <CheckBox
              boxType="square"
              value={checkboxesState[0]}
              onValueChange={() => handleCheckBox(0)}
            />
            <Text style={{ marginLeft: 20, flex: 1 }}>
              I understand that I will lose access to my funds if I lose my passkey
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <CheckBox
              boxType="square"
              value={checkboxesState[1]}
              onValueChange={() => handleCheckBox(1)}
            />
            <Text style={{ marginLeft: 20, flex: 1 }}>
              I understand that no one can recover my passkey if I lose or forget it
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <CheckBox
              boxType="square"
              value={checkboxesState[2]}
              onValueChange={() => handleCheckBox(2)}
            />
            <Text style={{ marginLeft: 20, flex: 1 }}>
              I have written down or otherwise stored my passkey
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <CheckBox
              boxType="square"
              value={checkboxesState[3]}
              onValueChange={() => handleCheckBox(3)}
            />
            <Text style={{ marginLeft: 20, flex: 1 }}>
              I am a living man or woman hence a living being
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <CheckBox
              boxType="square"
              value={checkboxesState[4]}
              onValueChange={() => handleCheckBox(4)}
            />
            <Text style={{ marginLeft: 20, flex: 1 }}>
              Sign META Association Membership Agreement
            </Text>
          </View>
        </View>

        <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <RoundedButton
            styles={{ flex: 1 }}
            title="Next"
            // onPress={() => navigation.navigate('ESignature')}
            disabled={!isEveryCheckBoxesValid}
            onPress={() => handleNext(email, firstName, lastName, mobile, passKey)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasskeyScreen;
