import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { NativeBaseProvider } from "native-base";
import theme from "./constants/theme";
import Navigation from "./components/navigation";
import DataProvider from "./components/providers/DataProvider";
import { Fragment } from "react";
import useStore from "./stores/store";
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

export default function App() {
  const colorMode = useStore((state) => state.colorMode);
  let [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  if (!fontsLoaded) {
    return <></>;
  }
  return (
    <NativeBaseProvider
      theme={{
        ...theme,
        config: { ...theme.config, initialColorMode: colorMode },
      }}
    >
      <DataProvider>
        <Fragment>
          <Navigation />
          <StatusBar />
        </Fragment>
      </DataProvider>
    </NativeBaseProvider>
  );
}
