import { View } from "react-native";
import { Text } from "react-native-paper";
import React from "react";
import Layout from "../../components/layout/Layout";
import tw from '../../helpers/tailwind';
import { WINDOW_HEIGHT } from "../../constants/layout";

export default function Account() {
  return (
    <Layout>
      <View style={{height: WINDOW_HEIGHT, ...tw`w-full flex items-center justify-center`}}>
        <Text variant="headlineMedium">Page under construction</Text>
      </View>
    </Layout>
  );
}
