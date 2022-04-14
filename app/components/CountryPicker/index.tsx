import { HeaderBackButton } from '@react-navigation/elements';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, TextInput, TextInputProps, SafeAreaView, Platform } from 'react-native';
import { Search } from 'react-native-feather';
import { CountryList } from './CountryList';

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
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <SearchRow navigation={navigation} value={filterText} onChangeText={t => setFilterText(t)} />
      <CountryList select={choose} filter={filterText} />
    </SafeAreaView>
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
          margin: Platform.OS === 'ios' ? 16 : 8,
          borderRadius: 8,
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Search color="#908f95" width={15} height={21} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Search"
          placeholderTextColor="#908f95"
          style={{ fontSize: 15, margin: 0, padding: 0, marginLeft: 2, flex: 1 }}
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
