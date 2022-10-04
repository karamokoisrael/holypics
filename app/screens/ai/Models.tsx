import React, {  } from "react";
import { Text } from "react-native-paper";
import useSWR from "swr";
import Layout from "../../components/layout/Layout";
import useStore from "../../stores/store";
export default function Models() {
  const configs = useStore(state => state.configs);
  const dataCtrl = useSWR("models", async (...args: any) => {
    // const data = configs.models.find((item: any) => item.id == route.params?.id);
    // if (data == undefined) throw new Error("No data");
    // return data;
    return {}
  }, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
  });

  return (
    <Layout>
      <Text>StableDiffusion</Text>
    </Layout>
  );
}

