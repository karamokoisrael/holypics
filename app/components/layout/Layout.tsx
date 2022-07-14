import React, { Fragment, } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import Footer from "./Footer";
import { SafeAreaView } from "react-native-safe-area-context";
import { FULL_WIDTH, WINDOW_HEIGHT, WINDOW_WIDTH } from "../../constants/layout";
import theme from "../../constants/theme";
import BottomNavigator from "./BottomNavigator";
import { Appbar, Drawer } from "react-native-paper";
import DrawerNavigator from "./DrawerNavigator";

export type LayoutProps = {
  children: JSX.Element,
  title?: string
  backgroundColor?: string,
  bottomNavigation?: boolean,
  hideHeader?: boolean,

};

const Layout: React.FC<LayoutProps> = ({ children, backgroundColor, bottomNavigation, hideHeader, title }) => {

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  return (
    <Fragment>
      <StatusBar
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", maxHeight: WINDOW_HEIGHT, maxWidth: WINDOW_WIDTH, backgroundColor: backgroundColor || theme.colors.background }}>

        {
          hideHeader != true ?
            <Appbar.Header style={{ width: FULL_WIDTH, backgroundColor: theme.colors.primaryOpac }}>
              <Appbar.Content title={title} subtitle={'Subtitle'} />
              <Appbar.Action icon={MORE_ICON} onPress={() => { }} />
            </Appbar.Header>
            : null
        }

        <View style={{ width: "auto" }}>
          <DrawerNavigator />
        </View>
        <ScrollView style={{ marginTop: bottomNavigation ? -24 : -24, padding: 0 }}>
          {children}
        </ScrollView>
        {
          bottomNavigation ?
            <BottomNavigator /> :
            null
        }
      </SafeAreaView>

      {
        Platform.OS === "web" ?
          <Footer />
          : null
      }

    </Fragment>
  );
};

const styles = StyleSheet.create({
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Layout;
