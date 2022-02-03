import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DefaultTheme, HelperText } from 'react-native-paper';
import TextInput, { TextInputProps } from 'react-native-paper/src/components/TextInput/TextInput';
import { getObjectSetter } from '..';
import { colors } from '../../styles/colors';
import { RuleFn } from './rules';
import _get from 'lodash.get';

type DefautlStateItem = {
  name: string;
  lable: string;
  value?: string;
  valid?: boolean;
  rules?: RuleFn[];
};

interface InputProps extends Omit<TextInputProps, 'theme'> {
  name: string;
}

export default function useForm<T extends DefautlStateItem[]>(defautState: T) {
  const lables = Object.fromEntries(defautState.map(e => [e.name, e.lable]));
  const ruleSets = Object.fromEntries(defautState.map(e => [e.name, e.rules]));
  // Gotta go fast

  const formState = useRef(
    Object.fromEntries(defautState.map(e => [e.name, e.value || ''])),
  ).current;

  const valid = useRef(
    Object.fromEntries(defautState.map(e => [e.name, e.valid || false])),
  ).current;
  const setValid = getObjectSetter<typeof valid>(valid);

  const Input: React.FC<InputProps> = ({ name, ...props }) => {
    const theme: typeof DefaultTheme = {
      ...DefaultTheme,
      //@ts-ignore
      colors: {
        primary: colors.BrandYellow,
        accent: colors.BrandYellow,
        text: colors.mutedGray,
      },
    };

    const [error, setError] = useState<string | null>();
    const validate = async () => {
      const rules = ruleSets[name];
      if (!rules) {
        return;
      }

      const promised = await Promise.all(
        rules.map(rule => rule(formState[name], lables[name], formState)),
      );
      const errors: string[] = promised.map(e => (e !== null ? (e as string) : '')).filter(e => e);

      const newErr = errors[0] || null;
      setError(newErr);
      setValid(name, newErr === null);
    };

    return (
      <View style={{ width: _get(props, 'style.width', 'auto') }}>
        <TextInput
          {...props}
          placeholderTextColor={colors.mutedGray}
          label={lables[name]}
          style={[styles.input, props.style, { width: 'auto' }]}
          defaultValue={formState[name]}
          underlineColor={theme.colors.text}
          theme={theme}
          onChangeText={newText => {
            formState[name] = newText;
            validate();
          }}
        />
        <HelperText padding="none" type="error" visible={!!error}>
          {error}
        </HelperText>
      </View>
    );
  };

  return {
    Input,
    formState: formState,
    valid: () => Object.values(valid).reduce((acc, cv) => cv && acc, true),
  };
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
