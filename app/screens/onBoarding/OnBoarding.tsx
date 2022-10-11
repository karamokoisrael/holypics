import React, { useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { WINDOW_HEIGHT } from "../../constants/layout"
// @ts-ignore
import logo from "../../assets/img/logo.png"
import { sharedStyles } from "../../styles/shared";
import I18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";
import useStore from "../../stores/store";
import tw from '../../helpers/tailwind';

export default function OnBoarding() {
  const navigation = useNavigation();
  const onBoardingPassed = useStore(state => state.onBoardingPassed);
  const store = useStore();
  useEffect(() => {
    if (onBoardingPassed) navigation.navigate("Home");
  }, [onBoardingPassed])
  return (
    <Layout hideHeader>
      <View style={{...tw`flex flex-col w-full items-center justify-center`, height: WINDOW_HEIGHT}}>
        <View>
          <View style={styles.container}>
            <Image style={styles.image} source={logo} />
            <Text variant="displaySmall" style={{ ...sharedStyles.centeredText, marginBottom: 10, fontWeight: "600", textAlign: "center" }}>{I18n.t("on_boarding_slogan")}</Text>
            <Text variant="bodyLarge" style={sharedStyles.centeredText}>{I18n.t("on_boarding_slogan_description")}</Text>
          </View>
          <View style={{ ...styles.container, height: 200 }}>
            <Button mode="contained" style={{ marginTop: 10 }} onPress={() => {
              store.toggleOnboardingStatus();
              navigation.navigate("Home");
            }}>{I18n.t("get_started")}</Button>
          </View>
        </View>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  image: { width: 300, height: 300 },
})
