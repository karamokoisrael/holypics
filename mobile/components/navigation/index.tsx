import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import * as React from "react";
import { Platform } from "react-native";
import Error from "../../screens/error/Error";
import Home from "../../screens/home/Home";
import { RootStackParamList } from "../../@types/types";
import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import AccountLocked from "../../screens/error/AccountLocked";
import OnBoardingStep1 from "../../screens/onBoarding/OnBoardingStep1";
import OnBoardingStep3 from "../../screens/onBoarding/OnBoardingStep2";
import OnBoardingStep2 from "../../screens/onBoarding/OnBoardingStep3";
import TermsAndUse from "../../screens/other/TermsAndUse";
import { darkTheme, lightTheme, theme } from "../../constants/theme";
import Search from "../../screens/product/Search";
import useStore from "../../stores/store";
import Category from "../../screens/category/notification/Category";
import Categories from "../../screens/category/notification/Categories";
import { bottomRoutes } from "../layout/BottomBar";
import SignIn from "../../screens/authentication/SignIn";
import OtpVerification from "../../screens/authentication/OtpVerification";
import ForgotPassword from "../../screens/authentication/ForgotPassword";
import SignUp from "../../screens/authentication/SignUp";
import ReinitPassword from "../../screens/authentication/ReinitPassword";
import Notifications from "../../screens/notification/Notifications";
import Checkout from "../../screens/order/Checkout";
import ShoppingCard from "../../screens/order/ShoppingCard";
import Security from "../../screens/account/Security";
import Account from "../../screens/account/Account";

type Route = {
  path: string;
  component: React.FC<any>;
  icon?: React.FC<any>;
  access?: string;
  title?: string;
  inDrawer?: boolean;
  modal?: boolean;
  directLink?: boolean;
  allowGoBack?: boolean;
  onlyChildren?: boolean;
  children?: Route[];
};
type RouteGroup = Array<Route>;
type Routes = Record<string, RouteGroup>;

export const routes: Routes = {
  Home: [
    {
      path: "*",
      component: Home,
      title: "Accueil",
      inDrawer: true,
      // icon: () => (
      //   <Icon
      //     mb="1"
      //     // @ts-ignore
      //     as={<MaterialCommunityIcons name={"home"} />}
      //     color="primary.500"
      //     size="sm"
      //   />
      // ),
    },
  ],

  Account: [
    {
      path: "/",
      component: Account,
      title: "Mon compte",
      // inDrawer: true,
    },
    { path: "security", component: Security, title: "Sécurité" },
  ],

  Order: [
    {
      path: "shopping-card",
      component: ShoppingCard,
      title: "Panier",
      // inDrawer: true,
    },
    { path: "checkout", component: Checkout, title: "Caisse" },
  ],

  Search: [
    { path: "/", component: Search, title: "Recherche", inDrawer: true },
  ],

  Notification: [
    {
      path: "/",
      component: Notifications,
      title: "Notifications",
      // inDrawer: true,
    },
  ],

  Category: [
    {
      path: "/:id",
      component: Category,
      title: "Catégorie",
      inDrawer: false,
    },
    {
      path: "/all",
      component: Categories,
      title: "Catégories",
      inDrawer: true,
    },
  ],

  Other: [
    {
      path: "terms-and-use",
      component: TermsAndUse,
      title: "Termes et conditions",
      inDrawer: true,
    },
  ],

  Authentication: [
    {
      path: "sign-in",
      component: SignIn,
      access: "only-disconnected",
      allowGoBack: true,
      title: "Se connecter",
    },
    {
      path: "otp",
      component: OtpVerification,
      access: "only-disconnected",
      title: "Code de vérification",
    },
    {
      path: "forgot-password",
      component: ForgotPassword,
      access: "only-disconnected",
      title: "Mot de passe oublié",
    },
    {
      path: "sign-up",
      component: SignUp,
      access: "only-disconnected",
      title: "Inscription",
    },
    {
      path: "reinit-password",
      component: ReinitPassword,
      access: "only-disconnected",
      title: "Réinitialisation de mot de passe",
    },
  ],

  Error: [
    {
      path: "account-locked",
      component: AccountLocked,
      access: "only-disconnected",
      title: "Compte bloqué",
    },
    { path: "error", component: Error, title: "Erreur" },
    // { path: "*", component: NotFound }
  ],

  OnBoarding: [
    { path: "step-1", component: OnBoardingStep1, title: "Créer un wallet" },
    { path: "step-2", component: OnBoardingStep2, title: "Mes wallets" },
    { path: "step-3", component: OnBoardingStep3, title: "Hey" },
  ],
};

const Drawer = createDrawerNavigator<RootStackParamList>();

export default function Navigation() {
  const linking: LinkingOptions<RootStackParamList> = {
    prefixes: [Linking.makeUrl("/")],
    config: {
      screens: {},
    },
  };

  const renderDrawer = (routeGroup: Route, routeName: string) => {
    const store = useStore();

    return (
      <Drawer.Screen
        key={routeGroup.component.name}
        name={routeGroup.component.name as keyof RootStackParamList}
        component={routeGroup.component}
        options={{
          drawerItemStyle:
            routeGroup.inDrawer === true ? {} : { display: "none" },
          headerShown: Platform.OS !== "web",
          title: routeGroup.title,
          drawerIcon:
            routeGroup.icon != undefined ? routeGroup.icon : undefined,
          drawerActiveTintColor: theme.colors.text[600],
          drawerActiveBackgroundColor: theme.colors.primary[100],
          headerTintColor: theme.colors.primary[500],
        }}
        listeners={({ navigation, route }) => ({
          drawerItemPress: (e) => {
            let barSet = false;
            bottomRoutes.forEach((currentRoute) => {
              if (route.name == currentRoute.path) {
                barSet = true;
                store.setBottomBarSelectedIndex(currentRoute.id);
              }
              return;
            });
            if(!barSet) store.setBottomBarSelectedIndex(10);
          },
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
          route.path != "*" && route.path != "" && route.directLink != true
            ? `${routeName.toLocaleLowerCase()}/${route.path}`
            : route.path;
      } catch (error) {
        console.log("route error => ", error);
      }
    });
  });

  return (
    <NavigationContainer
      linking={linking}
      theme={theme.config.initialColorMode === "dark" ? darkTheme : lightTheme}
    >
      {/* @ts-ignore */}
      <Drawer.Navigator>
        {Object.keys(routes).map((routeName: string) =>
          routes[routeName].map((routeGroup: Route) =>
            routeGroup.onlyChildren ? (
              // @ts-ignore
              <Drawer.Group>{renderDrawer(routeGroup, routeName)}</Drawer.Group>
            ) : routeGroup.modal == true ? (
              // @ts-ignore
              <Drawer.Group screenOptions={{ presentation: "modal" }}>
                {renderDrawer(routeGroup, routeName)}
              </Drawer.Group>
            ) : (
              renderDrawer(routeGroup, routeName)
            )
          )
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
