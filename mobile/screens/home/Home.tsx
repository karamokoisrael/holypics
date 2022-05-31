import React, { useRef } from "react";
import { Text } from "native-base";

import Layout from "../../components/layout/Layout";
import { ComponentWithNavigationProps } from "../../@types/component";
import { Dimensions } from "react-native";
import { ConditionalSuspense } from "../../components/layout/ConditionalSuspense";
import 'dotenv/config';

export default function Home({
  navigation,
  route,
}: ComponentWithNavigationProps) {

  const screenWidth =
    Dimensions.get("window").width > 1184
      ? 1184
      : Dimensions.get("window").width;

  const mainCarouselRef = useRef<any>({
    prev: () => {},
    next: () => {},
  });

  return (
    <Layout navigation={navigation} route={route}>
      <>
        <ConditionalSuspense condition={true}>
          <Text>Hey</Text>
        </ConditionalSuspense>
      </>
    </Layout>
  );
}
