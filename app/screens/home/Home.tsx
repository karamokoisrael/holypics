import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Image, RefreshControl, Platform } from "react-native";
import { ActivityIndicator, Button, Searchbar, Text } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { useNavigation } from "@react-navigation/native";
import tw from '../../helpers/tailwind';
import useStore from "../../stores/store";
import useSWR from "swr";
import environment from "../../constants/environment";
import { formatUrl, safelyGetProp } from "../../helpers/utils";
import { FULL_WIDTH, SMALL_SCREEN } from "../../constants/layout";
import { OnlyForWeb } from "../../components/layout/PlateformTweaks";
import { truncate } from "lodash";
import axios from "axios";
import { FlatList } from "react-native-gesture-handler";

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
  const fetcher = async (key: string) => {
    try {
      setLoadingStatus(true)
      const limit = 4
      const query: Record<string, any> = { filter: { status: "published" }, page: pageRef.current, limit, meta: "*" };
      if (searchText != "") query.search = searchText;
      const models = await axios.get(formatUrl("items/models"), {
        params: query
      })
      limitRef.current = Math.round(models.data.meta.filter_count / limit)
      let data = dataCtrl.data ? dataCtrl.data : []
      setLoadingStatus(false);
      if(key == "reset") return models.data.data;
      return [...data, ...models.data.data];
    } catch (error) {
      console.log(error);
      setLoadingStatus(false);
      throw new Error("");
    }
  }

  const dataCtrl = useSWR("models", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
  });
  return (
    <Layout noScrollView>
      <View style={tw`flex flex-col w-full items-center`}>

        <View style={tw`flex flex-col justify-around items-start`}>
          <FlatList
            ListHeaderComponent={() => (
              <View style={tw`flex flex-col justify-around items-start mt-5`}>
                <Text style={{ ...tw`ml-2 mb-10 font-bold text-center text-[30px]` }}>What are you looking for ?</Text>
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
            )}
            ListFooterComponent={() => (
              <>
                {
                  loading ?
                    <ActivityIndicator /> :
                    null
                }
                <OnlyForWeb>
                  <>
                    <View style={tw`ml-4 mt-10 flex items-center flex-row w-full`}>

                      <Button mode="contained" disabled={pageRef.current >= limitRef.current} onPress={() => {
                        pageRef.current = pageRef.current + 1
                        dataCtrl.mutate()
                      }}>Load more</Button>
                      <OnlyForWeb>
                        {
                          loading ?
                            <ActivityIndicator /> :
                            null
                        }
                      </OnlyForWeb>

                    </View>
                  </>

                </OnlyForWeb>
              </>
            )}
            ListEmptyComponent={() => (
              <View style={tw`mb-5 flex items-center flex-row w-full`}>
                {
                  !loading && dataCtrl.data?.length == 0 ?
                    <Text style={{ ...tw`mt-10 text-center w-full font-bold` }} variant="titleMedium">No data found</Text> :
                    null
                }
              </View>
            )}

            onEndReachedThreshold={0.2}
            refreshControl={
              Platform.OS != "web" ? <RefreshControl
                refreshing={loading}
                onRefresh={() => {
                  pageRef.current = 1;
                  limitRef.current = 2;
                  dataCtrl.mutate("reset");
                }}
              /> : null
            }
            onEndReached={() => {
              if (Platform.OS == "web" || pageRef.current >= limitRef.current) return;
              pageRef.current = pageRef.current + 1
              dataCtrl.mutate()
            }}
            data={dataCtrl.data}
            contentContainerStyle={{ width: FULL_WIDTH, ...tw`flex items-center` }}
            numColumns={SMALL_SCREEN ? 2 : 4}
            renderItem={({ item }: { item: Record<string, any> }) => (
              // @ts-ignore
              <TouchableOpacity key={`${Math.random(100) * 10}-${item.id}`} onPress={() => navigation.navigate("Model", { id: item.id })}>
                <View style={tw`bg-white w-[180px] min-h-[220px] rounded-lg flex justify-center items-center bg-white m-2`}>
                  <Image style={tw`w-[160px] h-[160px] rounded-lg mt-2 mb-2`} source={{ uri: `${environment.apiUrl}/file/${item.thumb}` }} />
                  <View style={tw`flex justify-start w-full`}>
                    <Text variant="titleMedium" style={tw`font-bold ml-5`}>{truncate(safelyGetProp(item, ((elem: any) => elem?.translations[0].title)), { length: 20 })}</Text>
                    <Text variant="titleMedium" style={tw`font-thin ml-5 text-gray-400 pr-5`}>{truncate(item.tags?.join(" "), { length: 30 })}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}

            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </Layout>
  );
}


