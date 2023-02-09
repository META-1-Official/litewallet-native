import React, { useEffect, useRef, useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { DefaultTheme, HelperText } from 'react-native-paper';
import { tid } from '..';
import { colors } from '../../styles/colors';
import _get from 'lodash.get';
import PaperTextInput, {
  Props as TextInputProps,
} from 'react-native-paper/src/components/TextInput/TextInput';
import { useNavigation } from '@react-navigation/native';
import { ChevronDown, Eye, EyeOff } from 'react-native-feather';
import { RootNavigationProp } from '../../AuthNav';
import { CountryUS, CountryData, isoToEmoji } from '../../components/CountryPicker/CountryList';
import { RuleFn, rule } from './rules';
import TextInputMask from 'react-native-text-input-mask';
import { RenderProps } from 'react-native-paper/src/components/TextInput/types';

const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  //@ts-ignore
  colors: {
    primary: colors.BrandYellow,
    accent: colors.BrandYellow,
    text: colors.mutedGray,
    placeholder: colors.mutedGray,
  },
};

type Props = {
  name: string;
  control: any;
  rules?: UseControllerProps<any>['rules'];
  isDebounced?: boolean;
} & Omit<TextInputProps, 'theme'>;

export function Input({ name, control, rules, ...props }: Props) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    defaultValue: '',
    name,
    rules,
  });

  return (
    <View style={{ width: _get(props, 'style.width', 'auto') }}>
      <PaperTextInput
        {...props}
        placeholderTextColor={colors.mutedGray}
        style={[styles.input, props.style, { width: 'auto' }]}
        underlineColor={theme.colors.text}
        theme={theme}
        {...tid(`useFrom/Input/${name}`)}
        value={field.value}
        onChangeText={field.onChange}
      />
      <HelperText padding="none" type="error" visible={!!error}>
        {error?.message}
      </HelperText>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    //height: 60,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    fontSize: 18,
    //marginTop: 8,
  },
});

const defRule: RuleFn = _t => rule(false, 'Invalid phone number');
interface CommonProps {
  name: string;
  control: any;
}

export function PhoneInput({ name, control }: CommonProps) {
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
    const number = s.replace(/^0+/, '');
    setInternal(number);

    if (onChangeRef.current) {
      onChangeRef.current(`+${country.countryCode} ${number}`);
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
          isDebounced={false}
          rules={{
            required: 'This field is required',
            validate: {
              _: ruleRef.current,
            },
          }}
          render={(props: any) => {
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
}

export function PasswordInput(props: RenderProps) {
  const [visible, setVisible] = useState(true);
  return (
    <View key={123} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TextInput
        {...props}
        {...tid('CreateWallet/password')}
        autoCapitalize={'none'}
        autoCorrect={false}
        style={[props.style, { maxWidth: '88%', paddingRight: 8 }]}
        secureTextEntry={visible}
      />
      <TouchableOpacity {...tid('CreateWallet/copyPassword')} onPress={() => setVisible(!visible)}>
        <View
          style={{
            backgroundColor: colors.BrandYellow,
            marginTop: 14,
            padding: 6,
            borderRadius: 5,
          }}
        >
          {visible ? (
            <EyeOff width={20} height={20} color="#000" />
          ) : (
            <Eye width={20} height={20} color="#000" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
