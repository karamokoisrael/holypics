import React, { useRef, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, IconButton, List, Divider } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { FULL_WIDTH } from "../../constants/layout";
import { sharedStyles } from "../../styles/shared";
import I18n from "i18n-js";
// @ts-ignore
import { useNavigation } from "@react-navigation/native";
import theme from "../../constants/theme";
// @ts-ignore
import logo from "../../assets/img/logo.png"
// @ts-ignore
import stellarLogo from "../../assets/img/stellar-logo.png"

export default function Home() {
  const navigation = useNavigation();
  const [checked, setChecked] = React.useState(false);
  const [modalVisible, setModalStatus] = useState(false);
  const sheetRef = useRef(null);
  const [seedPhrase, setSeedPhrase] = useState("dizzy spray tooth humor ready iron zero dream trophy define powder young laundry father dune inflict seat satoshi govern defense subject stadium wash now");
  return (
    <Layout title={I18n.t("home")} bottomNavigation={true}>
      <View style={styles.fullContainer}>
        <View style={{ ...styles.container }}>
          <Text variant="displaySmall" style={{ ...sharedStyles.centeredText, marginBottom: 10, color: theme.colors.headerControls, fontWeight: "600" }}>10 CM</Text>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "space-around", flexDirection: "row", height: 70, width: "60%" }}>

            <View style={{ ...styles.container }}>
              <IconButton icon="arrow-up" style={{ width: 40, height: 40, backgroundColor: theme.colors.background }}></IconButton>
              <Text style={{ fontWeight: "600", color: theme.colors.headerControls }}>{I18n.t("send")}</Text>
            </View>
            <View style={{ ...styles.container }}>
              <IconButton icon="swap-vertical" style={{ width: 40, height: 40, backgroundColor: theme.colors.background }}></IconButton>
              <Text style={{ fontWeight: "600", color: theme.colors.headerControls }}>{I18n.t("swap")}</Text>
            </View>
            <View style={{ ...styles.container }}>
              <IconButton icon="arrow-down" style={{ width: 40, height: 40, backgroundColor: theme.colors.background }}></IconButton>
              <Text style={{ fontWeight: "600", color: theme.colors.headerControls }}>{I18n.t("receive")}</Text>
            </View>

          </View>
        </View>

        <View style={{ width: "100%", backgroundColor: theme.colors.headerControls, minHeight: 600, borderRadius: 20 }}>
          <List.Item
            style={{ width: "114%", margin: 0 }}
            title="Stellar"
            description="$20.14 +2.5%"
            left={props => <Image source={stellarLogo} style={sharedStyles.currencyLogo} />}
            right={props =>
              <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
                <Text variant="titleMedium" style={{ ...sharedStyles.centeredText }}>10 XLM</Text>
                <Text variant="bodySmall" style={{ ...sharedStyles.centeredText, color: theme.colors.gray }}>$2.64</Text>
              </View>
            }
          >
          </List.Item>
          <Divider />
          <List.Item
            style={{ width: "114%", margin: 0 }}
            title="Cryptomarket Token"
            description="$20.14 +2.5%"
            left={props => <Image source={logo} style={sharedStyles.currencyLogo} />}
            right={props =>
              <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-end" }}>
                <Text variant="titleMedium" style={{ ...sharedStyles.centeredText }}>10 CM</Text>
                <Text variant="bodySmall" style={{ ...sharedStyles.centeredText, color: theme.colors.gray }}>$2.64</Text>
              </View>
            }
          >
          </List.Item>
        </View>

      </View>

    </Layout>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    height: "100%",
    width: FULL_WIDTH
  },
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  }
})
