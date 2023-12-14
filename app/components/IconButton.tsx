import React, { FC } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  iconName: string;
  iconColor?: string;
  iconSize?: number;
  isDisabled?: boolean;
  onClick?: () => void;
  style?: StyleProp<ViewStyle>;
}

const IconButton: FC<Props> = ({
  onClick,
  isDisabled = false,
  style,
  iconName,
  iconSize,
  iconColor,
}) => {
  const handlePress = () => {
    console.log('isDisabled');
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <TouchableOpacity
      style={{ padding: 0, margin: 0 }}
      activeOpacity={isDisabled ? 1 : undefined}
      onPress={handlePress}
      onMagicTap={handlePress}
      disabled={isDisabled}
    >
      <View style={[style, { opacity: isDisabled ? 0.5 : 1 }]}>
        <Icon name={iconName} size={iconSize} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
};

export default IconButton;
