import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';
import ListItem from './ListItem';

export type Screens = {
  Settings_Home: undefined;
  Settings_SwitchLanguage: undefined;
  Settings_ViewKeys: undefined;
  Settings_Notifications: undefined;
};

export const Names = ['Switch Language', 'Notifications', 'View Keys'];

type _SSP = StackScreenProps<Screens>;
type SNP = StackNavigationProp<Screens>;

export const name2id = (s: string) => `Settings_${s.replace(/\s+/, '')}` as keyof Screens;
export const id2name = (k: string | keyof Screens) => Names.find(e => name2id(e) === k);

const AccountGroup = () => {
  const navigation = useNavigation<SNP>();

  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 26, fontWeight: '600', marginBottom: 8 }}>
        Account
      </Text>
      {Names.map((e, i) => (
        <ListItem
          key={e + i}
          onPress={() => {
            navigation.navigate(name2id(e));
          }}
          text={e}
        />
      ))}
    </View>
  );
};

export default AccountGroup;
