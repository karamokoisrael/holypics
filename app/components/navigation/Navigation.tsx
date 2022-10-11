import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import Error from "../../screens/error/Error";
import { RootStackParamList } from "../../@types/types";
import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import theme, { darkTheme, lightTheme } from "../../constants/theme";
import useStore from "../../stores/store";
import Home from "../../screens/home/Home";
import OnBoarding from "../../screens/onBoarding/OnBoarding";
import NotFound from "../../screens/error/NotFound";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Header from "../layout/Header";
import { bottomRoutes } from "../layout/BottomNavigator";
import Account from "../../screens/account/Account";
import I18n from "i18n-js";
import StableDiffusion from "../../screens/ai/StableDiffusion";
import Model from "../../screens/ai/Model";


export type CustomRoute = {
  // path: string;
  component: React.FC<any>;
  icon?: React.FC<any>;
  access?: string;
  title?: string;
  modal?: boolean;
  directLink?: boolean;
  hideTitle?: boolean;
  hideHeader?: boolean;
};


export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      OnBoarding: "/on-boarding",
      Home: '/',
      Model: '/model',
      StableDiffusion: '/stable-diffusion',
      Account: '/me',
      Error: '/error',
      NotFound: '*'
    },
  },
};

const Drawer = createDrawerNavigator();

type NavigationProps = {
  colorScheme: "dark" | "light"
}

export default function Navigation({ colorScheme }: NavigationProps) {
  const store = useStore();
  const t = (text: string) => I18n.t(text) || ""


  const defaultScreenOptions = {
    headerShown: true,
    // drawerActiveTintColor: theme.colors.headerControls,
    // drawerActiveBackgroundColor: theme.colors.primary,
    // headerLeft: routeGroup.modal ? () => <Appbar.Action icon="arrow-left" color={theme.colors.headerControls} onPress={() => navigation.goBack()} /> : undefined,
    // headerStyle: { maxWidth: FULL_WIDTH, minWidth: FULL_WIDTH},
    // headerTitle: routeGroup.hideTitle ? "" : undefined,
    // headerTintColor: theme.colors.headerControls,

    // @ts-ignore
    drawerActiveBackgroundColor: theme.colors.primaryOpac,
    // @ts-ignore
    // drawerActiveTintColor: theme.colors.primary
    back: true
  }
  const drawerHiddenOptions = {
    drawerItemStyle: { display: "none" } as any
  }

  return (
    <NavigationContainer
      linking={linking}
      theme={colorScheme === "dark" ? darkTheme : lightTheme}
    >
      <Drawer.Navigator initialRouteName="Home"
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}

        screenListeners={({ route }) => ({
          state: () => {
            bottomRoutes.map((currentRoute, index) => {
              if (currentRoute.key === route.name) return store.setBottomBarSelectedIndex(index);
            })
          },
        })}
      >
        <Drawer.Screen name="Home" component={Home} options={{ ...defaultScreenOptions, title: "home", drawerLabel: t("home"), ...{ back: false } }} />
        <Drawer.Screen name="OnBoarding" component={OnBoarding} options={{ ...defaultScreenOptions, ...drawerHiddenOptions, title: t("on_boarding"), headerShown: false }} />
        <Drawer.Screen name="Account" component={Account} options={{ ...defaultScreenOptions, title: "account", drawerLabel: t("account"), headerTitle: t("account") }} />
        <Drawer.Screen name="StableDiffusion" component={StableDiffusion} options={{ ...defaultScreenOptions, title: "stable_diffusion", drawerLabel: "Stable Diffusion" }} />
        <Drawer.Screen name="Model" component={Model} options={{ ...defaultScreenOptions, ...drawerHiddenOptions, title: "model" }} />
        <Drawer.Screen name="Error" component={Error} options={{ ...defaultScreenOptions, ...drawerHiddenOptions, title: "error", }} />
        <Drawer.Screen name="NotFound" component={NotFound} options={{ ...defaultScreenOptions, ...drawerHiddenOptions, title: "not_found", }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


