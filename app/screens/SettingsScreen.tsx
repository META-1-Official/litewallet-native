import { useNavigation } from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import React from 'react';
import { Alert, Image, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, ChevronRight } from 'react-native-feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { tid } from '../utils';
import { removeAvatar, uploadAvatar } from '../utils/avatarApi';
import { isError } from '../utils/errorUtils';
import CreatePaperWallet from './CreatePaperWallet';
import Notifications from './Notifications';

const ListItem = ({
  onPress,
  text,
  color,
}: {
  onPress: () => void;
  text: string;
  color?: string;
}) => (
  <TouchableOpacity {...tid(`Settings/ListItem/${text}`)} onPress={onPress}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
      }}
    >
      <Text style={{ color: color || '#fff', fontSize: 18 }}>{text}</Text>
      <ChevronRight color={color || '#fff'} />
    </View>
  </TouchableOpacity>
);

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
const SwitchLanguage = () => {
  return (
    <SafeAreaView style={{ margin: 18 }}>
      <TouchableOpacity onPress={() => {}}>
        <View
          style={{
            flexDirection: 'row',
            borderColor: colors.BrandYellow,
            borderRadius: 5,
            borderWidth: 1,
            padding: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18, color: colors.BrandYellow, fontWeight: '500' }}>
            English
          </Text>
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 100,
              backgroundColor: colors.BrandYellow,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{ width: 8, height: 8, borderRadius: 10, backgroundColor: '#000', margin: 5 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
    if (result.didCancel) {
      return;
    }

    await uploadAvatar(photo);
  } catch (e) {
    if (isError(e)) {
      console.warn(e.message);
    } else {
      console.warn(e);
    }
    Alert.alert('Failed to upload avatar');
  }
};

const AvatarGroup = () => {
  return (
    <View>
      <Text style={{ color: '#fff', fontSize: 26, fontWeight: '600', marginBottom: 8 }}>
        Avatar
      </Text>
      <ListItem text="Upload" onPress={upload} />
      <ListItem text="Remove" color="#E03616" onPress={removeAvatar} />
    </View>
  );
};

const Divider = () => {
  return <View style={{ flex: 1, borderColor: '#444', height: 0, marginVertical: 12 }} />;
};

const MainSettingsScreen = () => {
  const { accountName, avatarUrl } = useStore();
  return (
    <SafeAreaView style={{ margin: 18 }}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View>
          <Text
            style={{
              color: colors.BrandYellow,
              fontSize: 24,
              fontWeight: '700',
            }}
          >
            @{accountName}
          </Text>
          <Text style={{ fontSize: 16, color: '#aaa' }}>Current Account</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <Image
            source={{ uri: avatarUrl }}
            style={{
              width: 65,
              height: 65,
              backgroundColor: 'lightblue',
              borderRadius: 100,
            }}
          />
        </View>
      </View>
      <Divider />
      <AvatarGroup />
      <Divider />
      <AccountGroup />
      {/* <Button onPress={() => logout()} title="logout" /> */}
    </SafeAreaView>
  );
};

type Screens = {
  Settings_Home: undefined;
  Settings_SwitchLanguage: undefined;
  Settings_ViewKeys: undefined;
  Settings_Notifications: undefined;
};

const Names = ['Switch Language', 'Notifications', 'View Keys'];

const name2id = (s: string) => `Settings_${s.replace(/\s+/, '')}` as keyof Screens;
const id2name = (k: string | keyof Screens) => Names.find(e => name2id(e) === k);

type _SSP = StackScreenProps<Screens>;
type SNP = StackNavigationProp<Screens>;
const Stack = createStackNavigator();
const SettingsScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ navigation, route }) => {
          const BackButton = ({ color }: { color: string }) => (
            <TouchableOpacity
              {...tid('Back')}
              style={{ marginHorizontal: 12 }}
              activeOpacity={0.5}
              onPress={navigation.goBack}
            >
              <ArrowLeft width={32} height={32} stroke={color} />
            </TouchableOpacity>
          );
          const title = id2name(route.name) || 'Settings';
          return (
            <SafeAreaView
              style={{
                backgroundColor: '#000',
                height: (Platform.OS === 'ios' ? 89 : 48) + 8,
                paddingTop: Platform.OS === 'ios' ? 0 : 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <BackButton color="#fff" />
              <Text
                style={{
                  fontSize: 20,
                  color: '#fff',
                  fontWeight: '500',
                }}
              >
                {title}
              </Text>

              {/* Empty view for space between alignment, mimics back button sizing*/}
              <View style={{ width: 32, height: 32, marginHorizontal: 12 }} />
            </SafeAreaView>
          );
        },
      }}
    >
      <Stack.Screen name="Settings_Home" component={MainSettingsScreen} />
      <Stack.Screen name="Settings_SwitchLanguage" component={SwitchLanguage} />
      <Stack.Screen name="Settings_ViewKeys" component={CreatePaperWallet} />
      <Stack.Screen name="Settings_Notifications" component={Notifications} />
    </Stack.Navigator>
  );
};

export default SettingsScreen;
