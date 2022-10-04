import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { useNavigation } from "@react-navigation/native";
import tw from '../../helpers/tailwind';
import useStore from "../../stores/store";
import useSWR from "swr";
import environment from "../../constants/environment";

export default function Home() {
  const navigation = useNavigation();
  const onBoardingPassed = useStore(state => state.onBoardingPassed);
  useEffect(() => {
    if (!onBoardingPassed) navigation.navigate("OnBoarding");
  }, [onBoardingPassed])
  const [searchText, setSearchText] = useState("");
  const configs = useStore(state => state.configs);
  const dataCtrl = useSWR("models", async () => {
    try {
      const data = configs.models
      // console.log(data);

      if (searchText != "") {
        return data.filter((item: any) => item.title.toLowerCase().search(searchText.toLowerCase()) != -1 || item.tags?.includes(searchText.toLowerCase()))
      }
      if (data == undefined) throw new Error("No data");
      return data;
    } catch (error) {
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
            }}
            onIconPress={() => dataCtrl.mutate()}
          />
        </View>


        <View style={tw`flex flex-col justify-around items-start mt-5`}>
          <View>
            <Text style={{ ...tw`ml-2 font-bold` }} variant="headlineSmall">Models</Text>
          </View>
          <View>
            {
              <View style={tw`flex flex-wrap flex-row justify-around w-full`}>
                {
                  dataCtrl.data?.map((model: Record<string, any>) => (
                    <TouchableOpacity key={model.id} onPress={() => navigation.navigate("Models")}>
                      <View key={model.id} style={tw`bg-white w-[180px] rounded-lg flex justify-center items-center bg-white`}>
                        <Image style={tw`w-[160px] h-[160px] rounded-lg mt-2`} source={{ uri: `${environment.apiUrl}/file/${model.thumb}` }} />
                        <View style={tw`flex justify-start w-full`}>
                          <Text variant="titleMedium" style={tw`font-bold ml-5`}>{model?.title}</Text>
                          <Text variant="titleMedium" style={tw`font-thin ml-5 text-gray-400 pr-5`}>{model.tags?.join(" ")}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                }
              </View>
            }
          </View>
        </View>

      </View>
    </Layout>
  );
}


