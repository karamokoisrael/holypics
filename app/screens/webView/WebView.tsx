import React from "react";
import { ScrollView } from "react-native";
import Layout from "../../components/layout/Layout";
import tw from '../../helpers/tailwind';
import { WebView as WebViewComponent } from 'react-native-webview';
import { FULL_WIDTH } from "../../constants/layout";
export default function WebView({ route }) {
    return (
        <Layout hideHeader noScrollView>
            <ScrollView
                style={{ width: '100%', ...tw`flex flex-col w-full` }}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <WebViewComponent
                    style={{ height: "auto", width: FULL_WIDTH }}
                    source={{ uri: route.params.url }}
                />
            </ScrollView>
        </Layout>
    );
}

