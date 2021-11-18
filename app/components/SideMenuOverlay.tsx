import { DrawerContentComponentProps } from '@react-navigation/drawer/src/types';
import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import {
  Archive,
  ArrowLeft,
  CreditCard,
  HelpCircle,
  PieChart,
  UserPlus,
} from 'react-native-feather';
import { Text } from 'react-native-paper';
import { SvgIcons } from '../../assets';
import { useStore } from '../store';

interface ListItemProps {
  title: string;
  icon?: any;
  onPress?: () => void;
}
const ListItem: React.FC<ListItemProps> = ({ title, icon, onPress }) => {
  let TheIcon: any = () => null;
  let isRawSvg = false;
  if (icon) {
    isRawSvg = icon.name === 'SvgComponent';
    TheIcon = icon;
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ flexDirection: 'row', padding: 12 }}>
        <TheIcon fill={isRawSvg ? '#fff' : undefined} color="#fff" width={24} height={24} />
        <Text style={{ color: '#fff', fontSize: 18, marginLeft: 24 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const OverlayContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const accountName = useStore(state => state.accountName);
  return (
    <SafeAreaView style={{ padding: 12 }}>
      <View>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <ArrowLeft width={32} height={32} color="#fff" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            backgroundColor: 'lightblue',
            borderRadius: 100,
            marginBottom: 20,
          }}
        />
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700' }}>{accountName}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {}}
        style={{
          margin: 4,
          marginTop: 18,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            borderColor: '#4b4b4b',
            borderWidth: 1,
            padding: 12,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>Edit Profile & Settings</Text>
        </View>
      </TouchableOpacity>
      <View
        style={{
          marginVertical: 24,
        }}
      >
        <ListItem title="Lite Wallet" icon={SvgIcons.Wallet} />
        <ListItem title="DEX" icon={SvgIcons.Trade} />
        <ListItem title="Buy / Sell" icon={CreditCard} />
        <ListItem title="Invite Friends" icon={UserPlus} />
        <ListItem title="Backing Assets" icon={PieChart} />
        <ListItem title="Create Paper Wallet" icon={Archive} />
        <ListItem title="Help" icon={HelpCircle} />
      </View>
      <TouchableOpacity
        onPress={() => {}}
        style={{
          margin: 4,
          marginTop: 18,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            borderColor: '#4b4b4b',
            borderWidth: 1,
            padding: 12,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 18 }}>Sign Out</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};