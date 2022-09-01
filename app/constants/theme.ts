import { configureFonts, MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
const fontConfig = {
  web: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
  ios: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
  android: {
    regular: {
      fontFamily: 'Global',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Global',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Global',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Global',
      fontWeight: 'normal',
    },
  }
};

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  version: 3,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
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
  // fonts: configureFonts(fontConfig),
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