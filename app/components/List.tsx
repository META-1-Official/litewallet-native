import React from 'react';
import {
  TouchableOpacity,
  View,
  ViewStyle,
  Text,
  Image,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { ChevronRight } from 'react-native-feather';
import { shadow } from '../utils';

const Img = (src: any) => {
  return (
    <Image
      style={{
        width: 28,
        height: 28,
        margin: 8,
        resizeMode: 'contain',
      }}
      source={src}
    />
  );
};

type ListItemT = React.FC<{
  title: string;
  icon?: any;
  arrow?: boolean;
  separator?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}>;

export const ListItem: ListItemT = ({ title, icon, arrow, separator, onPress }) => {
  let iconToRender = React.isValidElement(icon) ? icon : Img(icon);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.itemTouchable, { borderBottomWidth: separator ? 2 : 0 }]}
    >
      <View style={styles.itemTextContainer}>
        {iconToRender}
        <Text style={styles.itemText}>{title}</Text>
      </View>
      {arrow ? (
        <ChevronRight
          width={32}
          height={32}
          color="#b7bdc5"
          style={{
            marginRight: 12,
          }}
        />
      ) : null}
    </TouchableOpacity>
  );
};

export const List: React.FC<{ style?: ViewStyle }> = ({ style, children }) => {
  return (
    <View style={styles.shadow}>
      <View style={style}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadow: {
    ...shadow.D3,
  },
  itemText: {
    fontSize: 22,
    fontWeight: '400',
    marginLeft: 8,
  },
  itemTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  itemTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#eceef0',
  },
});
