import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import React from 'react';
import { Pressable, View } from 'react-native';
import { SvgIcons } from '../assets';
import { DexStackHeader } from './components/DexHeader';
import Loader from './components/Loader';
import { OverlayContent } from './components/SideMenuOverlay';
import CreatePaperWallet from './screens/CreatePaperWallet';
import { DexStack } from './screens/dex';
import ExploreAssets from './screens/ExploreAssets';
import FundAccount from './screens/FundAccountScreen';
import HelpStack from './screens/help';
import Notifications from './screens/Notifications';
import SettingsScreen from './screens/SettingsScreen';
import WalletScreen from './screens/WalletScreen';
import { useStore } from './store';
import { colors } from './styles/colors';

const Tab = createBottomTabNavigator();

export const WalletNav: React.FC<DrawerScreenProps<DexDrawerParamList>> = ({ navigation }) => {
  const loading = useStore(state => state.loading);
  if (loading) {
    return <Loader />;
  }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: { display: route.name === 'DEX' ? 'none' : undefined },
        headerShown: false,
        tabBarActiveTintColor: colors.BrandYellow,
        tabBarIcon: ({ color, size }) => {
          const Name2Icon = {
            Wallet: SvgIcons.wallet,
            DEX: SvgIcons.trading,
            Settings: SvgIcons.settings,
            'Fund Account': SvgIcons.fundAccount,
          };

          if (!(route.name in Name2Icon)) {
            return null;
          }
          const key = route.name as keyof typeof Name2Icon;
          const TheIcon: typeof Name2Icon['Wallet'] = Name2Icon[key];

          return <TheIcon width={size} height={size} fill={color} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Fund Account" component={FundAccount} />
      <Tab.Screen
        name="DEX"
        options={{
          tabBarButton: props => {
            return <Pressable {...props} onPress={() => navigation.jumpTo('DEX_HOME')} />;
          },
        }}
        component={SettingsScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          tabBarButton: props => {
            return <Pressable {...props} onPress={() => navigation.openDrawer()} />;
          },
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

export type DexDrawerParamList = {
  DEX_HOME: undefined;
  __Home: undefined;
  __Notifications: undefined;
  __Settings: undefined;
  __Help: undefined;
  __ExploreAssets: undefined;
  CreatePaperWallet: undefined;
};

const Drawer = createDrawerNavigator<DexDrawerParamList>();

export const DexNav: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Drawer.Navigator
        screenOptions={{
          // headerMode: 'screen',
          header: DexStackHeader,
          drawerStyle: {
            backgroundColor: '#000',
          },
        }}
        drawerContent={props => {
          return <OverlayContent {...props} />;
        }}
        initialRouteName="__Home"
      >
        <Drawer.Screen
          name="__Home"
          options={{
            headerShown: false,
          }}
          component={WalletNav}
        />
        <Drawer.Screen
          name="DEX_HOME"
          options={{
            headerShown: false,
          }}
          component={DexStack}
        />
        <Drawer.Screen name="__Notifications" component={Notifications} />
        <Drawer.Screen name="CreatePaperWallet" component={CreatePaperWallet} />
        <Drawer.Screen
          name="__Settings"
          options={{ headerShown: false }}
          component={SettingsScreen}
        />
        <Drawer.Screen name="__Help" options={{ headerShown: false }} component={HelpStack} />
        <Drawer.Screen
          name="__ExploreAssets"
          options={{ headerShown: false }}
          component={ExploreAssets}
        />
      </Drawer.Navigator>
    </View>
  );
};
