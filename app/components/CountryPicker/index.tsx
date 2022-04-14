import { HeaderBackButton } from '@react-navigation/elements';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type CountryPickerParams = {
  CountryPickerModal: {
    callback?: (res: any) => void;
  };
};
type Props = StackScreenProps<CountryPickerParams, 'CountryPickerModal'>;

export function CountryPicker({ navigation, route }: Props) {
  const { callback } = route.params;
  const choose = () => {
    callback?.('asdfsadf');
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      title: 'Choose a Country',
      headerLeft: () => null,
      headerRight: () => {
        return (
          <HeaderBackButton
            onPress={() => navigation.goBack()}
            backImage={() => null}
            label="Close"
            labelVisible={true}
            labelStyle={{ marginRight: 16 }}
          />
        );
      },
    });
  });

  return (
    <View>
      <Text>Choose a Country</Text>

      <TouchableOpacity onPress={choose}>
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  );
}
