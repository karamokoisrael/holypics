import React from "react";
import useStore from "../../stores/store";
import { Drawer, IconButton, Modal, Portal } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import { FULL_WIDTH } from "../../constants/layout";
import { View } from "react-native";
import I18n from "i18n-js";
import theme from "../../constants/theme";
import { isSmallScreen } from "../../helpers/layout";

export const drawerRoutes = [
    {
        id: 0,
        title: "home",
        key: "Home",
        focusedIcon: "home",
        unfocusedIcon: 'home-outline',
    },
    {
        id: 1,
        title: "holipics",
        key: "Model",
        focusedIcon: "newspaper",
        unfocusedIcon: 'newspaper-variant',
    },
    {
        id: 1,
        title: "account",
        key: "Account",
        focusedIcon: "newspaper",
        unfocusedIcon: 'newspaper-variant',
    },
];

const DrawerNavigator: React.FC = () => {
    const store = useStore();
    const drawerOpened = useStore(state => state.drawerOpened)
    const drawerSelectedIndex = useStore(state => state.drawerSelectedIndex)
    const navigation = useNavigation();

    return (
        <Portal>
            <Modal contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.background, width: isSmallScreen() ? FULL_WIDTH : 400 }} visible={drawerOpened} onDismiss={() => store.toggleDrawer()}>
                <View style={{ width: "100%", flex: 1, alignItems: "flex-start", justifyContent: "flex-start" }}>
                    <View style={{ flex: 1, alignItems: "flex-end", width: "100%", height: "10%" }}>
                        <IconButton icon={"close"} onPress={() => store.toggleDrawer()}></IconButton>
                    </View>
                    <Drawer.Section style={{ height: "90%", width: "100%" }}>
                        {
                            drawerRoutes.map((item, index) => (
                                <Drawer.Item
                                    key={index}
                                    label={I18n.t(item.title)}
                                    style={index === drawerSelectedIndex ? { backgroundColor: theme.colors.primaryOpac } : {}}
                                    active={index === drawerSelectedIndex}
                                    onPress={() => {
                                        if (item.key === "Model") {
                                            // @ts-ignore
                                            navigation.navigate(item.key, { id: "holipics" });
                                        } else {
                                            // @ts-ignore
                                            navigation.navigate(item.key);
                                        }
                                        store.toggleDrawer()
                                    }}
                                />
                            ))
                        }
                    </Drawer.Section>
                </View>
            </Modal>
        </Portal>
    )
};

export default DrawerNavigator;
