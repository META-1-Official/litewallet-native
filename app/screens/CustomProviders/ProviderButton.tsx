import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ProviderButton = ({ name }: any) => {
  return (
    <View
      style={{
        width: '80%',
        marginTop: 20,
        backgroundColor: '#fff',
        height: '6%',
        borderRadius: 5,
      }}
    >
      <TouchableOpacity style={{ alignItems: 'center', padding: 10 }}>
        <Text style={{ opacity: 0.5, fontSize: 16 }}>{`Continue with ${name}`}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProviderButton;
