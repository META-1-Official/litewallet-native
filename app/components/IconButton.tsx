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
    if (!isDisabled && onClick) {
      onClick();
    }
  };

  return (
    <View style={[style, { opacity: isDisabled ? 0.7 : 1 }]}>
      <TouchableOpacity
        activeOpacity={isDisabled ? 1 : undefined}
        onPress={handlePress}
        disabled={isDisabled}
      >
        <Icon name={iconName} size={iconSize} color={iconColor} />
      </TouchableOpacity>
    </View>
  );
};

export default IconButton;
