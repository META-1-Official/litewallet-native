import React from 'react';
import { Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { DexSSP } from '.';
import { ArrowLeft } from 'react-native-feather';
import { DexSend } from '../SendScreen';

export type HeaderProps = {
  title: string;
  titleSubscript?: JSX.Element;
} & DexSSP;
const Header: React.FC<HeaderProps> = ({ title, navigation, titleSubscript }) => {
  const BackButton = ({ color }: { color: string }) => (
    <TouchableOpacity
      style={{ marginHorizontal: 12 }}
      activeOpacity={0.5}
      onPress={() => navigation.navigate('__Tabs')}
    >
      <ArrowLeft width={32} height={32} stroke={color} />
    </TouchableOpacity>
  );
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#1e0000',
        height: (Platform.OS === 'ios' ? 89 : 48) + 8,
        paddingTop: Platform.OS === 'ios' ? 0 : 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <BackButton color="#fff" />
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 20,
            color: '#fff',
            fontWeight: '500',
          }}
        >
          {title}
        </Text>
        {titleSubscript ? titleSubscript : null}
      </View>
      {/* Empty view for space between alignment, mimics back button sizing*/}
      <View style={{ width: 32, height: 32, marginHorizontal: 12 }} />
    </SafeAreaView>
  );
};
const Send: React.FC<DexSSP> = props => {
  return <DexSend {...props} hdr={Header} />;
};

export default Send;
