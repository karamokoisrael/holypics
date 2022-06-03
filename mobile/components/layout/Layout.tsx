import React, { Fragment } from "react";
import { VStack, StatusBar, ScrollView, Hidden } from "native-base";

import { LayoutProps } from "../../@types/layout";
import Navbar from "./Navbar";
import BottomBar from "./BottomBar";
import Footer from "./Footer";
import { APP_WITH_LIMIT } from "../../constants/layout";

const Layout: React.FC<LayoutProps> = ({
  title,
  children,
  navigation,
  route,
}) => {
  return (
    <Fragment>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <VStack
        flex={1}
        _light={{ bg: "bg.light" }}
        _dark={{ bg: "bg.dark" }}
        height="100%"
        width="100%"
        alignItems="center"
      >
        <Hidden platform={["android", "ios"]}>
          <Navbar navigation={navigation} route={route} />
        </Hidden>

        <VStack
          maxW={`${APP_WITH_LIMIT}px`}
          flex={1}
          width="100%"
          height="100%"
          alignItems="center"
        >
          <ScrollView flex={1} width="100%">
            {children}
            <Hidden platform={["android", "ios"]}>
              <Footer navigation={navigation} route={route} />
            </Hidden>
          </ScrollView>
        </VStack>
      </VStack>

      <Hidden platform={["web"]}>
        <BottomBar navigation={navigation} route={route} />
      </Hidden>
    </Fragment>
  );
};

export default Layout;
