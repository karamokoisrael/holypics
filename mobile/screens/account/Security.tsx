import { Center, Text, View } from "native-base";
import React, { Fragment } from "react";
import { ComponentWithNavigationProps } from "../../@types/component";
import Layout from "../../components/layout/Layout";

export default function Security({navigation, route}: ComponentWithNavigationProps) {
  return (
    <Layout navigation={navigation} route={route}>
      <Center alignItems="center" justifyContent="center" height="100%">
        <Text>Security</Text>
      </Center>
    </Layout>
  );
}
