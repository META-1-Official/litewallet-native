import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Provider = ({ item }: any) => {
  return (
    <View style={{ padding: 5 }}>
      <Icon.Button
        name={item}
        backgroundColor="#fff"
        color="#000"
        style={{ width: 80, height: 60, justifyContent: 'center' }}
      />
    </View>
  );
};

export default Provider;
