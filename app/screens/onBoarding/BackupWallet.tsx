import React, { useRef, useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Button, Checkbox, Text, Modal, Portal, Chip } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { WINDOW_HEIGHT, FULL_WIDTH } from "../../constants/layout";
import { sharedStyles } from "../../styles/shared";
import I18n from "i18n-js";
// @ts-ignore
import illustration from "../../assets/img/backup-wallet.png";
import { useNavigation } from "@react-navigation/native";
import theme from "../../constants/theme";

export default function BackupWallet() {
    const navigation = useNavigation();
    const [checked, setChecked] = React.useState(false);
    const [modalVisible, setModalStatus] = useState(false);
    const sheetRef = useRef(null);
    const [seedPhrase, setSeedPhrase] = useState("dizzy spray tooth humor ready iron zero dream trophy define powder young laundry father dune inflict seat satoshi govern defense subject stadium wash now");
    return (
        <Layout>
            <>
                <Portal>
                    <Modal visible={modalVisible} onDismiss={() => setModalStatus(false)} contentContainerStyle={{
                        maxHeight: 900,
                        backgroundColor: theme.colors.headerControls,
                        padding: 20
                    }}>
                        <View style={{ maxHeight: 800, flexDirection: "column", justifyContent: "space-around", alignItems: "center" }}>
                            <View style={{ marginBottom: 30 }}>
                                <Text variant="headlineSmall" style={{ ...sharedStyles.centeredText, fontWeight: "600" }}>{I18n.t("your_recovery_phrase")}</Text>
                                <Text variant="bodyLarge" style={{ ...sharedStyles.centeredText }}>{I18n.t("write_down_or_copy_these_words_in_the_right_order_and_save_them_somewhere_safe")}</Text>
                            </View>

                            <View style={{ maxHeight: 400, flexDirection: "row", flexWrap: "wrap", width: FULL_WIDTH }}>
                                {
                                    seedPhrase.split(" ").map((item: string, index: any) => (
                                        <Chip key={index} style={{
                                            width: "auto",
                                            maxHeight: 30,
                                            margin: 2
                                        }}>{index + 1} {item}</Chip>
                                    ))
                                }
                            </View>

                            <View style={{ marginBottom: 30 }}>
                                <View style={{ backgroundColor: theme.colors.primaryOpac, marginBottom: 30, marginTop: 30, borderRadius: 10, padding: 10 }}>
                                    <Button icon="information">
                                    </Button>
                                    <Text variant="bodyLarge" style={{ ...sharedStyles.centeredText }}>{I18n.t("write_down_or_copy_these_words_in_the_right_order_and_save_them_somewhere_safe")}</Text>
                                </View>
                                <Button mode="contained" onPress={() => {
                                    setModalStatus(false)
                                    navigation.navigate("SignUp")
                                }}>{I18n.t("continue")}</Button>
                            </View>
                        </View>

                    </Modal>
                </Portal>
                <View style={styles.fullContainer}>
                    <View style={{ ...styles.container }}>
                        <Text variant="headlineMedium" style={{ textAlign: "center", marginBottom: 10, fontWeight: "600" }}>{I18n.t("backup_your_wallet_now")}</Text>
                        <Text variant="bodyLarge" style={{ textAlign: "center", marginBottom: 10 }}>{I18n.t("in_the_following_sequence_you_will_see_24_words_that_will_allow_you_to_backup_up_your_wallet")}</Text>
                    </View>

                    <Image style={styles.image} source={illustration} />

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
                            <Text style={{ textAlign: "center", flexBasis: "90%", marginBottom: 10 }} variant="bodyMedium">{I18n.t("i_understand_that_if_i_lose_my_recovery_words_i_will_not_be_able_to_access_my_wallet")}</Text>
                        </View>
                        <Button mode="contained" onPress={() => {
                            if (checked) {
                                // navigation.navigate("SignUp")
                                setModalStatus(true)
                            } else {
                                Alert.alert(I18n.t("error"), I18n.t("make_sure_to_agree_with_our_guidelines"))
                            }
                        }}>{I18n.t("continue")}</Button>

                    </View>

                </View>
            </>
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
        width: "100%",
        // flex: 1,
        alignItems: "center",
        // justifyContent: "space-around"
    },
    image: { 
        width: 250, 
        height: 250 
    }
})
