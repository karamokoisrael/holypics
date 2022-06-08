import useStore from "../../stores/store";
import { formatUrl } from "../../helpers/utils";
import React from "react";
import useSWR, { SWRConfig } from "swr";
import { Restart } from "fiction-expo-restart";
import ErrorBoundary from "react-native-error-boundary";
import {
  Button,
  Text,
  Stack,
  Box,
  HStack,
  Heading,
  Icon,
  Spinner,
  VStack,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { ConditionalSuspense } from "../layout/ConditionalSuspense";
import {
  getJsonData,
  storeJsonData,
} from "../../helpers/local-storage";
import { CONFIG_KEY_NAME } from "../../constants/global";

export type Props = {
  children: JSX.Element;
};

const DataProvider: React.FC<Props> = ({ children }) => {
  const store = useStore();
  const datasets = useStore((state) => state.configs.datasets);

  const configsFetcher = async (...args: Parameters<typeof fetch>) => {
    try {
      const res = await fetch(...args);
      const resJson = await res.json();

      if (resJson.errors !== undefined || resJson.data === undefined)
        throw new Error("No config found");

      await storeJsonData(CONFIG_KEY_NAME, resJson.data);
      store.setConfigs(resJson.data);
      return resJson.data;
    } catch (error) {
      const data = await getJsonData(CONFIG_KEY_NAME);
      console.log(data);
      if (data === null) throw new Error("No local config");
      store.setConfigs(data);
    }
  };

  useSWR(formatUrl("config"), configsFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
  });

  const CustomErrorFallback = (props: {
    error: Error;
    resetError: Function;
  }) => (
    <Box
      alignItems="center"
      justifyContent="space-around"
      flexDirection="column"
      height="100%"
    >
      <Box
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="space-around"
        flexDirection="column"
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700",
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: "gray.50",
        }}
      >
        <Stack p="4" space={3} bg="primary.100">
          <Stack space={2}>
            <Heading size="md" ml="-1" style={{ textAlign: "center" }}>
              <Icon
                name="exclamation-triangle"
                as={FontAwesome}
                marginRight={2}
              ></Icon>
              Erreur
            </Heading>
          </Stack>
          <Text fontWeight="400" style={{ textAlign: "center" }}>
            Nous avons rencontré une erreur lors de l'opération
          </Text>
          <HStack alignItems="center" space={4} justifyContent="space-around">
            <HStack alignItems="center" justifyContent="space-around">
              <Button
                onPress={() => {
                  Restart();
                }}
              >
                Recharger
              </Button>
            </HStack>
          </HStack>
        </Stack>
      </Box>
    </Box>
  );

  const errorHandler = (error: Error, stackTrace: string) => {
    console.log("Handled Error => ", stackTrace, "__", error);
  };

  const Loading = () => (
    <VStack
      height={"100%"}
      width={"100%"}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <HStack space={2} justifyContent="center">
        <Spinner accessibilityLabel="Chargement" />
        <Heading color="primary.500" fontSize="md">
          Chargement
        </Heading>
      </HStack>
    </VStack>
  );

  return (
    // @ts-ignore
    <ErrorBoundary
      onError={errorHandler}
      FallbackComponent={CustomErrorFallback}
    >
      <SWRConfig
        value={{
          refreshInterval: 0,
          fetcher: configsFetcher,
        }}
      >
        <ConditionalSuspense
          condition={datasets.length > 0}
          fallBack={<Loading />}
        >
          {children}
        </ConditionalSuspense>
      </SWRConfig>
    </ErrorBoundary>
  );
};

export default DataProvider;
