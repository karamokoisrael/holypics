import React from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Button, Checkbox, List, Text } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { WINDOW_HEIGHT, FULL_WIDTH } from "../../constants/layout";
import { sharedStyles } from "../../styles/shared";
import I18n from "i18n-js";
// @ts-ignore
import illustration from "../../assets/img/terms-and-use.png";
import { useNavigation } from "@react-navigation/native";
export default function Legal() {
    const navigation = useNavigation();
    const [checked, setChecked] = React.useState(false);
    return (
        <Layout>
            <View style={styles.fullContainer}>
                <View style={{ ...styles.container, minWidth: FULL_WIDTH, maxWidth: FULL_WIDTH}}>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" ,height: "auto", minWidth: FULL_WIDTH, maxWidth: FULL_WIDTH }}>
                        <Image style={styles.image} source={illustration} />

                        <Text variant="bodyMedium" style={{ textAlign: "center", height: 70, marginBottom: 10, padding: 10}}>{I18n.t("please_review_the_terms_of_service_and_privacy_policy")}</Text>
                        <List.Section style={{ maxWidth: FULL_WIDTH, minWidth: FULL_WIDTH }} >
                            <List.Accordion
                                title={I18n.t("privacy_policy")}
                            >
                                <List.Section>
                                    <Text variant="bodyMedium" style={{ paddingLeft: 10 }}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id expedita provident, error natus eius quasi, pariatur voluptatem itaque fuga maxime rem sunt soluta obcaecati, nam esse porro laudantium sed fugiat?</Text>
                                </List.Section>
                            </List.Accordion>
                            <List.Accordion
                                title={I18n.t("terms_of_service")}>
                                <List.Section>
                                    <Text variant="bodyMedium" style={{ paddingLeft: 10 }}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id expedita provident, error natus eius quasi, pariatur voluptatem itaque fuga maxime rem sunt soluta obcaecati, nam esse porro laudantium sed fugiat?</Text>
                                </List.Section>
                            </List.Accordion>
                        </List.Section>
                    </View>
                </View>

                <View style={{ ...styles.bottomSectionContainer }}>
                    <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
                        <View style={{ flexBasis: "10%" }}>
                            <Checkbox
                                status={checked ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    setChecked(!checked);
                                }}
                            />
                        </View>
                        <Text style={{ flexBasis: "90%", marginBottom: 10 }} variant="bodyMedium">{I18n.t("i_ve_read_and_accept_the_terms_of_service_and_privacy_policy")}</Text>
                    </View>
                    <Button mode="contained" onPress={() => {
                        if (checked) {
                            navigation.navigate("BackupWallet")
                        } else {
                            Alert.alert(I18n.t("error"), I18n.t("you_should_accept_our_policies_first"))
                        }
                    }}>{I18n.t("continue")}</Button>
                </View>
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({
    fullContainer: {
        minHeight: WINDOW_HEIGHT-120,
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
        maxWidth: FULL_WIDTH,
        minWidth: FULL_WIDTH,
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around"
    },
    flexCenter: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        width: 250,
        height: 250,
        margin: 0,
        padding: 0
    },
})
