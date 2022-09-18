import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Image, SafeAreaView, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RootNavigationProp } from '../../App';
import RoundedButton from '../../components/RoundedButton';
import { generateKeyFromPassword } from '../../utils/accountCreate';

export const FaceKISuccessScreen = ({ route }) => {
  const nav = useNavigation<RootNavigationProp>();
  const { path, privateKey, accountName, email, firstName, lastName, mobile } = route.params;
  console.log('!!!Path: ', path);

  const passKey = generateKeyFromPassword(accountName, '', privateKey, true);

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
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: 'grey',
            borderRadius: 155,
            width: 310,
            height: 310,
            marginBottom: 40,
            overflow: 'hidden',
          }}
        >
          <Image style={{ width: '100%', height: '100%' }} source={{ uri: path }} />
        </View>
        <View style={{}}>
          <Text
            style={{ textAlign: 'center', fontSize: 42, fontWeight: 'bold', color: '#00AD6A' }}
          >
            Congrats!
          </Text>
          <Text style={{ textAlign: 'center', fontSize: 22 }}>
            The biometric data of your selfie successfully completed
          </Text>
        </View>
        <View style={{ position: 'absolute', bottom: 0, width: '100%' }}>
          <RoundedButton
            styles={{ flex: 1 }}
            title="Next"
            onPress={() =>
              nav.navigate('Passkey', { passKey, email, accountName, mobile, firstName, lastName })
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FaceKISuccessScreen;
