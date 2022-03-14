import React from 'react';
import {
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors } from '../styles/colors';
import { tid } from '../utils';

interface Props {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  styles?: StyleProp<ViewStyle & TextStyle>;
}

const RoundedButton = ({ title, onPress, styles: propStyles }: Props) => {
  return (
    <TouchableOpacity
      {...tid(`RoundedButton/${title}`)}
      style={[styles.SubmitButtonStyle, propStyles]}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <Text style={[styles.TextStyle, propStyles]}> {title} </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  SubmitButtonStyle: {
    alignSelf: 'stretch',
    padding: 12,
    marginHorizontal: 24,
    marginVertical: 8,
    backgroundColor: colors.BrandYellow,
    borderRadius: 10000,
    borderWidth: 1,
    borderColor: '#fff',
  },

  TextStyle: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default RoundedButton;
