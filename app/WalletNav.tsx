import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { SvgIcons } from '../assets';
import { DexStackHeader } from './components/DexHeader';
import Loader from './components/Loader';
import { OverlayContent } from './components/SideMenuOverlay';
import ZenDeskButton from './components/ZenDeskButton';
import useAppDispatch from './hooks/useAppDispatch';
import { DexStack } from './screens/dex';
import ExploreAssets from './screens/ExploreAssets';
import FundAccount from './screens/FundAccountScreen';
import HelpStack from './screens/help';
import Sandbox from './screens/Sandbox';
import SettingsScreen from './screens/SettingsScreen/SettingsScreen';
import WalletScreen from './screens/WalletScreen';
import { useStore } from './store';
import { getAccountData } from './store/wallet/wallet.actions';
import { colors } from './styles/colors';

const Tab = createBottomTabNavigator();

export const WalletNav: React.FC<DrawerScreenProps<DexDrawerParamList>> = ({ navigation }) => {
  const dispatch = useAppDispatch();
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
            'Fund Wallet': SvgIcons.fundAccount,
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
      <Tab.Screen
        options={{
          tabBarAccessibilityLabel: 'Tab/FundAccount',
        }}
        name="Fund Wallet"
        component={FundAccount}
      />
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
            return (
              <Pressable
                {...props}
                onPress={() => {
                  dispatch(getAccountData());
                  navigation.openDrawer();
                }}
              />
            );
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
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAccountData());
  }, []);

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
      <ZenDeskButton />
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
