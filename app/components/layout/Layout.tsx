import React, { Fragment, } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, ScrollView, View } from "react-native";
import Footer from "./Footer";
import { WINDOW_HEIGHT, WINDOW_WIDTH } from "../../constants/layout";
import theme from "../../constants/theme";
import BottomNavigator from "./BottomNavigator";
import tw from "../../helpers/tailwind";

export type LayoutProps = {
  children: JSX.Element,
  title?: string
  backgroundColor?: string,
  bottomNavigation?: boolean,
  hideHeader?: boolean,
  noScrollView?: boolean,
  webStyle?: Record<string, any>
};

const Layout: React.FC<LayoutProps> = ({ children, backgroundColor, bottomNavigation, noScrollView, webStyle }) => {

  return (
    <Fragment>
      <StatusBar
        translucent
        backgroundColor="transparent"
      />
      {
        Platform.OS === "web" ?
          // @ts-ignore
          <View style={{ ...(webStyle || {}),  ...tw`flex flex-col items-end justify-around content-end`, minHeight: WINDOW_HEIGHT,  height: "auto", maxWidth: WINDOW_WIDTH, backgroundColor: backgroundColor || theme.colors.background }}>
            {children}
            <Footer />
          </View>
          :
          (
            !noScrollView ?
              <>
                <ScrollView>
                  {children}
                </ScrollView>
              </>

              :
              <>
                {children}
              </>

          )
      }

      {
        bottomNavigation && Platform.OS !== "web" ?
          <BottomNavigator /> :
          null
      }

    </Fragment>
  );
};


export default Layout;
