import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { Avatar, Card, Searchbar, Text } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { WINDOW_HEIGHT, FULL_WIDTH } from "../../constants/layout"
// @ts-ignore
import { useNavigation } from "@react-navigation/native";
import tw from '../../helpers/tailwind';
import useStore from "../../stores/store";
import Swiper from 'react-native-swiper'
import theme from "../../constants/theme";
import useSWR from "swr";
import environment from "../../constants/environment";
import { arrayToPairs } from "../../helpers/utils";
import * as Linking from 'expo-linking';
import { startCase } from "lodash";

export default function Home() {
  const navigation = useNavigation();
  const store = useStore();
  const [searchText, setSearchText] = useState();
  const configs = useStore(state => state.configs);
  const dataCtrl = useSWR("models", async () => {
    const data = configs.models;
    return data;
  }, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
  });
  // backgroundColor={({...tw`bg-red-800`}).color as string}
  return (
    <Layout>
      <View style={tw`flex flex-col bg-gray-50`}>
        <View style={tw`flex flex-row justify-between items-center mt-10`}>
          <View style={tw`flex flex-row justify-around items-center`}>
            <Avatar.Image size={50} source={require("../../assets/img/logo.png")} style={tw`ml-10`} />
            <Text style={tw`ml-2`}>Hi Koffi !</Text>
            {/* <Avatar.Text size={60} style={tw`ml-10`}>Hi</Avatar.Text> */}
          </View>
          <Avatar.Icon size={50} icon="bell-outline" style={tw`mr-10 bg-white`} />
        </View>

        <View style={tw`flex flex-col justify-around items-start mt-5`}>
          <Text style={{ ...tw`ml-2 mb-10 font-bold`, fontFamily: "Global-Fam", fontSize: 30 }}>What are you looking for ?</Text>
          <Searchbar
            placeholder="I am looking for"
            value={searchText}
            onChange={(e: any) => setSearchText(e.target.value)}
          />
        </View>

        <View style={tw`flex flex-col justify-around items-start mt-5`}>
          <Text style={{ ...tw`ml-2 font-semibold` }} variant="headlineSmall">Best models</Text>

          {
            dataCtrl.data ?
              <Swiper height={110} autoplay activeDotStyle={{ backgroundColor: theme.colors.primary }}>
                {
                  arrayToPairs(dataCtrl.data).map((models: Record<string, any>[], id: React.Key) => (
                    <View key={id} style={tw`flex flex-wrap flex-row justify-between ml-5 mr-5`}>
                      {
                        models.map((model) => (
                          <TouchableOpacity key={model.id}>
                            <View key={model.id}  style={tw`flex flex-row justify-around items-center rounded-[12px] h-[60px] bg-slate-50 w-[40]px border border-gray-200`}>
                              <Image style={tw`w-[50px] h-[50px] rounded-[12px]`} source={{ uri: `${environment.apiUrl}/file/${model.thumb}` }} />
                              <Text variant="titleMedium">{model.name}</Text>
                            </View>
                          </TouchableOpacity>
                        ))
                      }
                    </View>
                  ))
                }
              </Swiper> :
              <ActivityIndicator animating={true} />
          }

        </View>



        <View style={tw`flex flex-col justify-around items-start mt-5`}>
          <View>
            <Text style={{ ...tw`ml-2 font-semibold` }} variant="headlineSmall">Models</Text>
          </View>

          {
            dataCtrl.data ?
              <Swiper height={290} autoplay activeDotStyle={{ backgroundColor: theme.colors.primary }}>
                {
                  arrayToPairs(dataCtrl.data).map((models: Record<string, any>[], id: React.Key) => (
                    <View key={id} style={tw`flex flex-wrap flex-row justify-between`}>
                      {
                        models.map((model) => (
                          <TouchableOpacity key={model.id} onPress={()=>{

                            if(model.available_locally) {
                              // @ts-ignore
                              navigation.navigate(startCase(model.name));
                            }else{
                              Linking.openURL(model.doc_url)
                            }
                            
                          }}>
                            <View key={model.id} style={tw`bg-white w-[180px] rounded-lg flex justify-center items-center bg-white`}>
                              <Image style={tw`w-[160px] h-[160px] rounded-lg mt-2`} source={{ uri: `${environment.apiUrl}/file/${model.thumb}` }} />
                              <View style={tw`flex justify-start w-full`}>
                                <Text variant="titleMedium" style={tw`font-bold ml-5`}>{model.name}</Text>
                                <Text variant="titleMedium" style={tw`font-thin ml-5 text-gray-400`}>{model.name}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        ))
                      }
                    </View>
                  ))
                }
              </Swiper>
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
