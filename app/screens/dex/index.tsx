import { BottomTabNavigationProp, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import Loader from '../../components/Loader';
import { colors } from '../../styles/colors';
import { DexHeader, DexStackHeader } from '../../components/DexHeader';
import { Text } from 'react-native';
import { SvgIcons } from '../../../assets';

const Black = () => <Loader bgc="#000" />;

export type DexTabParamList = {
  DEX__Home: undefined;
  DEX__Trade: undefined;
  DEX__Modal: undefined;
  DEX__Orders: undefined;
  DEX__Fund: undefined;
};

export type DexTabNavigationProp = BottomTabNavigationProp<DexStackParamList, 'DEX_HOME'>;

const Tab = createBottomTabNavigator<DexTabParamList>();

const Name2Icon: Record<keyof DexTabParamList, any> = {
  DEX__Home: SvgIcons.Home,
  DEX__Trade: SvgIcons.Trade,
  DEX__Modal: SvgIcons.Exchange,
  DEX__Orders: SvgIcons.Orders,
  DEX__Fund: SvgIcons.Wallet,
};

const DexTabs = () => {
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
      <Tab.Screen name="DEX__Home" component={Black} />
      <Tab.Screen name="DEX__Trade" component={Black} />
      <Tab.Screen name="DEX__Modal" component={Black} />
      <Tab.Screen name="DEX__Orders" component={Black} />
      <Tab.Screen name="DEX__Fund" component={Black} />
    </Tab.Navigator>
  );
};

export type DexStackParamList = {
  DEX_HOME: undefined;
  __Notifications: undefined;
  __Settings: undefined;
};

export type DexStackNavigationProp = StackNavigationProp<DexStackParamList, 'DEX_HOME'>;

const Stack = createStackNavigator<DexStackParamList>();

export const DexNav: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: 'screen',
        header: DexStackHeader,
      }}
    >
      <Stack.Screen
        name="DEX_HOME"
        options={{
          headerShown: false,
        }}
        component={DexTabs}
      />
      <Stack.Screen name="__Notifications" component={Black} />
      <Stack.Screen name="__Settings" component={Black} />
    </Stack.Navigator>
  );
};
