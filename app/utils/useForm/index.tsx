import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DefaultTheme, HelperText } from 'react-native-paper';
import TextInput, { TextInputProps } from 'react-native-paper/src/components/TextInput/TextInput';
import { getObjectSetter, tid } from '..';
import { colors } from '../../styles/colors';
import { RuleFn } from './rules';
import _get from 'lodash.get';
import throttle from 'lodash.throttle';

type DefautlStateItem = {
  name: string;
  lable: string;
  value?: string;
  valid?: boolean;
  rules?: RuleFn[];
};

export interface InputProps extends Omit<TextInputProps, 'theme'> {
  name: string;
  displayError?: string;
  getRules?: () => RuleFn[];
}
export default function useForm<T extends DefautlStateItem[]>(
  defautState: T,
  updateValidState = true,
) {
  const lables = Object.fromEntries(defautState.map(e => [e.name, e.lable]));
  const ruleSets = Object.fromEntries(defautState.map(e => [e.name, e.rules]));
  // Gotta go fast

  const formState = useRef(
    Object.fromEntries(defautState.map(e => [e.name, e.value || ''])),
  ).current;

  const valid = useRef(
    Object.fromEntries(defautState.map(e => [e.name, e.valid || false])),
  ).current;

  const [validState, setValidState] = useState(false);
  const willBeValid = throttle(() => {
    setTimeout(() => {
      const isValid = Object.values(valid).reduce((acc, cv) => cv && acc, true);
      console.log('REVALIDATE', { isValid });
      updateValidState && setValidState(isValid);
    }, 300);
  }, 750);

  const setValid = getObjectSetter<typeof valid>(valid);

  const Input: React.FC<InputProps> = ({ name, displayError, getRules, ...props }) => {
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

    const [error, setError] = useState<string | null>();

    useEffect(() => {
      if (ruleSets[name] && displayError) {
        console.warn(`Overriding validate behavior for field ${name} with rules`);
      }

      if (ruleSets[name]) {
        return;
      }

      if (displayError) {
        setValid(name, false);
        setError(displayError);
      } else if (error) {
        setValid(name, true);
        setError(null);
      }
    }, [displayError]);

    const validate = async () => {
      const rules = ruleSets[name];
      if ((!rules || !rules.length) && !getRules) {
        return;
      }
      // For some reason `rules` object doesn't get destroy on return
      const _rules = [...rules, ...(getRules?.() || [])];

      for (const rule of _rules) {
        const maybeError = await rule(formState[name], lables[name], formState);
        if (maybeError) {
          setError(maybeError);
          setValid(name, false);
          return;
        }
      }
      setError(null);
      setValid(name, true);
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
          {...tid(`useFrom/Input/${name}`)}
          onChangeText={newText => {
            formState[name] = newText;
            validate();
            willBeValid();
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
    validState,
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
