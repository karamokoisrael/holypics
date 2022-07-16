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

  const configs = useSWR(formatUrl("config"), async (...args: Parameters<typeof fetch>) => {
    try {
      
      const res = await fetch(...args);
      const resJson = await res.json();

      if (resJson.errors !== undefined || resJson.data === undefined || Object.keys(resJson.data).length == 0)
        throw new Error("No config found");

      await storeJsonData(CONFIG_KEY_NAME, resJson.data);

      store.setConfigs(resJson.data);
      return resJson.data;
    } catch (error) {
      
      const data = await getJsonData(CONFIG_KEY_NAME);
      if (data === null || Object.keys(data).length === 0) throw new Error("No local config");
      store.setConfigs(data);

      return data;
    }
  }, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
  });


  return (
    // @ts-ignore
    <ErrorBoundary
      onError={errorHandler}
      FallbackComponent={CustomErrorFallback}
    >
      <SWRConfig>
        <ConditionalSuspense
          condition={configs.data != undefined && Object.keys(configs.data).length != 0}
          fallBack={<Loader />}
        >
          {children}
        </ConditionalSuspense>
      </SWRConfig>
    </ErrorBoundary>
  );
};

export default DataProvider;
