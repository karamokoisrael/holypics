import React, { useState } from "react";
import { Platform, View } from "react-native";
import { Card, Paragraph, Text, Title, Button, ActivityIndicator } from "react-native-paper";
import useSWR from "swr";
import Layout from "../../components/layout/Layout";
import useStore from "../../stores/store";
import tw from '../../helpers/tailwind';
import { formatUrl, safelyGetProp } from "../../helpers/utils";
import I18n from "i18n-js";
import { FULL_WIDTH, WINDOW_HEIGHT } from "../../constants/layout";
import axios from "axios";
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from "@react-navigation/native";

export default function Model({ route }) {
  const navigation = useNavigation();
  const configs = useStore(state => state.configs);
  const [isLoading, setLoadingStatus] = useState(true)
  const dataCtrl = useSWR(`model-${route?.params?.id}`, async () => {
    setLoadingStatus(true)
    try {
      let data = configs?.models.find((item: { id: any; }) => item.id == route?.params?.id)
      if (data == undefined) {
        const req = await axios.get(formatUrl(`items/models/${route?.params?.id}`))
        return req.data.data;
      }
      setLoadingStatus(false)
      return data;
    } catch (error) {
      throw new Error("");
    } finally {
      setLoadingStatus(false)
    }
  }, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
  });

  return (
    <Layout>
      <View style={tw`flex flex-col w-full items-center`}>
        <Card style={{ width: FULL_WIDTH, minHeight: ["android", "ios"].includes(Platform.OS) ? WINDOW_HEIGHT : 320, height: "auto" }}>
          <Card.Title titleVariant="headlineSmall" title={safelyGetProp(dataCtrl?.data, (item: any) => item.translations[0].title)} />
          <Card.Cover style={{ minHeight: 300 }} source={{ uri: formatUrl(`file/${dataCtrl?.data?.thumb}`) }} />
          <Card.Content>
            {
              isLoading ?
                <ActivityIndicator />
                :
                null
            }
            <Title>{safelyGetProp(dataCtrl?.data, (item: any) => item.translations[0].title)}</Title>
            <Paragraph style={tw`p-2`}>{safelyGetProp(dataCtrl?.data, ((item: any) => item.translations[0].description))}</Paragraph>
            <View style={tw`flex flex-row justify-around`}>
              <Button style={{ marginTop: 10 }} onPress={() => {
                if (dataCtrl.data?.available_locally) return navigation.navigate(dataCtrl?.data?.test_url)                
                // @ts-ignore
                if(Platform.OS != "web" ) return navigation.navigate("WebView", { url: dataCtrl?.data?.test_url });
                WebBrowser.openBrowserAsync(dataCtrl?.data?.test_url)                
              }}>Test AI</Button>
              <Button style={{ marginTop: 10 }} onPress={() => WebBrowser.openBrowserAsync(dataCtrl?.data?.doc_url)}>{I18n.t("see_documentation")}</Button>
            </View>
          </Card.Content>


        </Card>

        {
          !isLoading && dataCtrl.data == undefined ?
            <Text style={{ ...tw`ml-2 mt-2` }} variant="titleMedium">No data found</Text> :
            null
        }


      </View>
    </Layout>
  );
}

