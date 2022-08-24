import React from 'react';
import { Platform, SafeAreaView, Text, View } from 'react-native';
import { ArrowLeft } from 'react-native-feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DexSSP } from '.';
import { tid } from '../../utils';
import TradeScreen from '../Trade/TradeScreen';

type HeaderProps = {
  title: string;
  titleSubscript?: JSX.Element;
} & DexSSP;
const Header: React.FC<HeaderProps> = ({ title, navigation, titleSubscript }) => {
  const BackButton = ({ color }: { color: string }) => (
    <TouchableOpacity
      {...tid('Back')}
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

const DexSwapScreen: React.FC<DexSSP> = props => {
  return (
    <>
      <Header {...props} title="Convert Crypto" />
      <TradeScreen darkMode />
    </>
  );
};
export default DexSwapScreen;
