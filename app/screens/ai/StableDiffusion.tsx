import React, { useEffect, useRef, useState } from "react";
import { Platform, View } from "react-native";
import { Card, Paragraph, Text, Title, Button, ActivityIndicator, TextInput } from "react-native-paper";
import useSWR from "swr";
import Layout from "../../components/layout/Layout";
import useStore from "../../stores/store";
import tw from '../../helpers/tailwind';
import { formatUrl, safelyGetProp } from "../../helpers/utils";
import I18n from "i18n-js";
import { FULL_WIDTH, WINDOW_HEIGHT } from "../../constants/layout";
import axios from "axios";
import * as WebBrowser from 'expo-web-browser';
import { useNavigation } from "@react-navigation/native";
import ModelCard from "../../components/layout/ModelCard";
import Constants from 'expo-constants';

export default function StableDiffusion({ route }) {
    const navigation = useNavigation();
    const configs = useStore(state => state.configs);
    const [isLoading, setLoadingStatus] = useState(true)
    const [text, setText] = useState("");
    const [predictions, setPredictions] = useState([]);
    const id = 2
    const dataCtrl = useSWR(`model`, async () => {
        setLoadingStatus(true)
        try {
            let data = configs?.models.find((item: { id: any; }) => item.id == id)
            if (data == undefined) {
                const req = await axios.get(formatUrl(`items/models/${id}`))
                return req.data.data;
            }
            setLoadingStatus(false)
            return data;
        } catch (error) {
            throw new Error("");
        } finally {
            setLoadingStatus(false)
        }
    }, {
        revalidateOnFocus: false,
        shouldRetryOnError: true,
    });

    // const predict = async () => {
    //     const req = await axios.post('https://hf.space/embed/stabilityai/stable-diffusion/+/', {
    //         inputs: "Hey man",
    //     }, {
    //         headers: {
    //             // "Authorization": `Bearer ${Constants?.manifest?.extra?.huggingFaceApiToken}` 
    //         }
    //     })
    //     console.log(req.data);
    // }
    // useEffect(() => {
    //     predict()
    // }, [])
    return (
        <Layout>
            <View style={tw`flex flex-col w-full items-center`}>
                <ModelCard dataCtrl={dataCtrl} isLoading={isLoading} testEnabled={true} />
                {
                    !isLoading && dataCtrl.data == undefined ?
                        <Text style={{ ...tw`ml-2 mt-2` }} variant="titleMedium">No data found</Text> :
                        null
                }

                {/* <View style={{ width: FULL_WIDTH, ...tw`mb-5 mt-5 flex items-center flex-row` }}>
                    <Text style={{ ...tw`ml-2 mr-2 font-bold` }} variant="headlineSmall">Test model</Text>
                </View>

                <View style={{ width: FULL_WIDTH, ...tw`flex flex-row justify-around items-center mt` }}>
              
                    <TextInput
                        style={tw`w-1/2`}
                        label="Prompt"
                        value={text}
                        onChangeText={currentText => setText(currentText)}
                    />
                    <Button mode="contained">Generate Image</Button>
                </View> */}
            </View>

        </Layout>
    );
}

