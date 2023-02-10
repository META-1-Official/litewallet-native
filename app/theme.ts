import { extendTheme } from 'native-base';

const newColorTheme = {
  brand: {
    900: '#8287af',
    800: '#7c83db',
    700: '#b3bef6',
  },
};

const theme = extendTheme({
  colors: newColorTheme,
  components: {
    Button: {},
  },
});

type ThemeType = typeof theme;

declare module 'native-base' {
  interface ITheme extends ThemeType {}
}

export default theme;
