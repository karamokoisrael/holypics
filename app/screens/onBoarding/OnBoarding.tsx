import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { WINDOW_HEIGHT, FULL_WIDTH } from "../../constants/layout"
// @ts-ignore
import logo from "../../assets/img/logo.png"
import { sharedStyles } from "../../styles/shared";
import I18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";
export default function OnBoarding() {
  const navigation = useNavigation();
  return (
    <Layout hideHeader>
      <View style={styles.fullContainer}>
        <View style={styles.container}>
          <Image style={styles.image} source={logo} />
          <Text variant="displaySmall" style={{...sharedStyles.centeredText, marginBottom: 10, fontWeight: "600"}}>{I18n.t("on_boarding_slogan")}</Text>
          <Text variant="bodyLarge" style={sharedStyles.centeredText}>{I18n.t("on_boarding_slogan_description")}</Text>
        </View>

        <View style={{...styles.container, height: 200}}>
          {/* <Text variant="displayLarge" style={sharedStyles.centeredText}>...</Text> */}
          <Button mode="contained"  style={{marginTop: 10}} onPress={()=> navigation.navigate("Home")}>{I18n.t("get_started")}</Button>
          {/* <Button mode="text" onPress={()=> navigation.navigate("SignIn")}>{I18n.t("i_already_have_a_wallet")}</Button> */}
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
