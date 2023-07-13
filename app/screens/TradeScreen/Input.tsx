import React, { useContext, useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { InputProps } from './types';
import ErrorContext from './ErrorContext';

const Input = (props: InputProps) => {
  const { validate, onChange, ...inputProps } = props;
  const [err, setErr] = useState(false);

  // This is surprisingly effective
  const { errors, setErrors } = useContext(ErrorContext);
  useEffect(() => {
    err ? setErrors([...errors, true]) : setErrors([...errors.slice(0, -1)]);
  }, [err]);

  useEffect(() => {
    if (props.value) {
      setErr(!validate(props.value));
    }
  }, [props.value]);

  const _onChange = (t: string, v: boolean) => {
    console.log('valid', v);
    setErr(!v);
    onChange(t, v);
  };

  const errorHighlight = err ? { color: 'red' } : {};
  inputProps.style = [inputProps.style || {}, errorHighlight];

  return (
    <TextInput maxLength={20} {...inputProps} onChangeText={t => _onChange(t, validate(t))} />
  );
};

export default Input;
