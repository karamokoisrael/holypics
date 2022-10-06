import { Appbar, Avatar } from "react-native-paper";
import { Platform, View } from "react-native";
import { FULL_WIDTH, WINDOW_WIDTH } from "../../constants/layout";
import theme from "../../constants/theme";
import React from "react";
import tw from "../../helpers/tailwind";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Header(props: Record<string, any>) {

  if (Platform.OS != "ios" && props.headerShown == false) return null;
  // const store = useStore();
  const navigation = useNavigation();
  if (Platform.OS === "web") {
    return (
      <View style={{ width: WINDOW_WIDTH, flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Appbar.Header style={{ width: FULL_WIDTH, flex: 1, alignItems: "center", justifyContent: "space-between", flexDirection: "row", backgroundColor: theme.colors.primaryOpac }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}>
            <Avatar.Image size={50} source={require('../../assets/img/logo-bg.png')} />
          </TouchableOpacity>
          <View style={tw`flex flex-row`}>
            <Appbar.Action icon="account" onPress={() => navigation.navigate("Account")} />
            <Appbar.Action icon="menu" onPress={() => (navigation as Record<string, any>).toggleDrawer()} />
          </View>
        </Appbar.Header>
      </View>
    )
  }

  return (
    <>
      <Appbar.Header style={{ maxWidth: FULL_WIDTH, minWidth: FULL_WIDTH }}>
        {props.options?.back ? <Appbar.BackAction onPress={() => navigation.goBack()} /> : null}
        {!props.options?.back ? <Appbar.Action icon="menu" onPress={() => (navigation as Record<string, any>).toggleDrawer()} /> : null}
        <Appbar.Content title={props.options.headerTitle != undefined ? props.options.headerTitle : ""} />
        {!props.options?.back ? <Appbar.Action icon="account" onPress={() => navigation.navigate("Account")} /> : null}
      </Appbar.Header>
    </>
  )

}
