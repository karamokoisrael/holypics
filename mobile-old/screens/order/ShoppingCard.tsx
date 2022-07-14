import { FontAwesome5 } from "@expo/vector-icons";
import { Center, Icon, Text } from "native-base";
import React from "react";
import { ComponentWithNavigationProps } from "../../@types/component";
import Layout from "../../components/layout/Layout";
import { WINDOW_HEIGHT } from "../../constants/layout";

export default function ShoppingCard({navigation, route}: ComponentWithNavigationProps) {
  return (
    <Layout navigation={navigation} route={route}>
      <Center alignItems="center" justifyContent="center" height={WINDOW_HEIGHT}>
        <Text fontSize={"xl"} textAlign={'center'}><Icon as={FontAwesome5} name="wrench"/> Section "Panier" en construction</Text>
      </Center>
    </Layout>
  );
}

