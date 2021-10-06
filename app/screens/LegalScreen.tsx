import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { List, ListItem } from '../components/List';
import RoundedButton from '../components/RoundedButton';
import { Heading, TextSecondary } from '../components/typography';

export default function Legal() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <View style={{ marginLeft: 24 }}>
        <Heading style={{ marginBottom: 18 }}>Legal</Heading>
        <TextSecondary>
          Please review the META Wallet Terms of Services and Privacy Policy.
        </TextSecondary>
      </View>
      <View>
        <RoundedButton title="Accept" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}
