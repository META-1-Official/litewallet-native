import _get from 'lodash.get';
import React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { View } from 'react-native';
import { HelperText } from 'react-native-paper';
import PaperTextInput, {
  TextInputProps,
} from 'react-native-paper/src/components/TextInput/TextInput';
import { colors } from '../../styles/colors';
import { tid } from '../../utils';
import { theme, styles } from './Input.styles';

type Props = { name: string; control: any; rules?: UseControllerProps<any>['rules'] } & Omit<
  TextInputProps,
  'theme'
>;

const Input = ({ name, control, rules, ...props }: Props) => {
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
};

export default Input;
