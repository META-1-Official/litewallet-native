import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { catchError } from '../utils';
import { getAccountKeys, paperWallet } from '../utils/meta1Api';

export default function CreatePaperWallet() {
  const { accountName, password: pass } = useStore();
  const [password, setPassword] = useState(pass || '');

  const save = async () => {
    catchError(async () => {
      const keys = await getAccountKeys({ accountName, password });
      await InAppBrowser.open(paperWallet(keys), {});
    });
  };


  return (
    <SafeAreaView style={{ marginHorizontal: 24 }}>
      <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700' }}>Create Paper Wallet</Text>
      <View
        style={{ backgroundColor: 'darkred', padding: 12, marginVertical: 24, borderRadius: 6 }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500' }}>
          Unlock / login before creating the paper wallet to include private keys
        </Text>
      </View>
      <View>
        <Text style={{ color: colors.BrandYellow }}>Account Name</Text>
        <TextInput
          value={accountName}
          editable={false}
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
          value={password}
          onChangeText={t => setPassword(t)}
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
