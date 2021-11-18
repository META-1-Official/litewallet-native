import React from 'react';
import { Text, View } from 'react-native';
import { ArrowDownRight, ArrowUpLeft, Maximize2 } from 'react-native-feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DexSSP } from '../screens/dex';
import { colors } from '../styles/colors';

const DexModal: React.FC<DexSSP> = ({ navigation }) => {
  return (
    <View style={{ height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.35)' }}>
      <TouchableOpacity
        style={{
          height: '55%',
        }}
        onPress={() => navigation.goBack()}
      />
      <View
        style={{
          height: '45%',
          backgroundColor: '#330000',
          padding: 24,
          paddingTop: 8,
          alignItems: 'flex-start',
          justifyContent: 'space-evenly',
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate('DEX__Convert')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Maximize2 width={32} height={32} color="#fff" />
            <View style={{ marginLeft: 24 }}>
              <Text
                style={{
                  fontSize: 22,
                  color: '#fff',
                  fontWeight: '600',
                }}
              >
                Convert
              </Text>
              <Text
                style={{
                  color: colors.BrandYellow,
                  fontWeight: '500',
                  fontSize: 16,
                }}
              >
                Covert one crypto to another
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DEX__Send')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ArrowUpLeft width={32} height={32} color="#fff" />
            <View style={{ marginLeft: 24 }}>
              <Text
                style={{
                  fontSize: 22,
                  color: '#fff',
                  fontWeight: '600',
                }}
              >
                Send
              </Text>
              <Text
                style={{
                  color: colors.BrandYellow,
                  fontWeight: '500',
                  fontSize: 16,
                }}
              >
                Send crypto to another wallet
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DEX__Recive')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ArrowDownRight width={32} height={32} color="#fff" />
            <View style={{ marginLeft: 24 }}>
              <Text
                style={{
                  fontSize: 22,
                  color: '#fff',
                  fontWeight: '600',
                }}
              >
                Receive
              </Text>
              <Text
                style={{
                  color: colors.BrandYellow,
                  fontWeight: '500',
                  fontSize: 16,
                }}
              >
                Receive crypto from another wallet
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DexModal;
