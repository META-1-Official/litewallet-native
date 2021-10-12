import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { DefaultTheme, HelperText } from 'react-native-paper';
import TextInput, { TextInputProps } from 'react-native-paper/src/components/TextInput/TextInput';
import { colors } from '../../styles/colors';
import { RuleFn } from './rules';

type DefautlStateItem = {
  name: string;
  lable: string;
  value?: string;
  rules?: RuleFn[];
};

interface InputProps extends Omit<TextInputProps, 'theme'> {
  name: string;
  onError?: any;
}

export default function useForm(defautState: DefautlStateItem[]) {
  const lables = Object.fromEntries(defautState.map(e => [e.name, e.lable]));
  const ruleSets = Object.fromEntries(defautState.map(e => [e.name, e.rules]));
  // Gotta go fast
  const formState = useRef(
    Object.fromEntries(defautState.map(e => [e.name, e.value || ''])),
  ).current;

  const Input: React.FC<InputProps> = ({ name, onError, ...props }) => {
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
    const validate = () => {
      const rules = ruleSets[name];
      if (!rules) {
        return;
      }

      const errors: string[] = rules
        .map(rule => rule(formState[name], lables[name]))
        .map(e => (e !== null ? (e as string) : ''))
        .filter(e => e);
      setError(errors[0] || null);
    };

    if(onError) {
      useEffect(() => {onError(error)}, [error]);
    }
    
    return (
      <>
        <TextInput
          {...props}
          placeholderTextColor={colors.mutedGray}
          label={lables[name]}
          style={[styles.input, props.style]}
          defaultValue={formState[name]}
          underlineColor={theme.colors.text}
          theme={theme}
          onChangeText={newText => {
            formState[name] = newText;
            validate();
          }}
        />
        {!onError && (
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
        )}
      </>
    );
  };

  return { Input, formState: formState };
}

const styles = StyleSheet.create({
  input: {
    height: 60,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    fontSize: 18,
    marginTop: 8,
  },
});
