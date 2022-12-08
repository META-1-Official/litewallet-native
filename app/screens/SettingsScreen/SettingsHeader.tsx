import React from 'react';
import { Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import { tid } from '../../utils';
import { id2name } from './AccountGroup';

const BackButton = ({ color, navigation }: { color: string; navigation: any }) => (
  <TouchableOpacity
    {...tid('Back')}
    style={{ marginHorizontal: 12 }}
    activeOpacity={0.5}
    onPress={navigation.goBack}
  >
    <ArrowLeft width={32} height={32} stroke={color} />
  </TouchableOpacity>
);

// @ts-ignore
const SettingsHeader = ({ navigation, route }) => {
  const title = id2name(route.name) || 'Settings';
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#000',
        height: (Platform.OS === 'ios' ? 89 : 48) + 8,
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <BackButton color="#fff" navigation={navigation} />
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
};

export default SettingsHeader;
