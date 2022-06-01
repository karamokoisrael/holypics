import React, { useRef } from "react";
import { Text, useMediaQuery, useToast } from "native-base";

import Layout from "../../components/layout/Layout";
import { ComponentWithNavigationProps } from "../../@types/component";
import { Dimensions } from "react-native";
import useSWR from "swr";
import { Gallery } from "../../@types/gallery";
import useStore from "../../context/store";
import { MAX_SMALL_SCREEN_WIDTH, WINDOW_HEIGHT } from "../../constants/layout";
import { Product } from "../../@types/product";
import { ConditionalSuspense } from "../../components/layout/ConditionalSuspense";

export default function Home({
  navigation,
  route,
}: ComponentWithNavigationProps) {
  const toast = useToast();


  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });

  const screenWidth =
    Dimensions.get("window").width > 1184
      ? 1184
      : Dimensions.get("window").width;

  return (
    <Layout navigation={navigation} route={route}>
      <>
        <ConditionalSuspense condition={isSmallScreen}>
          <Text>lkghj</Text>
        </ConditionalSuspense>
      </>
    </Layout>
  );
}
