import React, { useRef } from "react";
import {
  Center,
  Heading,
  Stack,
  Text,
  useMediaQuery,
  useToast,
} from "native-base";

import Layout from "../../components/layout/Layout";
import { ComponentWithNavigationProps } from "../../@types/component";
import { Dimensions } from "react-native";
import useSWR from "swr";
import { Gallery } from "../../@types/gallery";
import useStore from "../../stores/store";
import { MAX_SMALL_SCREEN_WIDTH, WINDOW_HEIGHT } from "../../constants/layout";
import { Product } from "../../@types/product";
import { ConditionalSuspense } from "../../components/layout/ConditionalSuspense";
import { MapList } from "../../components/layout/MapList";
import ItemCard, { ItemCardSkeleton } from "../../components/custom/ItemCard";
import { Dataset } from "../../@types/global";
import { getImageUrl } from "../../helpers/utils";

export default function Home({
  navigation,
  route,
}: ComponentWithNavigationProps) {
  const toast = useToast();

  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });
  const datasets = useStore((state) => state.configs.datasets);

  return (
    <Layout navigation={navigation} route={route}>
      <>
        <Stack
          flex={1}
          alignItems={"center"}
          width={"100%"}
          paddingBottom={2}
          justifyContent={"flex-start"}
          direction={isSmallScreen ? "column" : "row"}
          flexWrap={isSmallScreen ? "nowrap" : "wrap"}
          marginTop={7}
          marginBottom={7}
        >
          <Center flexBasis={"50%"}>
            <Heading fontSize={isSmallScreen ? "5xl" : "7xl"} marginBottom={5}>
              IA
            </Heading>
          </Center>

          <Center flexBasis={"50%"}>
            <Text fontSize={isSmallScreen ? "lg" : "xl"} paddingLeft={2}>
              Megamax development est une applicationn permettant de tester en
              beta de nombreux systèmes informatisées dont des intelligences
              artificielles.
            </Text>
          </Center>
        </Stack>

        <Center
          alignItems={"center"}
          justifyContent={"space-around"}
          flexDirection={"row"}
          flexWrap={"wrap"}
          width={"100%"}
        >
          <ConditionalSuspense
            condition={datasets.length !== 0}
            fallBack={
              <MapList
                data={[...Array(8).keys()]}
                render={(key) => <ItemCardSkeleton key={key} />}
              />
            }
          >
            <MapList
              data={datasets}
              render={(dataset: Dataset) => (
                <ItemCard
                  key={dataset.id}
                  image={getImageUrl(dataset.thumb)}
                  text={dataset.name}
                  secondText={dataset.short_description}
                  onPress={()=> {navigation.navigate("DatasetAnalyser", {id: dataset.id})}}
                />
              )}
            />
          </ConditionalSuspense>
        </Center>
      </>
    </Layout>
  );
}
