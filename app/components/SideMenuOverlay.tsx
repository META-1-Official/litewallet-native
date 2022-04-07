import { NETWORK } from '@env';
import { DrawerContentComponentProps } from '@react-navigation/drawer/src/types';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { Activity, Archive, ArrowLeft, HelpCircle, PieChart } from 'react-native-feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { Text } from 'react-native-paper';
import { SvgIcons } from '../../assets';
import { useStore } from '../store';
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

const HOST = 'https://litewallet.cryptomailsvc.io';
function useUserAvatar() {
  const accountName = useStore(state => state.accountName);
  const [uri, setUrl] = useState('');
  useEffect(() => {
    async function loadAvatar() {
      const res = await fetch(`${HOST}/getUserData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: accountName,
        }),
      });
      if (res.status === 200) {
        const { message } = await res.json();
        console.log(message);
        setUrl(`${HOST}/public/${message.userAvatar}`);
        return;
      }

      console.log(await res.text());
    }
    loadAvatar().catch(console.warn);
  }, [accountName]);

  const upload = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        maxHeight: 500,
        maxWidth: 500,
        quality: 0.2,
      });

      const photo = result.assets?.[0]!;
      console.log(result);

      const fd = new FormData();
      fd.append('login', accountName);
      fd.append('file', {
        name: photo.fileName,
        type: photo.type,
        uri: Platform.OS === 'ios' ? photo.uri!.replace('file://', '') : photo.uri!,
      });

      const res = await fetch(`${HOST}/saveAvatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: fd,
      });
      const { message } = await res.json();
      setUrl(`${HOST}/public/${message}`);
    } catch (e) {
      Alert.alert('Failed to upload avatar');
    }
  };
  return { uri, upload };
}

export const OverlayContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const accountName = useStore(state => state.accountName);
  const logout = useStore(state => state.logout);
  const { uri, upload } = useUserAvatar();
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
        <TouchableOpacity onPress={() => upload()}>
          <Image
            source={{ uri }}
            style={{
              width: 80,
              height: 80,
              backgroundColor: 'lightblue',
              borderRadius: 100,
              marginBottom: 20,
            }}
          />
        </TouchableOpacity>
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
        <ListItem
          title="Create Paper Wallet"
          icon={Archive}
          onPress={() => navigation.jumpTo('_CreatePaperWallet')}
        />
        <ListItem title="Help" icon={HelpCircle} onPress={() => navigation.navigate('__Help')} />
        {process.env.NODE_ENV === 'production' && NETWORK !== 'TESTNET' ? null : (
          <ListItem
            title="Debug Sandbox"
            icon={Activity}
            onPress={() => navigation.navigate('Sandbox')}
          />
        )}
      </View>
      <TouchableOpacity
        {...tid('SideMenu/SignOut')}
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
