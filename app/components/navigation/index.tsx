import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
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

type RouteGroup = Array<CustomRoute>;
type Routes = Record<string, RouteGroup>;


export const routes: Routes = {

  OnBoarding: [
    {
      component:
        OnBoarding,
      title: "on_boarding",
      hideHeader: true
    }
  ],

  Home: [
    {
      component: Home,
      title: "home",
      modal: true
    },
  ],

  AI: [
    {
      component: Models,
      title: "models",
      modal: true
    },
    {
      component: Model,
      title: "model",
      modal: false
    },
  ],

  Authentication: [
    {
      component: SignUp,
      access: "only-disconnected",
      title: "sign_up",
      modal: true,
      hideTitle: true
    },
    {
      component: SignIn,
      access: "only-disconnected",
      title: "SignIn",
      hideHeader: true
    }
  ],

  Account: [
    {
      component: Account,
      title: "account",
    },
    {
      component: Security,
      title: "security"
    },
  ],

  Blog: [
    {
      component: Articles,
      title: "articles",
    },
    {
      component: Portfolio,
      title: "portfolio"
    },
  ],

  Error: [
    { 
      component: Error, 
      title: "error" 
    },
    { 
      component: NotFound,
      title: "not_found"
    }
  ],

};

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      OnBoarding: "/on-boarding",
      Home: '/',
      Models: '/models',
      Model: "/model/:id",
      SignUp: "/sign-up",
      SignIn: "sign-in",
      Account: '/me',
      Security: '/security',
      Articles: '/articles',
      Portfolio: '/portfolio',
      Error: '/error',
      NotFound: '*'
    },
  },
};

const Stack = createStackNavigator();

type NavigationProps = {
  colorMode: "dark" | "light"
}

export default function Navigation({ colorMode }: NavigationProps) {

  const renderScreen = (routeGroup: CustomRoute) => {
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

  const store = useStore();

  return (
    <NavigationContainer
      linking={linking}
      theme={colorMode === "dark" ? darkTheme : lightTheme}

    >
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}

        screenListeners={({ navigation, route }) => ({

          state: (e) => {

            bottomRoutes.map((currentRoute, index) => {
              if (currentRoute.key === route.name) return store.setBottomBarSelectedIndex(index);
            })

            drawerRoutes.map((currentRoute, index) => {
              if (currentRoute.key === route.name) return store.setDrawerSelectedIndex(index);
            })

          },
        })}
      >
        {Object.keys(routes).map((routeName: string) =>
          routes[routeName].map((routeGroup: CustomRoute) =>
            // @ts-ignore
            <Stack.Group screenOptions={routeGroup.modal ? { presentation: "modal" } : {}}>{renderScreen(routeGroup)}</Stack.Group>
          )
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


