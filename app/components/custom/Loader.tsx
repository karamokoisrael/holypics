import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../../constants/layout";
export default function () {
    return (
        <View style={{ width: WINDOW_WIDTH, height: WINDOW_HEIGHT, flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator/>
        </View>
    );
}

