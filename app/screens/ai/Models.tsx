import React, { } from "react";
import { Text } from "react-native-paper";
import useSWR from "swr";
import Layout from "../../components/layout/Layout";
import useStore from "../../stores/store";
export default function Models({ route }) {
  const configs = useStore(state => state.configs);
  const dataCtrl = useSWR("model", async () => {
    try {
      console.log(route);
      
      const data = configs?.models.find((item: { id: any; }) => item.id == route.params.id)
      console.log("model => ");
      console.log(data);
      return data;
    } catch (error) {
      // console.log(error);
      throw new Error("");
    }
  }, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
  });

  return (
    <Layout>
      <Text>{dataCtrl.data?.title}</Text>
    </Layout>
  );
}

