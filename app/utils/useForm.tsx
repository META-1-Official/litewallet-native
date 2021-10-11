import React, { useRef } from 'react';
import { StyleSheet, TextStyle,  } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import TextInput, { TextInputProps} from 'react-native-paper/src/components/TextInput/TextInput';
import { colors } from '../styles/colors';

type DefautlStateItem = {
  name: string;
  placeholder: string;
  value?: string;
};

interface InputProps extends Omit<TextInputProps, "theme"> {
  name: string;
}

export default function useForm(defautState: DefautlStateItem[]) {
  const placeholders = Object.fromEntries(defautState.map(e => [e.name, e.placeholder]));

  // Gotta go fast
  const formState = useRef(
    Object.fromEntries(defautState.map(e => [e.name, e.value || ''])),
  ).current;

  const Input: React.FC<InputProps> = props => {

    const theme: typeof DefaultTheme = {
      ...DefaultTheme,
      //@ts-ignore
      colors: {
        primary: colors.BrandYellow,
        accent: colors.BrandYellow,
        text: colors.mutedGray,
      }
    }
    return (
      <TextInput
        {...props}
        placeholderTextColor={colors.mutedGray}
        label={placeholders[props.name]}
        style={[styles.input, props.style]}
        defaultValue={formState[props.name]}
        underlineColor={theme.colors.text}
        theme={theme}
        onChangeText={newText => {
          formState[props.name] = newText;
          //setFormState({ ...formState, [props.name]: newText });
        }}
      />
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
