// import { NETWORK } from '@env';
// import { Network } from '../config';
import { DrawerContentComponentProps } from '@react-navigation/drawer/src/types';
import React from 'react';
import { Image, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, HelpCircle, PieChart } from 'react-native-feather';
import { Text } from 'react-native-paper';
import { SvgIcons } from '../../assets';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { logout } from '../store/wallet/wallet.reducers';
import { tid } from '../utils';

interface ListItemProps {
  title: string;
  icon?: any;
  rawIcon?: boolean;
  onPress?: () => void;
}
const ListItem: React.FC<ListItemProps> = ({ title, icon, onPress, rawIcon }) => {
  const TheIcon: any = icon!;
  return (
    <TouchableOpacity {...tid(`SideMenu/ListItem/${title}`)} onPress={onPress}>
      <View style={{ flexDirection: 'row', padding: 12 }}>
        <TheIcon fill={rawIcon ? '#fff' : undefined} color="#fff" width={24} height={24} />
        <Text style={{ color: '#fff', fontSize: 18, marginLeft: 24 }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const OverlayContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { accountName, avatarUrl } = useAppSelector(state => state.wallet);
  return (
    <SafeAreaView style={{ padding: 12 }}>
      <View>
        <TouchableOpacity {...tid('SideMenu/Back')} onPress={() => navigation.closeDrawer()}>
          <ArrowLeft width={32} height={32} color="#fff" />
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={{ uri: avatarUrl }}
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
        {...tid('SideMenu/Settings')}
        onPress={() => {
          navigation.closeDrawer();
          navigation.jumpTo('__Settings');
        }}
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
            navigation.navigate('DEX_HOME', {
              screen: '__Tabs',
            });
          }}
          title="DEX"
          rawIcon
          icon={SvgIcons.Trade}
        />
        <ListItem
          title="Backing Assets"
          icon={PieChart}
          onPress={() => navigation.jumpTo('__ExploreAssets')}
        />
        <ListItem title="Help" icon={HelpCircle} onPress={() => navigation.navigate('__Help')} />
        {/*{process.env.NODE_ENV === 'production' && NETWORK === Network.META1 ? null : (*/}
        {/*  <ListItem*/}
        {/*    title="Debug Sandbox"*/}
        {/*    icon={Activity}*/}
        {/*    onPress={() => navigation.navigate('Sandbox')}*/}
        {/*  />*/}
        {/*)}*/}
      </View>
      <TouchableOpacity
        {...tid('SideMenu/SignOut')}
        onPress={() => dispatch(logout())}
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
