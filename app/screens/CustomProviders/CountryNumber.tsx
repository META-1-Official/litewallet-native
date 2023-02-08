import React, { SetStateAction, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CountryUS, isoToEmoji } from '../../components/CountryPicker/CountryList';
import { ChevronDown } from 'react-native-feather';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../AuthNav';

interface CountryNumberProp {
  setCountryCode: React.Dispatch<SetStateAction<string>>;
  defaultCode?: string;
}

const CountryNumber = ({ setCountryCode }: CountryNumberProp) => {
  const [country, setCountry] = useState(CountryUS);
  const navigation = useNavigation<RootNavigationProp>();
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#d4d4d4',
        borderStyle: 'solid',
      }}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CountryPickerModal', {
            callback: c => {
              setCountry(c);
              setCountryCode(c.countryCode);
            },
          })
        }
      >
        <View
          style={{
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: 15,
            paddingLeft: 4,
            paddingRight: 4,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              marginRight: 2,
            }}
          >
            {isoToEmoji(country.iso2)} +{country.countryCode}
          </Text>
          <ChevronDown color={'#000'} width={12} height={18} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CountryNumber;
