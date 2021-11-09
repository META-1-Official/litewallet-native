import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import Loader from '../../components/Loader';
import { colors } from '../../styles/colors';
import { DexHeader, DexStackHeader } from '../../components/DexHeader';

const Black = () => <Loader bgc="#000" />;
const Tab = createBottomTabNavigator();

const DexTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: DexHeader,
        tabBarStyle: {
          backgroundColor: colors.BrandYellow,
        },
        title: route.name.replace('DEX__', ''),
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
