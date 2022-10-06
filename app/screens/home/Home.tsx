import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { ActivityIndicator, Button, Searchbar, Text } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { useNavigation } from "@react-navigation/native";
import tw from '../../helpers/tailwind';
import useStore from "../../stores/store";
import useSWR from "swr";
import environment from "../../constants/environment";
import { formatUrl } from "../../helpers/utils";
import { FULL_WIDTH } from "../../constants/layout";
import { OnlyForWeb } from "../../components/layout/PlateformTweaks";
import { truncate } from "lodash";
import axios from "axios";

export default function Home() {
  const navigation = useNavigation();
  const onBoardingPassed = useStore(state => state.onBoardingPassed);
  useEffect(() => {
    if (!onBoardingPassed) navigation.navigate("OnBoarding");
  }, [onBoardingPassed])
  const [searchText, setSearchText] = useState("");
  const pageRef = useRef(1);
  const limitRef = useRef(2);
  const [loading, setLoadingStatus] = useState(true);
  const configs = useStore(state => state.configs);

  const dataCtrl = useSWR("models", async () => {
    try {
      setLoadingStatus(true)
      const limit = 6
      const query: Record<string, any> = { filter: { status: "published" }, page: pageRef.current, limit, meta: "*" };
      if (searchText != "") query.search = searchText;
      const models = await axios.get(formatUrl("items/models"), {
        params: query
      })


      limitRef.current = Math.round(models.data.meta.filter_count / limit)

      setLoadingStatus(false);
      let data = dataCtrl.data && searchText == "" ? dataCtrl.data : []
      return [...data, ...models.data.data];
    } catch (error) {
      console.log(error);
      setLoadingStatus(false);
      throw new Error("");
    }
  }, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
  });
  return (
    <Layout>
      <View style={tw`flex flex-col w-full items-center`}>
        <View style={tw`flex flex-col justify-around items-start mt-5`}>
          <Text style={{ ...tw`ml-2 mb-10 font-bold`, fontSize: 30 }}>What are you looking for ?</Text>
          <Searchbar
            style={tw`w-full`}
            placeholder="I am looking for"
            value={searchText}
            onChangeText={(text: string) => {
              setSearchText(text)
              if (text == "") {
                pageRef.current = 1;
                limitRef.current = 2;
                dataCtrl.mutate();
              }
            }}
            onIconPress={() => {
              pageRef.current = 1;
              limitRef.current = 2;
              dataCtrl.mutate();
            }}
          />
        </View>
        <View style={tw`flex flex-col justify-around items-start mt-5`}>
          <View style={tw`mb-5 flex items-center flex-row w-full`}>
            <Text style={{ ...tw`ml-2 mr-2 font-bold` }} variant="headlineSmall">Models</Text>
            {
              loading ?
                <ActivityIndicator /> :
                null
            }
          </View>

          <OnlyForWeb forceRendering={true}>
            {
              <View style={{ width: FULL_WIDTH, ...tw`flex flex-wrap flex-row justify-around` }}>
                {
                  dataCtrl.data?.map((model: Record<string, any>, key) => (
                    // @ts-ignore
                    <TouchableOpacity key={`${key}${model.id}`} onPress={() => navigation.navigate("Model", { id: model.id })}>
                      <View key={model.id} style={tw`bg-white w-[180px] min-h-[220px] rounded-lg flex justify-center items-center bg-white mb-2`}>
                        <Image style={tw`w-[160px] h-[160px] rounded-lg mt-2 mb-2`} source={{ uri: `${environment.apiUrl}/file/${model.thumb}` }} />
                        <View style={tw`flex justify-start w-full`}>
                          <Text variant="titleMedium" style={tw`font-bold ml-5`}>{truncate(model?.translations[0].title, { length: 20 })}</Text>
                          <Text variant="titleMedium" style={tw`font-thin ml-5 text-gray-400 pr-5`}>{truncate(model.tags?.join(" "), { length: 30 })}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                }
              </View>
            }
          </OnlyForWeb>
          {/* <OnlyForMobile>
            <View style={{ width: FULL_WIDTH, ...tw`flex flex-wrap flex-row justify-around` }}>
              <FlatList
                data={dataCtrl.data || []}
                renderItem={(model: any) => (
                  // @ts-ignore
                  <TouchableOpacity key={`${model.id}`} onPress={() => navigation.navigate("Models", { id: model.id })}>
                    <View key={model.id} style={tw`bg-white w-[180px] rounded-lg flex justify-center items-center bg-white`}>
                      <Image style={tw`w-[160px] h-[160px] rounded-lg mt-2`} source={{ uri: `${environment.apiUrl}/file/${model.thumb}` }} />
                      <View style={tw`flex justify-start w-full`}>
                        <Text variant="titleMedium" style={tw`font-bold ml-5`}>{model?.title}</Text>
                        <Text variant="titleMedium" style={tw`font-thin ml-5 text-gray-400 pr-5`}>{model.tags?.join(" ")}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.toString()}
                onStartReached={() => new Promise<void>((resolve, reject) => resolve())} // required, should return a promise
                onEndReached={() => new Promise<void>((resolve, reject) => resolve())} // required, should return a promise
                showDefaultLoadingIndicators={true} // optional
                onStartReachedThreshold={10} // optional
                onEndReachedThreshold={10} // optional
                activityIndicatorColor={'black'} // optional
                HeaderLoadingIndicator={() => <ActivityIndicator />} // optional
                FooterLoadingIndicator={() => <ActivityIndicator />}// optional
                enableAutoscrollToTop={false} // optional | default - false
              />
            </View>
          </OnlyForMobile> */}
          {
            !loading && dataCtrl.data?.length == 0 ?
              <Text style={{ ...tw`ml-2` }} variant="labelMedium">No data found</Text> :
              null
          }
          <View style={tw`mt-10 flex items-center flex-row w-full`}>
            <OnlyForWeb>
              <Button disabled={pageRef.current >= limitRef.current} onPress={() => {
                pageRef.current = pageRef.current + 1
                dataCtrl.mutate()
              }}>Load more</Button>
            </OnlyForWeb>

            {
              loading ?
                <ActivityIndicator /> :
                null
            }
          </View>
        </View>
      </View>
    </Layout>
  );
}


