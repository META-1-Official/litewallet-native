import { BottomTabHeaderProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackNavigationProp,
  StackScreenProps,
} from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, SafeAreaView, Text, View } from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import create from 'zustand';
import { DexSSP } from '.';
import { logoAsset, SvgIcons } from '../../../assets';
import Loader from '../../components/Loader';
import { ProfitIndicator } from '../../components/PortfolioHeader';
import { colors } from '../../styles/colors';
import meta1dex from '../../utils/meta1dexTypes';

export type AssetViewTabParamList = {
  ASSET__Chart: undefined;
  ASSET__Trades: undefined;
  ASSET__BuySell: undefined;
  ASSET__Orders: undefined;
  ASSET__MyOrders: undefined;
};

export type AssetViewModalStackParamList = {
  DEX__AssetView: undefined;
  DEX__AssetView__Modal: undefined;
};
export type DexModalStackNavigationProp = StackNavigationProp<
  AssetViewModalStackParamList,
  'DEX__AssetView'
>;

const Tab = createBottomTabNavigator<AssetViewTabParamList>();

const Stack = createStackNavigator<AssetViewModalStackParamList>();

const Name2Icon: Record<keyof AssetViewTabParamList, any> = {
  ASSET__Chart: SvgIcons.Chart,
  ASSET__Trades: SvgIcons.TradesClock,
  ASSET__BuySell: SvgIcons.Exchange,
  ASSET__Orders: SvgIcons.Orders,
  ASSET__MyOrders: SvgIcons.MyOrders,
};

const Black = () => <Loader bgc="#000" />;
const AssetViewModal = Black;

const AssetViewStack: React.FC<DexSSP> = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen component={DexAssetView} name="DEX__AssetView" />
      <Stack.Screen
        component={AssetViewModal}
        options={{ presentation: 'transparentModal' }}
        name="DEX__AssetView__Modal"
      />
    </Stack.Navigator>
  );
};
type Ticker = ReturnType<typeof meta1dex.db.get_ticker> extends Promise<infer U> ? U : never;

const AssetViewHeader: React.FC<BottomTabHeaderProps> = ({ navigation }) => {
  const { assetA, assetB } = useAVStore(x => x);
  const [ticker, setTicker] = useState<Ticker | null>(null);
  console.log(ticker);
  useEffect(() => {
    const fn = async () => {
      const _ = await meta1dex.db.get_ticker(assetB, assetA);
      setTicker(_);
      // Forcing header re-render
      navigation.setOptions({
        [Math.floor(Math.random() * 1000)]: Math.floor(Math.random() * 1000),
      });
    };
    fn();
  }, [assetA, assetB, navigation]);
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        height: (Platform.OS === 'ios' ? 89 : 48) + 8,
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate('__Tabs')}>
        <ArrowLeft width={32} height={32} stroke={colors.BrandYellow} />
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 20,
          color: '#fff',
          fontWeight: '500',
        }}
      >
        {assetA} / {assetB}
      </Text>
      <SvgIcons.FavoriteStar width={22} height={22} fill={colors.BrandYellow} />
      <Text
        style={{
          fontSize: 20,
          color: '#fff',
          fontWeight: '500',
        }}
      >
        {ticker?.latest.slice(0, 8)}
      </Text>
      <ProfitIndicator change={Number(ticker?.percent_change) || 0} />
    </SafeAreaView>
  );
};

const DexAssetView: React.FC<StackScreenProps<AssetViewModalStackParamList>> = ({
  route: { params },
  navigation,
}) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: AssetViewHeader,
        tabBarOptions: {
          showLable: false,
        },
        tabBarStyle: {
          backgroundColor: colors.BrandYellow,
        },
        title: route.name.replace('ASSET__', ''),
        tabBarLabelStyle: {
          fontSize: 13,
        },
        tabBarInactiveTintColor: '#500404',
        tabBarActiveTintColor: '#b77409',
        tabBarIcon: ({ color, size }) => {
          const Icon = Name2Icon[route.name];
          const newSize = route.name === 'ASSET__BuySell' ? size + 14 : size;
          if (route.name === 'ASSET__BuySell') {
            return (
              <View
                style={{
                  marginBottom: 22,
                  backgroundColor: '#500404',
                  borderRadius: size + 28,
                  borderWidth: 5,
                  borderColor: colors.BrandYellow,
                }}
              >
                <Image
                  source={logoAsset}
                  style={{
                    width: newSize,
                    height: newSize,
                    resizeMode: 'contain',
                    margin: 8,
                  }}
                />
              </View>
            );
          }
          return <Icon width={newSize} height={newSize} fill={color} color={color} />;
        },
      })}
    >
      <Tab.Screen initialParams={params} name="ASSET__Chart" component={Black} />
      <Tab.Screen initialParams={params} name="ASSET__Trades" component={Black} />
      <Tab.Screen
        initialParams={params}
        name="ASSET__BuySell"
        options={{
          title: 'Buy/Sell',
          tabBarButton: props => {
            return (
              <Pressable {...props} onPress={() => navigation.navigate('DEX__AssetView__Modal')} />
            );
          },
        }}
        component={Black}
      />
      <Tab.Screen initialParams={params} name="ASSET__Orders" component={Black} />
      <Tab.Screen
        initialParams={params}
        name="ASSET__MyOrders"
        options={{ title: 'My Orders' }}
        component={Black}
      />
    </Tab.Navigator>
  );
};

interface x {
  assetA: string;
  assetB: string;
  save: (a: string, b: string) => void;
}

const useAVStore = create<x>(set => ({
  assetA: '',
  assetB: '',
  save: (a: string, b: string) => set({ assetA: a, assetB: b }),
}));

// Xueta peredelivay
export const dexAssetView = (nav: any, assetA: string, assetB = 'USDT') => {
  const { save } = useAVStore.getState();
  save(assetA, assetB);
  nav.navigate('DEX__AssetViewStack');
};
export default AssetViewStack;
