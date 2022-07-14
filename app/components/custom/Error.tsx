import { useNavigation } from "@react-navigation/native";
import I18n from "i18n-js";
import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import { WINDOW_HEIGHT } from "../../constants/layout";
import theme from "../../constants/theme";

export default function CustomErrorFallback(props: { error: Error; resetError: Function }) {
    const navigation = useNavigation();
    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", height: WINDOW_HEIGHT, backgroundColor: theme.colors.light }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", height: 100 }}>
                <Text variant="headlineLarge">Error</Text>
                <Text variant="bodySmall">{props.error.toString()}</Text>
            </View>
            <View  style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", height: 100 }}>
                {/* <Button onPress={()=> navigation.navigate("Wallets")} style={{ backgroundColor: theme.colors.warning }}>{I18n.t("refresh")}</Button> */}
            </View>
        </View>
    )
}

export const errorHandler = (error: Error, stackTrace: string) => {
    console.log("Handled Error => ", stackTrace, "__", error);
};
