import React, { useEffect, useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { tid } from '../utils';

interface Props {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  styles?: StyleProp<ViewStyle & TextStyle>;
  disabled?: boolean;
}

const RoundedButton = ({ title, onPress, styles: propStyles, disabled }: Props) => {
  const colorRef = useRef(new Animated.Value(disabled ? 0 : 150));

  useEffect(() => {
    if (disabled) {
      Animated.timing(colorRef.current, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(colorRef.current, {
        toValue: 150,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [disabled]);

  const color = colorRef.current.interpolate({
    inputRange: [0, 150],
    outputRange: ['rgb(150,172,183)', 'rgb(255, 192, 0)'],
  });

  return (
    <View style={[styles.container, propStyles]}>
      <TouchableOpacity
        {...tid(`RoundedButton/${title}`)}
        activeOpacity={0.5}
        onPress={onPress}
        disabled={disabled}
      >
        <Animated.View style={[styles.SubmitButtonStyle, { backgroundColor: color }, propStyles]}>
          <Text style={[styles.TextStyle, propStyles]}> {title} </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  SubmitButtonStyle: {
    padding: 12,
    marginHorizontal: 24,
    marginVertical: 8,
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
