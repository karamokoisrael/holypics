import { Center, View, Text } from "native-base";
import React, { Fragment } from "react";
import { ComponentWithNavigationProps } from "../../@types/component";
import Layout from "../../components/layout/Layout";

export default function ReinitPassword({navigation, route}: ComponentWithNavigationProps) {
  return (
    <Layout navigation={navigation} route={route}>
      <Center alignItems="center" justifyContent="center" height="100%">
        <Text>Reinit password</Text>
      </Center>
    </Layout>
  );
}
