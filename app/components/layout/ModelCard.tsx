
import React from "react";
import { Platform, View } from "react-native";
import { Card, Paragraph, Title, Button, ActivityIndicator } from "react-native-paper";
import tw from '../../helpers/tailwind';
import { formatUrl, safelyGetProp } from "../../helpers/utils";
import I18n from "i18n-js";
import { FULL_WIDTH, WINDOW_HEIGHT } from "../../constants/layout";
import * as WebBrowser from 'expo-web-browser';
type Props = {
    dataCtrl: Record<string, any>;
    isLoading: boolean,
    testEnabled: true
}
export default function ModelCard({ dataCtrl, isLoading, testEnabled }: Props) {
    return (
        <Card style={{ width: FULL_WIDTH, minHeight: ["android", "ios"].includes(Platform.OS) ? WINDOW_HEIGHT : 320, height: "auto" }}>
            <Card.Title titleVariant="headlineSmall" title={safelyGetProp(dataCtrl?.data, (item: any) => item.translations[0].title)} />
            <Card.Cover style={{ minHeight: 300 }} source={{ uri: formatUrl(`file/${dataCtrl?.data?.thumb}`) }} />
            <Card.Content>
                {
                    isLoading ?
                        <ActivityIndicator />
                        :
                        null
                }
                <Title>{safelyGetProp(dataCtrl?.data, (item: any) => item.translations[0].title)}</Title>
                <Paragraph style={tw`p-2`}>{safelyGetProp(dataCtrl?.data, ((item: any) => item.translations[0].description))}</Paragraph>
                <View style={tw`flex flex-row justify-around`}>
                    {
                        testEnabled ?
                            <Button style={{ marginTop: 10 }} onPress={() => WebBrowser.openBrowserAsync(dataCtrl?.data?.doc_url)}>Test AI</Button>
                            : null
                    }
                    <Button style={{ marginTop: 10 }} onPress={() => WebBrowser.openBrowserAsync(dataCtrl?.data?.doc_url)}>{I18n.t("see_documentation")}</Button>
                </View>
            </Card.Content>
        </Card>
    )
}