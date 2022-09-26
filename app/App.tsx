import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { Provider as PaperProvider } from 'react-native-paper';
import theme from "./constants/theme";
import Navigation from "./components/navigation/Navigation";
import DataProvider from "./components/providers/DataProvider";
import { Fragment } from "react";
import { useFonts } from 'expo-font';
import useStore from "./stores/store";
import { useDeviceContext } from 'twrnc';
import tw from "./helpers/tailwind";
// SplashScreen.preventAutoHideAsync();
  
export default function App() {
  const colorScheme = useStore((state) => state.colorScheme); 
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
