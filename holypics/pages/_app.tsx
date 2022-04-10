import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NativeBaseProvider } from "native-base";
import theme from "../consts/theme";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NativeBaseProvider theme={theme}>
      <Component {...pageProps} />
    </NativeBaseProvider>
  );
}

export default MyApp;
