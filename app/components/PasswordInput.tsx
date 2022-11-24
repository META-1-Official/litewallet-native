import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Eye, EyeOff, Key } from 'react-native-feather';
import { RenderProps } from 'react-native-paper/src/components/TextInput/types';
import { colors } from '../styles/colors';
import { tid } from '../utils';

function PasswordInput(props: RenderProps) {
  const [visible, setVisible] = useState(true);
  return (
    <View key={123} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Key width={24} height={32} color="#333" strokeWidth={1.5} />
      <TextInput
        {...props}
        {...tid('CreateWallet/passkey')}
        autoCapitalize={'none'}
        autoCorrect={false}
        style={[props.style, { maxWidth: '88%', paddingRight: 8, paddingLeft: 8 }]}
        secureTextEntry={visible}
      />
      <TouchableOpacity {...tid('CreateWallet/copyPasskey')} onPress={() => setVisible(!visible)}>
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

export default PasswordInput;
