import useStore from "../../stores/store";
import { formatUrl } from "../../helpers/utils";
import React from "react";
import useSWR, { SWRConfig } from "swr";
import ErrorBoundary from "react-native-error-boundary";
import { ConditionalSuspense } from "../layout/ConditionalSuspense";
import {
  getJsonData,
  storeJsonData,
} from "../../helpers/local-storage";
import { CONFIG_KEY_NAME } from "../../constants/global";
import CustomErrorFallback, { errorHandler } from "../custom/Error";
import Loader from "../custom/Loader";
import i18n from 'i18n-js';
import { translations } from "../../constants/translations";
// import * as Localization from 'expo-localization';
i18n.translations = translations;
// Set the locale once at the beginning of your app.
// i18n.locale = Localization.locale;

type DataProviderProps = {
  children: JSX.Element;
};
const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const store = useStore();

  
  const configsFetcher = async (...args: Parameters<typeof fetch>) => {
    try {
      return {};
      // const res = await fetch(...args);
      // const resJson = await res.json();

      // if (resJson.errors !== undefined || resJson.data === undefined)
      //   throw new Error("No config found");

      // await storeJsonData(CONFIG_KEY_NAME, resJson.data);
      // store.setConfigs(resJson.data);
      // return resJson.data;
    } catch (error) {
      const data = await getJsonData(CONFIG_KEY_NAME);
      if (data === null) throw new Error("No local config");
      store.setConfigs(data);
    }
  };

  useSWR(formatUrl("config"), configsFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
  });

 




  return (
    // @ts-ignore
    <ErrorBoundary
      onError={errorHandler}
      FallbackComponent={CustomErrorFallback}
    >
      <SWRConfig
        value={{
          refreshInterval: 0,
          revalidateOnFocus: false,
          fetcher: configsFetcher,
        }}
      >
        <ConditionalSuspense
          condition={true}
          fallBack={<Loader />}
        >
          {children}
        </ConditionalSuspense>
      </SWRConfig>
    </ErrorBoundary>
  );
};

export default DataProvider;
