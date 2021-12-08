import React from 'react';
import { SafeAreaView, Text, View, ViewStyle } from 'react-native';

export default function ExploreAssets() {
  const comm: ViewStyle = {
    borderRadius: 100,
    padding: 8,
    paddingHorizontal: 24,
  };
  return (
    <SafeAreaView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <View style={{ ...comm, backgroundColor: '#10913a' }}>
          <Text style={{ fontSize: 15, fontWeight: '500', color: '#fff' }}>Approved</Text>
        </View>
        <View style={{ ...comm, backgroundColor: '#4e0000' }}>
          <Text style={{ fontSize: 15, fontWeight: '500', color: '#d8404c' }}>Cancelled</Text>
        </View>
        <View style={{ ...comm, backgroundColor: '#422d00' }}>
          <Text style={{ fontSize: 15, fontWeight: '500', color: '#de9135' }}>Pending</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
