import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import Data from './list.json';

interface Props {
  filter: string;
  select: (s: CountryOption) => void;
}

export function CountryList({ filter, select }: Props) {
  const [data, setData] = useState(Data);
  useEffect(() => {
    const filtered = Data.filter(
      e =>
        e.defaultName.toUpperCase().includes(filter.toUpperCase()) ||
        e.iso2.includes(filter.toUpperCase()) ||
        e.countryCode === filter.replace('+', ''),
    );
    setData(filtered);
  }, [filter]);

  return (
    <ScrollView>
      {data && data.map((e, i) => <Option key={i} data={e} select={select} />)}
    </ScrollView>
  );
}

export type CountryOption = typeof Data[0];

interface OptionPros {
  data: CountryOption;
  select: (opt: CountryOption) => void;
}

function Option({ data, select }: OptionPros) {
  const emoji = String.fromCodePoint(
    ...data.iso2
      .toUpperCase()
      .split('')
      .map(e => 127397 + e.charCodeAt(0)),
  );

  return (
    <TouchableOpacity onPress={() => select(data)}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 12,
          borderColor: '#eee',
          borderBottomWidth: 1,
        }}
      >
        <Text style={{ fontSize: 18 }}>
          {emoji} {data.defaultName}
        </Text>
        <Text style={{ fontSize: 18, fontWeight: '500' }}>+{data.countryCode}</Text>
      </View>
    </TouchableOpacity>
  );
}
