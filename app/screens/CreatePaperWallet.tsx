import React from 'react';
import { Linking, SafeAreaView, Text, TouchableOpacity } from 'react-native';

export default function CreatePaperWallet() {
  const save = () => {
    Linking.openURL('data:text/html;charset=utf-8;base64,PGgxPlhVSTwvaDE+');
  };
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <TouchableOpacity onPress={save}>
        <Text>Open</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
