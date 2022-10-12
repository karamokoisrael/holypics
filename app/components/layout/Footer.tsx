import { Appbar, Avatar, Text } from "react-native-paper";
import { Platform, TouchableOpacity, View } from "react-native";
import { FULL_WIDTH, SMALL_SCREEN, WINDOW_WIDTH } from "../../constants/layout";
import theme from "../../constants/theme";
import React from "react";
import tw from "../../helpers/tailwind";
import { useNavigation } from "@react-navigation/native";
import environment from "../../constants/environment";
import { openUrl } from "../../helpers/utils";

export default function Footer() {

  if (Platform.OS != "web") return null;
  // const store = useStore();
  const navigation = useNavigation();

  return (
    <View style={{ ...tw`mt-${SMALL_SCREEN ? '175' : '95'}`, width: WINDOW_WIDTH, flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background }}>
      <Appbar.Header style={{ minHeight: 50, width: FULL_WIDTH, flex: 1, alignItems: "center", justifyContent: "space-between", flexDirection: "row", backgroundColor: theme.colors.primaryOpac }}>
        <Appbar.Header style={{ backgroundColor: "transparent", flex: 1, alignItems: "center", justifyContent: "space-around", flexDirection: "row"}}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}>
            <Avatar.Image size={30} source={require('../../assets/img/logo-bg.png')} />
          </TouchableOpacity>
          <Text variant="labelLarge" style={tw`text-center ml-4`}>Copyright © 2022 Megamax Development</Text>
        </Appbar.Header>

        {
          !SMALL_SCREEN ?
            <Appbar.Header style={{ backgroundColor: "transparent" }}>
              <Appbar.Action icon="web" onPress={async () => await openUrl(environment.websiteUrl)} />
              <Appbar.Action icon="github" onPress={async () => await openUrl("https://github.com/karamokoisrael")} />
              <Appbar.Action icon="twitter" onPress={async () => await openUrl("https://twitter.com/IsraelKaramoko")} />
            </Appbar.Header> :
            null
        }
      </Appbar.Header>
    </View>
  )
}
