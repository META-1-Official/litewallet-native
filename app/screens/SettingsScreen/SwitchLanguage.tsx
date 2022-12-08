import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../styles/colors';

const SwitchLanguage = () => {
  return (
    <SafeAreaView style={{ margin: 18 }}>
      <TouchableOpacity onPress={() => {}}>
        <View
          style={{
            flexDirection: 'row',
            borderColor: colors.BrandYellow,
            borderRadius: 5,
            borderWidth: 1,
            padding: 12,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 18, color: colors.BrandYellow, fontWeight: '500' }}>
            English
          </Text>
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 100,
              backgroundColor: colors.BrandYellow,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{ width: 8, height: 8, borderRadius: 10, backgroundColor: '#000', margin: 5 }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SwitchLanguage;
