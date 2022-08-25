import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'react-native-feather';
import TextInputMask from 'react-native-text-input-mask';
import { RootNavigationProp } from '../App';
import { rule, RuleFn } from '../constants/formRules';
import Input from '../components/Input/Input';
import { tid } from '../utils';
import { CountryData, CountryUS, isoToEmoji } from './CountryPicker/CountryList';

interface CommonProps {
  name: string;
  control: any;
}

const defRule: RuleFn = _t => rule(false, 'Invalid phone number');

const PhoneInput = ({ name, control }: CommonProps) => {
  const navigation = useNavigation<RootNavigationProp>();
  const [country, setCountry] = useState(CountryUS);
  const [internalValue, setInternal] = useState('');
  const [mask, setMask] = useState('');
  const ruleRef = useRef<RuleFn>(defRule);

  useEffect(() => {
    const prefix = '\\+' + country.countryCode;
    if (country.patterns) {
      const zeros = country.patterns[0].replace(/X/g, '0');
      const brackets = zeros.replace(/ /g, '] [');
      setMask(`[${brackets}]`);

      // Convert from XXXX XXXX pattern to regex compatible string
      // like (\d\d\d\d \d\d\d\d)
      const patterns = country.patterns
        .map(e => e.replace(/X/gm, '\\d'))
        .map(e => `(${e})`)
        .join('|');

      const re = new RegExp(`${prefix} (${patterns})$`);

      //  prettier-ignore
      const newRule: RuleFn = (t) =>
        rule(re.test(t), 'This should be a valid phone number');

      ruleRef.current = newRule;
    } else {
      ruleRef.current = defRule;
      setMask(`[${'0'.repeat(12)}]`);
    }
  }, [country]);

  // const Input = component;
  const onChangeRef = useRef<(s: string) => void | undefined>();
  const valRef = useRef<string | undefined>();

  // TextInputMaskProps.onChangeText?: (formatted: string, extracted?: string | undefined)
  // _pad -> fills the extracted arg to allow ass to add prog argument
  // prog: bool -> is the event rased programmatically, if so don't set the error
  const onChangeText = (s: string) => {
    setInternal(s);

    if (onChangeRef.current) {
      onChangeRef.current(`+${country.countryCode} ${s}`);
    }
  };

  useEffect(() => {
    // Wait for a bit, do the on change when all refs will be updated
    setTimeout(() => valRef.current && onChangeText(''), 50);
  }, [country.countryCode]);

  useEffect(() => {
    if (country.prefixes) {
      // If phone number not starts with prefix.
      // If internal value is shorter than prefix
      //    make sure they are start the same.
      const prefix = country.prefixes.find(e =>
        internalValue.startsWith(e.slice(0, internalValue.length)),
      );

      if (!prefix) {
        // Find and select fallback
        const fallback = CountryData.find(
          e => e.countryCode === country.countryCode && !e.prefixes,
        );
        // Set US if no fallback
        setCountry(fallback || CountryUS);
      }
    }
  }, [internalValue]);

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('CountryPickerModal', { callback: c => setCountry(c) })}
        style={{ marginRight: 8 }}
      >
        <View style={{ flex: 0.35, marginTop: 28, flexDirection: 'row' }}>
          <Text style={{ fontSize: 18, marginRight: 2 }}>
            {isoToEmoji(country.iso2)} +{country.countryCode}
          </Text>
          <ChevronDown color={'#000'} width={12} height={24} />
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Input
          control={control}
          name={name}
          style={{ width: '100%' }}
          label="Mobile Number"
          rules={{
            required: 'This field is required',
            validate: {
              _: ruleRef.current,
            },
          }}
          render={props => {
            onChangeRef.current = props.onChangeText;
            valRef.current = props.value;
            return (
              //@ts-ignore
              <TextInputMask
                {...props}
                {...tid('CreateWallet/phoneNum')}
                onChangeText={onChangeText}
                value={props.value?.replace(`+${country.countryCode}`, '').trim()}
                mask={mask}
                keyboardType="phone-pad"
                maxLength={12}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default PhoneInput;
