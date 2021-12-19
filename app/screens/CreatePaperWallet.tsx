import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { useStore } from '../store';
import { colors } from '../styles/colors';

export default function CreatePaperWallet() {
  const save = async () => {
    const createLink = (...args: any[]) => {
      const payload = Buffer.from(args.join(' '), 'utf-8').toString('base64');
      const baseurl = 'http://soyboy.home:8000#';
      return baseurl + payload;
    };
    const link = createLink(...'asdf '.repeat(5).split(' '));
    await InAppBrowser.open(link, {});
  };
  
  const { accountName, password } = useStore();
  const [account, setAccount] = useState(accountName || '');
  const [pass, setPass] = useState(password || '');

  return (
    <SafeAreaView style={{ marginHorizontal: 24 }}>
      <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700' }}>Create Paper Wallet</Text>
      <View
        style={{ backgroundColor: 'darkred', padding: 12, marginVertical: 24, borderRadius: 6 }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500' }}>
          Unlock / login before creating the paper wallt to include private keys
        </Text>
      </View>
      <View>
        <Text style={{ color: colors.BrandYellow }}>Account Name</Text>
        <TextInput
          value={account}
          onChangeText={t => setAccount(t)}
          style={{
            paddingVertical: 12,
            fontSize: 18,
            color: '#ddd',
            borderBottomWidth: 1,
            borderBottomColor: '#555',
          }}
        />
      </View>
      <View style={{ marginTop: 24 }}>
        <Text style={{ color: colors.BrandYellow }}>Password</Text>
        <TextInput
          value={pass}
          onChangeText={t => setPass(t)}
          style={{
            paddingVertical: 12,
            fontSize: 18,
            color: '#ddd',
            borderBottomWidth: 1,
            borderBottomColor: '#555',
          }}
          secureTextEntry
        />
      </View>
      <TouchableOpacity onPress={save}>
        <View
          style={{
            backgroundColor: colors.BrandYellow,
            alignItems: 'center',
            padding: 18,
            marginVertical: 24,
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '500' }}>Create Paper Wallet</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
