import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Animated, SafeAreaView, Text, TouchableOpacity } from 'react-native';

type CountryPickerParams = {
  CountryPickerModal: {
    callback?: (res: any) => void;
  };
};
type Props = StackScreenProps<CountryPickerParams, 'CountryPickerModal'>;

export function CountryPicker({ navigation, route }: Props) {
  const { callback } = route.params;

  useEffect(() => {
    navigation.setOptions({ title: 'Choose a Country' });
  });

  return (
    <Animated.View>
      <SafeAreaView>
        <Text>Choose a Country</Text>

        <TouchableOpacity onPress={() => callback?.('asdfafsd')}>
          <Text>Close</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
}
