import Layout from "../../components/layout/Layout";
import React, { Fragment } from "react";
import { View, Text } from "react-native";
import { ComponentWithNavigationProps } from "../../@types/component";
import { Center } from "native-base";

export default function Search({navigation, route}: ComponentWithNavigationProps){
    return (
        <Layout navigation={navigation} route={route}>
            <Center alignItems="center" justifyContent="center" height="100%">
                <Text>Search</Text>
            </Center>
        </Layout>
    )
}
