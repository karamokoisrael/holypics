import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { WINDOW_HEIGHT, FULL_WIDTH } from "../../constants/layout"
// @ts-ignore
import { useNavigation } from "@react-navigation/native";
import tw from '../../helpers/tailwind';
import useStore from "../../stores/store";
import useSWR, { mutate } from "swr";
import environment from "../../constants/environment";
import { arrayToPairs } from "../../helpers/utils";
import * as Linking from 'expo-linking';
import * as _ from "lodash";

export default function Home() {
  const navigation = useNavigation();
  const store = useStore();
  const [searchText, setSearchText] = useState("");
  const [isLoading, setLoadingStatus] = useState(false);
  const configs = useStore(state => state.configs);

  const dataCtrl = useSWR("models", async () => {
    try {
      setLoadingStatus(true)
      const data = configs.models
      console.log(data);
      
      // if(searchText != "") return data.filter((item: any)=> item.title.search(searchText) != -1 || item.tags?.includes(searchText))
      if (searchText != "") {
        setLoadingStatus(false)
        console.log("full text search");

        return data.filter((item: any) => item.title.search(searchText) != -1)
      }

      console.log("updating");
      setLoadingStatus(true);
      return data;
    } catch (error) {
      console.log(error);
      throw new Error("");
    }
  }, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
  });
  return (
    <Layout>
      <View style={tw`flex flex-col bg-gray-50 w-full`}>

        <View style={tw`flex flex-col justify-around items-start mt-5`}>
          <Text style={{ ...tw`ml-2 mb-10 font-bold`, fontFamily: "Global-Fam", fontSize: 30 }}>What are you looking for ?</Text>
          <Searchbar
            placeholder="I am looking for"
            value={searchText}
            onChangeText={(text: string) => {
              setSearchText(text)
              if (text == "") dataCtrl.mutate();
            }}
            onIconPress={() => dataCtrl.mutate()}
          />
        </View>


        <View style={tw`flex flex-col justify-around items-start mt-5`}>
          <View>
            <Text style={{ ...tw`ml-2 font-semibold` }} variant="headlineSmall">Models</Text>
            {
              isLoading ?
                <ActivityIndicator />
                :
                null
            }

          </View>

          {
            dataCtrl.data ?
              <View>
                {
                  arrayToPairs(dataCtrl.data).map((models: Record<string, any>[], id: React.Key) => (
                    <View key={id} style={tw`flex flex-wrap flex-row justify-around w-full`}>
                      {
                        models.map((model) => (
                          <TouchableOpacity key={model.id} onPress={() => {

                            if (model.available_locally) {
                              // @ts-ignore
                              navigation.navigate(_.startCase(model.name));
                            } else {
                              Linking.openURL(model.doc_url)
                            }

                          }}>
                            <View key={model.id} style={tw`bg-white w-[180px] rounded-lg flex justify-center items-center bg-white`}>
                              <Image style={tw`w-[160px] h-[160px] rounded-lg mt-2`} source={{ uri: `${environment.apiUrl}/file/${model.thumb}` }} />
                              <View style={tw`flex justify-start w-full`}>
                                <Text variant="titleMedium" style={tw`font-bold ml-5`}>{model.name}</Text>
                                <Text variant="titleMedium" style={tw`font-thin ml-5 text-gray-400 pr-5`}>{model.tags?.join(" ")}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))
                      }

                    </View>
                  ))
                }
              </View>
              :
              <ActivityIndicator animating={true} />
          }
        </View>

      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    maxHeight: WINDOW_HEIGHT,
    minHeight: WINDOW_HEIGHT,
    width: FULL_WIDTH,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    alignItems: "center",
  },
  image: { width: 300, height: 300 },
})
