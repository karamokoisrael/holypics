import { configureFonts, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import tw from "../helpers/tailwind";

const _fontConfig = {
  regular: {
    fontFamily: 'Global-Font',
    fontWeight: 'normal',
  },
  medium: {
    fontFamily: 'Global-Font',
    fontWeight: 'normal',
  },
  light: {
    fontFamily: 'Global-Font',
    fontWeight: 'normal',
  },
  thin: {
    fontFamily: 'Global-Font',
    fontWeight: 'normal',
  },
};

const fontConfig = {
  // web: _fontConfig,
  // ios: _fontConfig,
  // android: _fontConfig,
  default: _fontConfig,
};

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    background: tw.color('bg-gray-100'),
    onBackground: tw.color('bg-gray-100'),
    onbb: tw.color('bg-gray-100'),
    primary: '#e94256',
    primaryOpac: "#ffdde1",
    secondary: '#96cc6a',
    tertiary: '#4527a0',
    headerControls: "#fff",
    primary10: "#222835",
    success: "#28a745",
    warning: "#ffc107",
    info: "#17a2b8",
    gray: "#6c757d",
    danger: "#dc3545",
    dark: "#343a40",
    light: "#f8f9fa",
    white: "#fff",
    chip: "#ebdefa",
    transparent: "#fff0"
  },
  // @ts-ignore
  fonts: configureFonts(fontConfig),
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.background,
    text: theme.colors.headerControls,
    border: theme.colors.dark,
    notification: theme.colors.primary,
  }
};

export const lightTheme = {
  dark: false,
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.background,
    card: theme.colors.primary,
    text: theme.colors.headerControls,
    border: theme.colors.transparent,
    notification: theme.colors.primary,
    tint: theme.colors.headerControls,
    headerTintColor: theme.colors.headerControls,
  }

};

export default theme;