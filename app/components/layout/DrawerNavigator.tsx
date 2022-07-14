import React from "react";
import useStore from "../../stores/store";
import { Drawer } from 'react-native-paper';
import { useNavigation } from "@react-navigation/native";
import I18n from "i18n-js";
import { bottomRoutes } from "./BottomNavigator";

const DrawerNavigator: React.FC = () => {
    const selected = useStore((state) => state.bottomBarSelectedIndex);
    const navigation = useNavigation();

    return (
        <Drawer.Section>
            {
                bottomRoutes.map((item, index) => (
                    <Drawer.CollapsedItem
                        label={I18n.t(item.title)}
                        icon={selected === index ? item.focusedIcon : item.unfocusedIcon}
                        active={selected === index}
                        // @ts-ignore
                        onPress={() => navigation.navigate(item.key)}
                    />
                ))
            }
        </Drawer.Section>
    )
};

export default DrawerNavigator;
