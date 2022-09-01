import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { Avatar, Button, Searchbar } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { WINDOW_HEIGHT, FULL_WIDTH } from "../../constants/layout"
// @ts-ignore
import logo from "../../assets/img/logo.png"
import { sharedStyles } from "../../styles/shared";
import I18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";
import tw from '../../helpers/tailwind';
import { storeData } from "../../helpers/local-storage";
import useStore from "../../stores/store";
import { useAppColorScheme } from "twrnc";
export default function Home() {
  const navigation = useNavigation();
  const store = useStore();

  const [colorScheme, toggleColorScheme, setColorScheme] = useAppColorScheme(tw);
  return (
    <Layout>
      <>
        {/* <View style={styles.fullContainer}>
          <View style={styles.container}>
            <Image style={styles.image} source={logo} />
            <Text variant="displaySmall" style={{ ...sharedStyles.centeredText, marginBottom: 10, fontWeight: "600" }}>{I18n.t("on_boarding_slogan")}</Text>
            <Text variant="bodyLarge" style={{ textAlign: "center", padding: 4 }}>{I18n.t("on_boarding_slogan_description")}</Text>
          </View>

          <View style={{ ...styles.container, height: 200 }}>
            <Button mode="contained" style={{ marginTop: 10 }} onPress={() => navigation.navigate("Model", { id: "holipics" })}>{I18n.t("evaluate_ai")}</Button>

          </View>

        </View> */}
        <View style={tw`flex flex-row justify-between items-center mt-5`}>
          <View style={tw`flex flex-row justify-around items-center`}>
            <Avatar.Image size={50} source={require("../../assets/img/logo.png")} style={tw`ml-10`} />
            <Text style={tw`ml-2`}>Hi Koffi !</Text>
            {/* <Avatar.Text size={60} style={tw`ml-10`}>Hi</Avatar.Text> */}
          </View>
          <Avatar.Icon size={50} icon="bell-outline" style={tw`mr-10 bg-white`} />
        </View>

        <View style={tw`flex flex-col justify-around items-start mt-5`}>
          <Text style={{...tw`ml-2 font-bold`, fontFamily: "Global-Fam", fontSize: 30}}>What are you looking for ?</Text>
          <Searchbar
            placeholder="I am looking for"
            value="dad"
          />
        </View>

      </>
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
