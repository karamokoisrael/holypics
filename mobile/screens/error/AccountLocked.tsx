import { Center } from "native-base";
import React, { Fragment } from "react";
import { View, Text } from "react-native";
import { ComponentWithNavigationProps } from "../../@types/component";
import Layout from "../../components/layout/Layout";

export default function AccountLocked({navigation, route}: ComponentWithNavigationProps) {
  return (
    <Layout navigation={navigation} route={route}>
      <Center alignItems="center" justifyContent="center" height="100%">
        <Text>Account locked</Text>
      </Center>
    </Layout>
  );
}
