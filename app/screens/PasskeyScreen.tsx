import React from 'react';
import { Linking, Platform, SafeAreaView, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import * as url from 'url';
import RoundedButton from '../components/RoundedButton';

export const PasskeyScreen = ({ route, navigation }) => {
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
            <CheckBox boxType="square" value={false} onValueChange={() => {}} />
            <Text style={{ marginLeft: 20, flex: 1 }}>
              I understand that I will lose access to my funds if I lose my passkey
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <CheckBox boxType="square" value={false} onValueChange={() => {}} />
            <Text style={{ marginLeft: 20, flex: 1 }}>
              I understand that no one can recover my passkey if I lose or forget it
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <CheckBox boxType="square" value={false} onValueChange={() => {}} />
            <Text style={{ marginLeft: 20, flex: 1 }}>
              I have written down or otherwise stored my passkey
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <CheckBox boxType="square" value={false} onValueChange={() => {}} />
            <Text style={{ marginLeft: 20, flex: 1 }}>
              I am a living man or woman hence a living being
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <CheckBox boxType="square" value={false} onValueChange={() => {}} />
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
            onPress={() => {
              Linking.openURL('https://humankyc.cryptomailsvc.io/');
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasskeyScreen;
