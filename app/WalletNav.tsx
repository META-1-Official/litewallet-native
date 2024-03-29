import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Platform, Pressable, View } from 'react-native';
import { SvgIcons } from '../assets';
import { DexStackHeader } from './components/DexHeader';
import Loader from './components/Loader';
import { OverlayContent } from './components/SideMenuOverlay';
import { DexStack } from './screens/dex';
import ExploreAssets from './screens/ExploreAssets';
import FundAccount from './screens/FundAccountScreen';
import HelpStack from './screens/help';
import Sandbox from './screens/Sandbox';
import SettingsScreen from './screens/SettingsScreen';
import WalletScreen from './screens/WalletScreen';
import { useStore } from './store';
import { colors } from './styles/colors';
import { loadAvatar } from './services/litewalletApi';

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
      <Tab.Screen
        options={{
          tabBarAccessibilityLabel: 'Tab/Wallet',
        }}
        name="Wallet"
        component={WalletScreen}
      />
      {Platform.OS !== 'ios' && (
        <Tab.Screen
          options={{
            tabBarAccessibilityLabel: 'Tab/FundAccount',
          }}
          name="Fund Account"
          component={FundAccount}
        />
      )}
      <Tab.Screen
        name="DEX"
        options={{
          tabBarButton: props => {
            return <Pressable {...props} onPress={() => navigation.jumpTo('DEX_HOME')} />;
          },
          tabBarAccessibilityLabel: 'Tab/Dex',
        }}
        component={SettingsScreen}
      />
      <Tab.Screen
        name="Settings"
        options={{
          tabBarButton: props => {
            return <Pressable {...props} onPress={() => navigation.openDrawer()} />;
          },
          tabBarAccessibilityLabel: 'Tab/Settings',
        }}
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};

export type DexDrawerParamList = {
  DEX_HOME: undefined;
  __Home: undefined;
  __Settings: undefined;
  __Help: undefined;
  __ExploreAssets: undefined;
  _CreatePaperWallet: undefined;
  Sandbox: undefined;
};

const Drawer = createDrawerNavigator<DexDrawerParamList>();

type RootParams = {
  App: undefined;
  modal: { component: any; props: any };
};

const RootStack = createStackNavigator<RootParams>();
export type RootStackNP = StackNavigationProp<RootParams>;
export type ROTProps = StackScreenProps<RootParams, 'modal'>;

const RenderOnTop = ({ route, navigation }: ROTProps) => {
  const Component = route.params.component;
  if (Component) {
    return <Component {...route.params.props} />;
  }

  setTimeout(() => {
    console.warn('Failed to render modal');
    navigation.goBack();
  }, 100);

  return null;
};

export const DexNav: React.FC = () => {
  useEffect(() => {
    loadAvatar().then(url => useStore.getState().setAvatar(url));
  });

  const DrawerNav = () => (
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
        <Drawer.Screen
          name="__Settings"
          options={{ headerShown: false }}
          component={SettingsScreen}
        />
        <Drawer.Screen component={Sandbox} name="Sandbox" />
        <Drawer.Screen name="__Help" options={{ headerShown: false }} component={HelpStack} />
        <Drawer.Screen
          name="__ExploreAssets"
          options={{ headerShown: false }}
          component={ExploreAssets}
        />
      </Drawer.Navigator>
    </View>
  );

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen component={DrawerNav} name="App" />
      <RootStack.Screen
        component={RenderOnTop}
        name="modal"
        options={{ presentation: 'transparentModal', cardOverlayEnabled: true }}
      />
    </RootStack.Navigator>
  );
};
