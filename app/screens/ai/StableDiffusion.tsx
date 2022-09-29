import React, { useEffect, useRef, useState } from "react";
import { Linking, Platform, StyleSheet, TouchableHighlight, View } from "react-native";
import { Button, Card, IconButton, Paragraph, TextInput, Title, Text, ActivityIndicator, Portal, Modal } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { FULL_WIDTH } from "../../constants/layout";
import I18n from "i18n-js";
import useSWR from "swr";
import { formatUrl } from "../../helpers/utils";
import useStore from "../../stores/store";
import { isSmallScreen } from "../../helpers/layout";
import tw from '../../helpers/tailwind';
export default function StableDiffusion() {
    // const configs = useStore(state => state.configs);
    // const dataCtrl = useSWR("models", async (...args: any) => {
    //     return configs?.models?.find((item: any) => item.test_url == "StableDiffusion");
    // }, {
    //     revalidateOnFocus: false,
    //     shouldRetryOnError: true,
    // });

    return (
        <Layout>
            <Text>StableDiffusion</Text>
        </Layout>
    );
}

