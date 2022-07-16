import { NavigationContainer } from "@react-navigation/native";
import * as React from "react";
import Error from "../../screens/error/Error";
import { RootStackParamList } from "../../@types/types";
import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { darkTheme, lightTheme, theme } from "../../constants/theme";
import useStore from "../../stores/store";
import SignIn from "../../screens/authentication/SignIn";
import SignUp from "../../screens/authentication/SignUp";
import Security from "../../screens/account/Security";
import Home from "../../screens/home/Home";
import OnBoarding from "../../screens/onBoarding/OnBoarding";
import NotFound from "../../screens/error/NotFound";
import { createStackNavigator } from "@react-navigation/stack";
import Header from "../layout/Header";
import { bottomRoutes } from "../layout/BottomNavigator";
import Models from "../../screens/ai/Models";
import Model from "../../screens/ai/Model";
import Articles from "../../screens/blog/Articles";
import Portfolio from "../../screens/blog/Portfolio";
import Account from "../../screens/account/Account";
import { drawerRoutes } from "../layout/DrawerNavigator";

export type CustomRoute = {
  path: string;
  component: React.FC<any>;
  icon?: React.FC<any>;
  access?: string;
  title?: string;
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
    }
  ],

  Home: [
    {
      path: "/",
      component: Home,
      title: "home",
      modal: true
    },
  ],

  AI: [
    {
      path: "/models",
      component: Models,
      title: "models",
      modal: true
    },
    {
      path: "/model/:id",
      component: Model,
      title: "model",
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
    }
  ],

  Account: [
    {
      path: "/me",
      component: Account,
      title: "account",
    },
    {
      path: "/security",
      component: Security,
      title: "security"
    },
  ],

  Blog: [
    {
      path: "/articles",
      component: Articles,
      title: "articles",
    },
    {
      path: "/portfolio",
      component: Portfolio,
      title: "portfolio"
    },
  ],

  Error: [
    { path: "error", component: Error, title: "error" },
    { path: "*", component: NotFound }
  ],

};


const Stack = createStackNavigator();

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



  const renderScreen = (routeGroup: CustomRoute, routeName: string) => {
    return (
      <Stack.Screen
        key={routeGroup.component.name}
        name={routeGroup.component.name as keyof RootStackParamList}
        component={routeGroup.component}
        options={({ navigation }) => ({
          title: routeGroup.title,
          headerTitle: routeGroup.title,
          headerShown: routeGroup.hideHeader ? false : true,
          headerTintColor: theme.colors.headerControls
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
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}

        screenListeners={({ navigation, route }) => ({
          
          state: (e) => {
            
            bottomRoutes.map((currentRoute, index)=> {
              if(currentRoute.key === route.name) return store.setBottomBarSelectedIndex(index);
            })

            drawerRoutes.map((currentRoute, index)=> {
              if(currentRoute.key === route.name) return store.setDrawerSelectedIndex(index);
            })
            
          },
        })}
      >
        {Object.keys(routes).map((routeName: string) =>
          routes[routeName].map((routeGroup: CustomRoute) =>
            // @ts-ignore
            <Stack.Group screenOptions={routeGroup.modal ? { presentation: "modal" } : {}}>{renderScreen(routeGroup, routeName)}</Stack.Group>
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


