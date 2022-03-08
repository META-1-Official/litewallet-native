import { NETWORK } from '@env';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextStyle, View } from 'react-native';
import { Circle, TrendingUp } from 'react-native-feather';
import { useStore } from '../store';
import { colors } from '../styles/colors';
import { useAssets } from '../utils/meta1Api';
import { getNotifications, Notification } from '../utils/miscApi';

export default function Notifications() {
  const [notifData, setNotifData] = useState<Notification[]>([]);
  const accountName = useStore(e => e.accountName);
  const accoutnAssets = useAssets();

  useEffect(() => {
    if (NETWORK === 'TESTNET') {
      return;
    }
    getNotifications({ accountName })
      .then(e => setNotifData(e.reverse()))
      .catch(err => console.error(err));
  }, [accountName]);

  if (!notifData.length) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 24, color: '#888' }}>
          No notifications {NETWORK === 'TESTNET' ? '(Disabled for testnet builds)' : ''}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#000' }}>
      <ScrollView>
        {notifData.map(e => {
          const [symbol] = e.content.split(' ');
          const asAsset = accoutnAssets?.assetsWithBalance.find(a => a.symbol === symbol) || null;
          return (
            <View key={e.id} style={{ margin: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={HeadingText}>{e.userId ? 'Account activity' : 'Price alert'}</Text>
                <Circle
                  width={8}
                  height={8}
                  stroke={colors.BrandYellow}
                  fill={colors.BrandYellow}
                />
                <Text style={HeadingText}>
                  {new Date(e.createdAt).toString().split(' ').slice(1, 3).join(' ')}
                </Text>
                {asAsset ? (
                  <Text
                    style={{ marginLeft: 'auto', marginRight: 4, fontSize: 18, color: '#fff' }}
                  >
                    ${asAsset.usdt_value.toFixed(2)}
                  </Text>
                ) : null}
              </View>
              <View style={{ width: '60%', flexDirection: 'row' }}>
                <Text style={{ marginHorizontal: 8, fontSize: 16, color: '#888' }}>
                  <TrendingUp width={18} height={18} color={colors.BrandYellow} /> {e.content}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const HeadingText: TextStyle = {
  fontSize: 21,
  marginHorizontal: 8,
  color: '#fff',
};
