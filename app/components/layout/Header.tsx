import { Appbar, Avatar, Text } from "react-native-paper";
import { Platform, View } from "react-native";
import { FULL_WIDTH, WINDOW_WIDTH } from "../../constants/layout";
import I18n from "i18n-js";
import theme from "../../constants/theme";
import React from "react";
import useStore from "../../stores/store";
import tw from "../../helpers/tailwind";

export default function Header(props: Record<string, any>) {  
  if (Platform.OS != "ios" && props.headerShown == false) return null;
  const store = useStore();

  if (Platform.OS === "web") {
    return (
      <View style={{ width: WINDOW_WIDTH, flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Appbar.Header style={{ width: FULL_WIDTH, flex: 1, alignItems: "center", justifyContent: "space-between", flexDirection: "row", backgroundColor: theme.colors.primaryOpac }}>
          <Avatar.Image size={50} source={require('../../assets/img/logo.png')} />
          <View style={tw`flex flex-row`}>
            <Appbar.Action icon="person" onPress={() => store.toggleDrawer()} />
            <Appbar.Action icon="menu" onPress={() => store.toggleDrawer()} />
          </View>
        </Appbar.Header>
      </View>
    )
  }

  return (
    <>
      <Appbar.Header style={{ maxWidth: FULL_WIDTH, minWidth: FULL_WIDTH }}>
        {props.back ? <Appbar.BackAction onPress={props.navigation.goBack} /> : null}
        <Appbar.Content title={props.options.headerTitle != undefined ? I18n.t(props.options.headerTitle) : ""} />
        {/* <Appbar.Action icon={MORE_ICON} onPress={() => { }} /> */}
        <Appbar.Action icon="menu" onPress={() => store.toggleDrawer()} />
      </Appbar.Header>
    </>
  )

}
