import React, { useRef, useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Button, Checkbox, Chip, Text } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { WINDOW_HEIGHT, FULL_WIDTH } from "../../constants/layout";
import { sharedStyles } from "../../styles/shared";
import I18n from "i18n-js";
// @ts-ignore
import illustration from "../../assets/img/backup-wallet.png";
import { useNavigation } from "@react-navigation/native";
import theme from "../../constants/theme";
export default function SignUp() {
    const navigation = useNavigation();
    const [checked, setChecked] = useState(false);
    const [seedPhrase, setSeedPhrase] = useState("dizzy spray tooth humor ready iron zero dream trophy define powder young laundry father dune inflict seat satoshi govern defense subject stadium wash now");
    const recoveryArray = useRef(seedPhrase.split(" ").sort((a, b) => 0.5 - Math.random()))
    const [enteredSeedPhrase, setEnteredSeedPhrase] = useState(seedPhrase);

    const getTransformedEnteredSeedPhrase = ()  => {
        if(enteredSeedPhrase.trim() === "") return []
        const splitted = enteredSeedPhrase.trim().split(" ");
        return splitted.length > 0  ? splitted : []
    }

    const toggleWord = (word: string) => {
        if (enteredSeedPhrase.includes(word)) {
            setEnteredSeedPhrase(enteredSeedPhrase.replace(`${word} `, "").replace(word, ""))
        } else {
            setEnteredSeedPhrase(`${enteredSeedPhrase}${word} `)
        }
    }
    return (
        <Layout>
            <View style={styles.fullContainer}>
                <View style={{ ...styles.container }}>
                    <Text variant="headlineMedium" style={{ textAlign: "center", marginBottom: 10, fontWeight: "600" }}>{I18n.t("verify_recovery_phrase")}</Text>
                    <Text variant="bodyLarge" style={{ textAlign: "center", marginBottom: 10 }}>{I18n.t("tap_the_words_to_put_them_next_to_each_other_in_the_correct_order")}</Text>
                </View>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}>
                    <View style={{ maxHeight: 400, flexDirection: "row", flexWrap: "wrap", width: "100%" }}>
                        {
                            recoveryArray.current.map((item: string, index: any) => (
                                <Chip key={index} onPress={() => {
                                    toggleWord(item)
                                }} style={{
                                    width: "auto",
                                    maxHeight: 30,
                                    margin: 2,
                                    backgroundColor: enteredSeedPhrase.includes(item) ? theme.colors.info : theme.colors.chip
                                }}>{index + 1} {item}</Chip>
                            ))
                        }
                    </View>
                    <View style={{ maxHeight: 400, flexDirection: "row", flexWrap: "wrap", width: "100%", marginTop: 20, marginBottom: 20 }}>
                        {
                            getTransformedEnteredSeedPhrase().map((item: string, index: any) => (
                                <Chip key={index} onPress={() => {
                                    toggleWord(item)
                                }} style={{
                                    backgroundColor: theme.colors.success,
                                    width: "auto",
                                    maxHeight: 30,
                                    margin: 2
                                }}>{index + 1} {item}</Chip>
                            ))
                        }
                    </View>
                </View>
                <View style={{ ...styles.bottomSectionContainer }}>
                    <Button mode="contained" onPress={() => {
                        if (seedPhrase !== enteredSeedPhrase.trim()) {
                            return Alert.alert(I18n.t("error"), I18n.t("recovery_phrases_do_not_match"))
                        }

                        navigation.navigate("Wallets");
                    }}>{I18n.t("verify")}</Button>
                </View>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    fullContainer: {
        minHeight: WINDOW_HEIGHT,
        marginTop: 20,
        width: FULL_WIDTH,
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around"
    },
    bottomSectionContainer: {
        maxHeight: 100,
        maxWidth: FULL_WIDTH,
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end"
    },
    container: {
        width: "100%",
        // flex: 1,
        alignItems: "center",
        // justifyContent: "space-around"
    },
    image: { 
        width: 250,
        height: 250 
    },
})
