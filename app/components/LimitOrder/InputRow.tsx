import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Minus, Plus } from 'react-native-feather';
import { colors } from '../../styles/colors';
import { tid } from '../../utils';

interface InputRowProps {
  title: string;
  value: string;
  onChange?: (s: string) => void;
  onInc?: () => void;
  onDec?: () => void;
}
const InputRow: React.FC<InputRowProps> = ({ title, value, onChange, onInc, onDec }) => {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        borderBottomColor: '#fff3',
        paddingBottom: 12,
        marginBottom: 12,
      }}
    >
      <Text style={{ color: colors.BrandYellow }}>{title}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TextInput
          {...tid('LimitOrder/InputRow/TextInput')}
          style={{
            color: '#fff',
            fontSize: 28,
            fontWeight: 'bold',
            flex: 1,
          }}
          value={value}
          keyboardType="numeric"
          editable={!!onChange}
          onChangeText={onChange}
        />
        <View style={{ flexDirection: 'row' }}>
          {onInc && onDec ? (
            <>
              <TouchableOpacity
                {...tid('LimitOrder/InputRow/Minus')}
                onPress={() => onDec?.()}
                style={{
                  backgroundColor: '#481400',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 5,
                  margin: 4,
                }}
              >
                <Minus width={28} height={28} color={colors.BrandYellow} />
              </TouchableOpacity>
              <TouchableOpacity
                {...tid('LimitOrder/InputRow/Plus')}
                onPress={() => onInc?.()}
                style={{
                  backgroundColor: '#481400',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 5,
                  margin: 4,
                }}
              >
                <Plus width={28} height={28} color={colors.BrandYellow} />
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default InputRow;
