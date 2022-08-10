import React, { useEffect, useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import { logoAsset } from '../../assets';
import Services from '../services';
import { colors } from '../styles/colors';
import { tid } from '../utils';
import { useAssets } from '../utils/meta1Api';

const comm: ViewStyle = {
  borderRadius: 100,
  padding: 6,
  paddingHorizontal: 18,
};
interface Props {
  name: string;
  qty: string;
  status: 'Approved' | 'Cancelled' | 'Pending';
  progress: number;
}
const statusColors = {
  Approved: '#10913a',
  Cancelled: '#4e0000',
  Pending: '#422d00',
};

const darken = (c: string, amt: number) => {
  const r = parseInt(c.slice(1, 3), 16);
  const g = parseInt(c.slice(3, 5), 16);
  const b = parseInt(c.slice(5, 7), 16);

  const updated = [r * amt, g * amt, b * amt];
  return (
    '#' +
    updated
      .map(e => Math.max(0, Math.min(255, Math.round(e)))) // Clamp
      .map(e => e.toString(16).padStart(2, '0')) // to hex
      .join('')
  );
};

export function Header({ navigation }: any) {
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
  const title = 'Explore Assets';
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#3d0000',
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
}

function BackingAsset(props: Props) {
  const color = statusColors[props.status];
  return (
    <View style={{ flexDirection: 'row', margin: 8 }}>
      <View>
        <Image source={logoAsset} style={{ width: 85, height: 85, resizeMode: 'contain' }} />
      </View>
      <View style={{ flex: 1, marginLeft: 8 }}>
        <Text style={{ color: '#ccc' }}>{props.name}</Text>
        <Text style={{ color: '#fff', fontSize: 22, marginVertical: 8 }}>{props.qty}</Text>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ color, fontSize: 15 }}>{props.status}</Text>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              backgroundColor: darken(color, 0.3),
              borderRadius: 10,
              height: 10,
              marginHorizontal: 12,
            }}
          >
            <View
              style={{
                flex: props.progress,
                backgroundColor: color,
                borderRadius: 10,
              }}
            />
          </View>
          <Text style={{ color: '#fff' }}>
            {(props.progress * 100).toString().padStart(5, ' ')}%
          </Text>
        </View>
      </View>
    </View>
  );
}

function Approved() {
  return (
    <ScrollView>
      <BackingAsset
        name="Beginning balance gold reserve assignment of $8,888,888,888.00 with supporting bonds of equal value insuring the principal gold reserves"
        qty="$8,888,888,888"
        status="Approved"
        progress={1}
      />

      <BackingAsset
        name="GOLD RESERVE ASSET ASSIGNMENT OF $500,000,000.00 WITH SUPPORTING BONDS OF EQUAL VALUE INSURING THE PRINCIPAL GOLD RESERVES"
        qty="$500,000,000"
        status="Approved"
        progress={1}
      />

      <BackingAsset
        name="GOLD RESERVE ASSET ASSIGNMENT OF $500,000,000.00 WITH SUPPORTING BONDS OF EQUAL VALUE INSURING THE PRINCIPAL GOLD RESERVES"
        qty="$500,000,000"
        status="Approved"
        progress={1}
      />
      <BackingAsset
        name="GOLD RESERVE ASSET ASSIGNMENT OF $5,600,000,000 WITH SUPPORTING BONDS OF EQUAL VALUE INSURING THE PRINCIPAL GOLD RESERVES"
        qty="$5,600,000,000"
        status="Approved"
        progress={0.7326}
      />
    </ScrollView>
  );
}

function NotFound() {
  return (
    <Text style={{ color: '#ccc', textAlign: 'center' }}>
      No backed assets found with required filter.
    </Text>
  );
}
export default function ExploreAssets({ navigation }: any) {
  const [tab, setTab] = useState(0);
  const tabs = [<Approved />, <NotFound />, <NotFound />];
  // const price = useAssets().find('META1')?.usdt_value || 0;
  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    (async () => {
      const newPrice = await Services.getPrice();
      console.log(newPrice);
      setPrice(+newPrice);
    })();
  }, []);

  return (
    <>
      <Header navigation={navigation} />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <View
          style={{
            flexDirection: 'row',
            padding: 24,
            paddingVertical: 32,
            backgroundColor: '#3d0000',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, color: '#fff' }}>
              Explore assets assigned to META1 coin on the META blockchain
            </Text>
            <Text style={{ fontSize: 18, color: colors.BrandYellow, marginTop: 18 }}>
              META1 Coin Current Asset Value: ${price.toFixed(2)}
            </Text>
          </View>
          <View>
            <Image source={logoAsset} style={{ width: 120, height: 120, resizeMode: 'contain' }} />
          </View>
        </View>
        <View style={{ padding: 12, backgroundColor: '#200001' }}>
          <Text style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>
            Assets Assingnment statistics, history & data
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            padding: 8,
            paddingVertical: 12,
          }}
        >
          <TouchableOpacity
            {...tid('ExploreAssets/Approved')}
            onPress={() => setTab(0)}
            style={{ ...comm, backgroundColor: '#10913a' }}
          >
            <Text style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}>Approved</Text>
          </TouchableOpacity>
          <TouchableOpacity
            {...tid('ExploreAssets/Cancelled')}
            onPress={() => setTab(1)}
            style={{ ...comm, backgroundColor: '#4e0000' }}
          >
            <Text style={{ fontSize: 18, fontWeight: '500', color: '#d8404c' }}>Cancelled</Text>
          </TouchableOpacity>
          <TouchableOpacity
            {...tid('ExploreAssets/Pending')}
            onPress={() => setTab(2)}
            style={{ ...comm, backgroundColor: '#422d00' }}
          >
            <Text style={{ fontSize: 18, fontWeight: '500', color: '#de9135' }}>Pending</Text>
          </TouchableOpacity>
        </View>
        {tabs[tab]}
      </SafeAreaView>
    </>
  );
}
