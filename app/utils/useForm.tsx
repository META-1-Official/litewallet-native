import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { colors } from '../styles/colors';

type DefautlStateItem = {
  name: string;
  placeholder: string;
  value?: string;
};

interface InputProps extends TextInputProps {
  name: string;
}

export default function useForm(defautState: DefautlStateItem[]) {
  const placeholders = Object.fromEntries(defautState.map(e => [e.name, e.placeholder]));

  // Gotta go fast
  const formState = useRef(
    Object.fromEntries(defautState.map(e => [e.name, e.value || ''])),
  ).current;

  const Input: React.FC<InputProps> = props => {
    return (
      <TextInput
        {...props}
        placeholderTextColor={colors.mutedGray}
        placeholder={placeholders[props.name]}
        style={[styles.input, props.style]}
        //value={formState.current[props.name]}
        defaultValue={formState[props.name]}
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
    borderBottomWidth: 1,
    paddingVertical: 12,
    fontSize: 18,
    borderBottomColor: colors.mutedGray,
    marginTop: 8,
  },
});
