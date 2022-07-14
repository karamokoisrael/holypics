import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import Error from "../../screens/error/Error";
import { RootStackParamList } from "../../@types/types";
import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import TermsAndUse from "../../screens/other/TermsAndUse";
import { darkTheme, lightTheme, theme } from "../../constants/theme";
import useStore from "../../stores/store";
import { bottomRoutes } from "../layout/BottomNavigator";
import SignIn from "../../screens/authentication/SignIn";
import SignUp from "../../screens/authentication/SignUp";
import Security from "../../screens/account/Security";
import Settings from "../../screens/account/Settings";
import Home from "../../screens/home/Home";
import PinLocked from "../../screens/authentication/PinLocked";
import OnBoarding from "../../screens/onBoarding/OnBoarding";
import NotFound from "../../screens/error/NotFound";
import { Appbar } from "react-native-paper";
import Legal from "../../screens/onBoarding/Legal";
import I18n from "i18n-js";
import BackupWallet from "../../screens/onBoarding/BackupWallet";
import { FULL_WIDTH } from "../../constants/layout";

export type CustomRoute = {
  path: string;
  component: React.FC<any>;
  icon?: React.FC<any>;
  access?: string;
  title?: string;
  inDrawer?: boolean;
  modal?: boolean;
  directLink?: boolean;
  hideTitle?: boolean;
  hideHeader?: boolean;
};

type RouteGroup = Array<CustomRoute>;
type Routes = Record<string, RouteGroup>;

export const routes: Routes = {

  OnBoarding: [
    {
      path: "/on-boarding",
      component:
        OnBoarding,
      title: "on_boarding",
      hideHeader: true
    },
    {
      path: "/legal",
      component:
        Legal,
      title: "legal",
      modal: true
    },
    {
      path: "/backup-wallet",
      component:
        BackupWallet,
      title: "backup_wallet",
      modal: true
    }
  ],

  Home: [
    {
      path: "/",
      component: Home,
      title: I18n.t("home"),
      inDrawer: true,
      modal: true
    },
  ],
  
  Authentication: [
    {
      path: "sign-up",
      component: SignUp,
      access: "only-disconnected",
      title: "sign_up",
      modal: true,
      hideTitle: true
    },
    {
      path: "sign-in",
      component: SignIn,
      access: "only-disconnected",
      title: "SignIn",
      hideHeader: true
    },
    {
      path: "pin-locked",
      component: PinLocked,
      access: "only-disconnected",
      title: "Pin Locked",
      hideHeader: true
    }
  ],


  Account: [
    {
      path: "/settings",
      component: Settings,
      title: "settings",
    },
    {
      path: "/security",
      component: Security,
      title: "security"
    },
  ],

  Other: [
    {
      path: "terms-and-use",
      component: TermsAndUse,
      title: "Termes et conditions"
    },
  ],

  Error: [
    { path: "error", component: Error, title: "error" },
    { path: "*", component: NotFound }
  ],

};

const Drawer = createDrawerNavigator<RootStackParamList>();

type NavigationProps = {
  colorMode: "dark" | "light"
}
export default function Navigation({ colorMode }: NavigationProps) {
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [Linking.makeUrl("/")],
    config: {
      screens: {},
    },
  };

  const renderDrawer = (routeGroup: CustomRoute, routeName: string) => {
    return (
      <Drawer.Screen
        key={routeGroup.component.name}
        name={routeGroup.component.name as keyof RootStackParamList}
        component={routeGroup.component}
        options={({ navigation }) => ({
          title: routeGroup.title,
          drawerActiveTintColor: theme.colors.headerControls,
          drawerActiveBackgroundColor: theme.colors.primary,
          headerLeft: routeGroup.modal ? () => <Appbar.Action icon="arrow-left" color={theme.colors.headerControls} onPress={() => navigation.goBack()} /> : undefined,
          headerStyle: { maxWidth: FULL_WIDTH, minWidth: FULL_WIDTH},
          headerTitle: routeGroup.hideTitle ? "" : undefined,
          // headerShown: routeGroup.hideHeader ? false : undefined,
          headerShown: false,
          headerTintColor: theme.colors.headerControls,
          drawerItemStyle:
            routeGroup.inDrawer === true ? {} : { display: "none" },
          // @ts-ignore
          drawerActiveBackgroundColor: theme.colors.headerControls,
          // @ts-ignore
          drawerActiveTintColor: theme.colors.primary
        })}
      />
    );
  };

  Object.keys(routes).forEach((routeName: string) => {
    // @ts-ignore
    linking.config.screens[routeName] = {};

    routes[routeName].forEach((route: any) => {
      try {
        // @ts-ignore
        linking.config.screens[route.component.name] =
          route.path != "*" && route.path != "" && route.path != "/" && route.directLink != true
            ? `${routeName.toLocaleLowerCase()}/${route.path}`
            : route.path;
      } catch (error) { }
    });
  });

  const store = useStore();

  return (
    <NavigationContainer
      linking={linking}
      theme={colorMode === "dark" ? darkTheme : lightTheme}

    >
      {/* @ts-ignore */}
      <Drawer.Navigator listeners={({ route }) => ({
        drawerItemPress: () => {
          let barSet = false;
          bottomRoutes.forEach((currentRoute) => {
            if (route.name == currentRoute.key) {
              barSet = true;
              store.setBottomBarSelectedIndex(currentRoute.id);
            }
            return;
          });
          if (!barSet) store.setBottomBarSelectedIndex(10);
        },
      })}>
        {Object.keys(routes).map((routeName: string) =>
          routes[routeName].map((routeGroup: CustomRoute) =>
            // @ts-ignore
            <Drawer.Group screenOptions={routeGroup.modal ? { presentation: "modal" } : {}}>{renderDrawer(routeGroup, routeName)}</Drawer.Group>
          )
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
