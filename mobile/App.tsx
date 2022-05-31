import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { NativeBaseProvider, Box } from "native-base";
import theme from './constants/theme';
import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';
import DataProvider from './components/providers/DataProvider';
import { Fragment, useEffect, useState } from 'react';
import useStore from './context/store';
export default function App() {
  const isLoadingComplete = useCachedResources();
  const [colorMode,  setColorMode] = useState<"light" | "dark">("light")
  
  useEffect(()=>{
    (async ()=>{
      useStore.subscribe(state=> {
        setColorMode(state.colorMode)
      });
    })()
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <NativeBaseProvider theme={{...theme, config: {...theme.config, initialColorMode: colorMode}}}>
        <DataProvider>
          <Fragment>
            <Navigation colorScheme={colorMode} />        
            <StatusBar />
          </Fragment>
        </DataProvider>
      </NativeBaseProvider>
    );
  }
}
