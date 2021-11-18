import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import React from 'react';
import Loader from '../../components/Loader';
import { colors } from '../../styles/colors';
import { DexHeader, DexStackHeader } from '../../components/DexHeader';
import { Pressable, Text, View } from 'react-native';
import { SvgIcons } from '../../../assets';
import DexHome from './DexHome';
import DexTrade from './TradeScreen';
import { OverlayContent } from '../../components/SideMenuOverlay';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import DexModal from '../../components/DexMainModal';

const Black = () => <Loader bgc="#000" />;

export type DexTabParamList = {
  DEX__Home: undefined;
  DEX__Trade: undefined;
  DEX__Modal: undefined;
  DEX__Orders: undefined;
  DEX__Fund: undefined;
};

export type DexTabNavigationProp = BottomTabNavigationProp<DexDrawerParamList, 'DEX_HOME'>;

export type DexModalStackParamList = {
  __Tabs: undefined;
  __Modal: undefined;
};
export type DexModalStackNavigationProp = StackNavigationProp<DexModalStackParamList, '__Tabs'>;

const Tab = createBottomTabNavigator<DexTabParamList>();
const Stack = createStackNavigator<DexModalStackParamList>();

const Name2Icon: Record<keyof DexTabParamList, any> = {
  DEX__Home: SvgIcons.Home,
  DEX__Trade: SvgIcons.Trade,
  DEX__Modal: SvgIcons.Exchange,
  DEX__Orders: SvgIcons.Orders,
  DEX__Fund: SvgIcons.Wallet,
};
const DexStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen component={DexTabs} name="__Tabs" />
      <Stack.Screen
        component={DexModal}
        options={{ presentation: 'transparentModal' }}
        name="__Modal"
      />
    </Stack.Navigator>
  );
};
const DexTabs = ({ navigation }: StackScreenProps<DexModalStackParamList>) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: DexHeader,
        tabBarOptions: {
          showLable: false,
        },
        tabBarStyle: {
          backgroundColor: colors.BrandYellow,
        },
        title: route.name.replace('DEX__', ''),
        tabBarLabel: props => {
          return (
            <Text style={{ color: props.color }}>
              {route.name === 'DEX__Modal' ? null : route.name.replace('DEX__', '')}
            </Text>
          );
        },
        tabBarInactiveTintColor: '#500404',
        tabBarActiveTintColor: '#b77409',
        tabBarItemStyle: {
          marginTop: route.name === 'DEX__Modal' ? 24 : undefined,
        },
        tabBarIcon: ({ color, size }) => {
          const Icon = Name2Icon[route.name];
          const newSize = route.name === 'DEX__Modal' ? size + 24 : size;
          return <Icon width={newSize} height={newSize} fill={color} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DEX__Home" component={DexHome} />
      <Tab.Screen name="DEX__Trade" component={DexTrade} />
      <Tab.Screen
        name="DEX__Modal"
        options={{
          tabBarButton: props => {
            return <Pressable {...props} onPress={() => navigation.navigate('__Modal')} />;
          },
        }}
        component={Black}
      />
      <Tab.Screen name="DEX__Orders" component={Black} />
      <Tab.Screen name="DEX__Fund" component={Black} />
    </Tab.Navigator>
  );
};

export type DexDrawerParamList = {
  DEX_HOME: undefined;
  __Notifications: undefined;
  __Settings: undefined;
  DEX__Convert: undefined;
  DEX__Send: undefined;
  DEX__Recive: undefined;
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
        initialRouteName="DEX_HOME"
      >
        <Drawer.Screen
          name="DEX_HOME"
          options={{
            headerShown: false,
          }}
          component={DexStack}
        />
        <Drawer.Screen name="__Notifications" component={Black} />
        <Drawer.Screen name="__Settings" component={Black} />
        <Drawer.Screen name="DEX__Convert" component={Black} />
        <Drawer.Screen name="DEX__Send" component={Black} />
        <Drawer.Screen name="DEX__Recive" component={Black} />
      </Drawer.Navigator>
    </View>
  );
};