import React, { Fragment } from "react";
import { Text, View, Center } from "native-base";
import { ComponentWithNavigationProps } from "../../@types/component";
import Layout from "../../components/layout/Layout";

export default function ForgotPassword({
  navigation,
  route,
}: ComponentWithNavigationProps) {
  return (
    <Layout navigation={navigation} route={route}>
      <Center alignItems="center" justifyContent="center" height="100%">
        <Text>Password forgotten</Text>
      </Center>
    </Layout>
  );
}
