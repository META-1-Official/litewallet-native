import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

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
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <TouchableOpacity onPress={save}>
        <Text>Open</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
