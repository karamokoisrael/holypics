import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from 'react-native-paper';
import theme from "./constants/theme";
import Navigation from "./components/navigation";
import DataProvider from "./components/providers/DataProvider";
import { Fragment } from "react";
import useStore from "./stores/store";
import { View } from "react-native";
import { FULL_WIDTH, WINDOW_HEIGHT } from "./constants/layout";
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
  const colorMode = useStore((state) => state.colorMode);
  if (process.env.NODE_ENV !== "development") console.log = () => { }
  // let [fontsLoaded] = useFonts({
  //   Inter_100Thin,
  //   Inter_200ExtraLight,
  //   Inter_300Light,
  //   Inter_400Regular,
  //   Inter_500Medium,
  //   Inter_600SemiBold,
  //   Inter_700Bold,
  //   Inter_800ExtraBold,
  //   Inter_900Black,
  // });

  // if (!fontsLoaded) {
  //   return <></>;
  // }

  return (
    // @ts-ignore
    <PaperProvider theme={{ ...theme, dark: colorMode === "dark" }}>
      <DataProvider>
        <Fragment>
          <StatusBar />
            <Navigation colorMode={colorMode} />
        </Fragment>
      </DataProvider>
    </PaperProvider>
  );
}
