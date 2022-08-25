import { StyleSheet } from 'react-native';
import { DefaultTheme } from 'react-native-paper';
import { colors } from '../../styles/colors';

export const theme: typeof DefaultTheme = {
  ...DefaultTheme,
  //@ts-ignore
  colors: {
    primary: colors.BrandYellow,
    accent: colors.BrandYellow,
    text: colors.mutedGray,
    placeholder: colors.mutedGray,
  },
};

export const styles = StyleSheet.create({
  input: {
    //height: 60,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    fontSize: 18,
    //marginTop: 8,
  },
});
