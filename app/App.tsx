import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from 'react-native-paper';
import theme from "./constants/theme";
import Navigation from "./components/navigation";
import DataProvider from "./components/providers/DataProvider";
import { Fragment, useEffect } from "react";
import { useFonts } from 'expo-font';
import useStore from "./stores/store";
import { useAppColorScheme, useDeviceContext } from 'twrnc';
import tw from "./helpers/tailwind";
import * as SplashScreen from 'expo-splash-screen';
// SplashScreen.preventAutoHideAsync();
// import {
//   useFonts,
//   Inter_100Thin,
//   Inter_200ExtraLight,
//   Inter_300Light,
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_600SemiBold,
//   Inter_700Bold,
//   Inter_800ExtraBold,
//   Inter_900Black,
// } from "@expo-google-fonts/inter";

export default function App() {
  const colorScheme = useStore((state) => state.colorScheme);
  // useDeviceContext(tw); 
  useDeviceContext(tw, { withDeviceColorScheme: false });
  if (process.env.NODE_ENV !== "development") console.log = () => { }
  const [fontsLoaded] = useFonts({
    'Global-Fam': require('./assets/fonts/Lobster/Lobster-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <PaperProvider theme={{ ...theme, dark: colorScheme === "dark" }}>
      <DataProvider>
        <Fragment>
          <StatusBar />
          <Navigation colorScheme={colorScheme} />
        </Fragment>
      </DataProvider>
    </PaperProvider>
  );
}
