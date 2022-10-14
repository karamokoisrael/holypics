import React, { useEffect } from "react";
import { View, FlatList, TouchableHighlight } from "react-native";
import { IconButton, Text } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { FULL_WIDTH, SMALL_SCREEN, WINDOW_HEIGHT } from "../../constants/layout"
// @ts-ignore
import { useNavigation } from "@react-navigation/native";
import useStore from "../../stores/store";
import tw from '../../helpers/tailwind';
import { openUrl } from "../../helpers/utils";
import environment from "../../constants/environment";
import theme from "../../constants/theme";

export default function Apps() {
    const navigation = useNavigation();
    const onBoardingPassed = useStore(state => state.onBoardingPassed);
    useEffect(() => {
        if (onBoardingPassed) navigation.navigate("Home");
    }, [onBoardingPassed])
    type App = {
        title: string,
        icon: string,
        url: string
    }
    const apps: App[] = [
        {
            title: "Download on android",
            url: environment.websiteUrl,
            icon: "google-play"
        },
        {
            title: "Download for iphone",
            url: environment.websiteUrl,
            icon: "apple"
        },
        {
            title: "Download for windows",
            url: environment.websiteUrl,
            icon: "microsoft-windows"
        },
        {
            title: "Download for macos",
            url: environment.websiteUrl,
            icon: "apple"
        },
        {
            title: "Download for linux",
            url: environment.websiteUrl,
            icon: "penguin"
        },
        {
            title: "Visit our Website",
            url: environment.websiteUrl,
            icon: "web"
        }
    ]
    return (
        <Layout hideHeader noScrollView>
            <View style={{ ...tw`flex flex-col w-full items-center justify-center`, height: WINDOW_HEIGHT }}>
                <View style={tw`mt-10`}>
                    <Text variant="titleMedium" style={{ ...tw`ml-2 mb-10 font-bold text-center leading-10`, fontSize: 30 }}>Access our apps on several devices</Text>
                </View>
                <FlatList
                    contentContainerStyle={{ width: SMALL_SCREEN ? FULL_WIDTH : 400 }}
                    data={apps}
                    renderItem={({ item }) => (
                        <TouchableHighlight onPress={async () => await openUrl(item.url)} underlayColor={theme.colors.primaryOpac}>
                            <View style={tw`flex flex-row items-center justify-between w-full`} key={item.title}>
                                <IconButton icon={item.icon} />
                                <Text variant="titleSmall">{item.title}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                    keyExtractor={(item) => item.title}
                />
            </View>
        </Layout>
    );
}
