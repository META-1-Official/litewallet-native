import { DrawerContentComponentProps } from '@react-navigation/drawer/src/types';
import React from 'react';
import { SafeAreaView, TouchableOpacity, View, } from 'react-native';
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
  rawIcon?: boolean;
  onPress?: () => void;
}
const ListItem: React.FC<ListItemProps> = ({ title, icon, onPress, rawIcon }) => {
  const TheIcon: React.ReactNode = icon!;
  return (
    <TouchableOpacity onPress={onPress}> 
      <View style={{ flexDirection: 'row', padding: 12 }}>
        <TheIcon fill={rawIcon ? '#fff' : undefined} color="#fff" width={24} height={24} />
        <Text style={{ color: '#fff', fontSize: 18, marginLeft: 24 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const OverlayContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const accountName = useStore(state => state.accountName);
  const logout = useStore(state => state.logout);
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
        <ListItem
          onPress={() => {
            console.log(navigation.getState(), navigation.getParent());
            navigation.closeDrawer();
            navigation.jumpTo('__Home');
          }}
          title="Lite Wallet"
          rawIcon
          icon={SvgIcons.Wallet}
        />
        <ListItem
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('DEX__Home');
          }}
          title="DEX"
          rawIcon
          icon={SvgIcons.Trade}
        />
        <ListItem title="Buy / Sell" icon={CreditCard} />
        <ListItem title="Invite Friends" icon={UserPlus} />
        <ListItem
          title="Backing Assets"
          icon={PieChart}
          onPress={() => navigation.navigate('__ExploreAssets')}
        />
        <ListItem
          title="Create Paper Wallet"
          icon={Archive}
          onPress={() => navigation.navigate('CreatePaperWallet')}
        />
        <ListItem title="Help" icon={HelpCircle} onPress={() => navigation.navigate('__Help')} />
      </View>
      <TouchableOpacity
        onPress={() => logout()}
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
