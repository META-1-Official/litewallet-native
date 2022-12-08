import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'react-native-feather';
import { tid } from '../../utils';
const ListItem = ({
  onPress,
  text,
  color,
}: {
  onPress: () => void;
  text: string;
  color?: string;
}) => (
  <TouchableOpacity {...tid(`Settings/ListItem/${text}`)} onPress={onPress}>
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
      }}
    >
      <Text style={{ color: color || '#fff', fontSize: 18 }}>{text}</Text>
      <ChevronRight color={color || '#fff'} />
    </View>
  </TouchableOpacity>
);

export default ListItem;
