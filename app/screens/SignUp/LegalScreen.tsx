import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { ppIconAsset, tosIconAsset } from '../../../assets';
import { RootNavigationProp } from '../../AuthNav';
import { List, ListItem } from '../../components/List';
import RoundedButton from '../../components/RoundedButton';
import { Heading, TextSecondary } from '../../components/typography';

export default function Legal() {
  const nav = useNavigation<RootNavigationProp>();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
      <View style={{ marginLeft: 24 }}>
        <Heading style={{ marginBottom: 18 }} />
        <TextSecondary>
          Please review the META Wallet Terms of Services and Privacy Policy.
        </TextSecondary>
      </View>
      <View>
        <List
          style={{
            backgroundColor: '#fff',
            borderRadius: 8,
            margin: 18,
          }}
        >
          <ListItem
            title="Terms of Service"
            onPress={() => nav.navigate('TOS')}
            icon={tosIconAsset}
            separator
            arrow
          />
          <ListItem
            title="Privacy Policy"
            onPress={() => nav.navigate('Privacy')}
            icon={ppIconAsset}
            arrow
          />
        </List>
        <RoundedButton title="Accept" onPress={() => nav.navigate('CreateWallet')} />
      </View>
    </SafeAreaView>
  );
}
