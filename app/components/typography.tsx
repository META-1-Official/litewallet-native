import React from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import { colors } from "../styles/colors";
interface StyleProp {
  style?: TextStyle,
}
export const Heading: React.FC<StyleProp> = ({style, children}) => {
  return (
    <Text style={[textStyles.heading, style]}>{children}</Text>
  )
}

export const TextSecondary: React.FC<StyleProp> = ({style, children}) => {
  return (
    <Text style={[textStyles.secondary, style]}>{children}</Text>
  )
}
const textStyles = StyleSheet.create({
  heading: {
    fontSize: 28,
    fontWeight: '600',
  },
  secondary: {
    fontSize: 18,
    color: colors.mutedGray,
  },
});