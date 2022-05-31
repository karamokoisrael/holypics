import { NativeBaseProvider, extendTheme } from 'native-base';

export const theme = {
  colors: {
    // Add new color
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#da2877',
      exact: '#831843',
    },
    bg: {
      light: "#fff",
      dark: "#1f2937"
    },
    // Redefinig only one shade, rest of the color will remain same.
    amber: {
      400: '#d97706',
    },

    text: {
      50: '#fff',
      200: 'rgb(156, 163, 175)',
      600: '#2c3543'
    }
  },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: 'light',
  },

}


export const darkTheme = {
  dark: true,
  colors: {
    primary: theme.colors.bg.dark,
    background: theme.colors.bg.dark,
    card: theme.colors.bg.dark,
    text: theme.colors.text[50],
    border: theme.colors.bg.dark,
    notification: theme.colors.bg.dark,
  }
};

export const lightTheme = {
  dark: false,
  colors: {
    primary: theme.colors.primary[50],
    background: theme.colors.bg.light,
    card: theme.colors.primary[50],
    text: theme.colors.text[600],
    border: theme.colors.primary[50],
    notification: theme.colors.primary[50],
    // tint: tintColorLight,
    // tabIconDefault: '#ccc',
    // tabIconSelected: tintColorLight,
  }

};
export default extendTheme(theme);