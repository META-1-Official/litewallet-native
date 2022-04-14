import { HeaderBackButton } from '@react-navigation/elements';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, TextInputProps } from 'react-native';
import { Search } from 'react-native-feather';
import { ScrollView } from 'react-native-gesture-handler';

type CountryPickerParams = {
  CountryPickerModal: {
    callback?: (res: any) => void;
  };
};
type Props = StackScreenProps<CountryPickerParams, 'CountryPickerModal'>;

export function CountryPicker({ navigation, route }: Props) {
  const { callback } = route.params;
  const [filterText, setFilterText] = useState('');
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const choose = () => {
    callback?.('asdfsadf');
    navigation.goBack();
  };

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <SearchRow navigation={navigation} value={filterText} onChangeText={t => setFilterText(t)} />
      <ScrollView>
        <TouchableOpacity onPress={choose}>
          <Text>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={choose}>
          <Text>Close</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={choose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

type SearchRowProps = Pick<TextInputProps, 'value'> &
  Pick<TextInputProps, 'onChangeText'> &
  Pick<Props, 'navigation'>;

function SearchRow({ navigation, value, onChangeText }: SearchRowProps) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{
          backgroundColor: '#dfe0e1',
          padding: 8,
          margin: 16,
          borderRadius: 8,
          flex: 1,
          flexDirection: 'row',
        }}
      >
        <Search color="#908f95" width={15} height={21} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search"
          placeholderTextColor="#908f95"
          style={{ fontSize: 15, marginLeft: 2, flex: 1 }}
        />
      </View>
      <HeaderBackButton
        onPress={() => navigation.goBack()}
        backImage={() => null}
        label="Cancel"
        labelVisible={true}
        labelStyle={{ marginRight: 16 }}
      />
    </View>
  );
}
