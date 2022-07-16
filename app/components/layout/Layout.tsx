import React, { Fragment, } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, View } from "react-native";
import Footer from "./Footer";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../../constants/layout";
import theme from "../../constants/theme";
import BottomNavigator from "./BottomNavigator";
import DrawerNavigator from "./DrawerNavigator";


export type LayoutProps = {
  children: JSX.Element,
  title?: string
  backgroundColor?: string,
  bottomNavigation?: boolean,
  hideHeader?: boolean,
  noScrollView?: boolean
};

const Layout: React.FC<LayoutProps> = ({ children, backgroundColor, bottomNavigation, noScrollView }) => {

  return (
    <Fragment>
      <StatusBar
        translucent
        backgroundColor="transparent"
      />
      {
        Platform.OS === "web" ?

          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", maxHeight: WINDOW_HEIGHT, maxWidth: WINDOW_WIDTH, backgroundColor: backgroundColor || theme.colors.background }}>
            <DrawerNavigator />
            <ScrollView>
              {children}
            </ScrollView>
          </View>
          :
          (
            noScrollView ?
              <>
                <DrawerNavigator />
                {children}
              </>
              :
              <>
                <DrawerNavigator />
                <ScrollView>
                  {children}
                </ScrollView>
              </>

          )
      }

      {
        bottomNavigation && Platform.OS !== "web" ?
          <BottomNavigator /> :
          null
      }


      {
        Platform.OS === "web" ?
          <Footer />
          : null
      }

    </Fragment>
  );
};


export default Layout;
