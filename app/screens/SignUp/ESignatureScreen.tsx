import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import ESignature from '../../components/ESignature';
import { Heading } from '../../components/typography';

export const ESignatureScreen = () => {
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
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <View style={{ marginHorizontal: 24 }}>
          <Heading style={{ marginBottom: 8 }}>E-Signature</Heading>

          <ESignature />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ESignatureScreen;
