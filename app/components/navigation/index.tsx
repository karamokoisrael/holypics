import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import Error from "../../screens/error/Error";
import { RootStackParamList } from "../../@types/types";
import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { darkTheme, lightTheme } from "../../constants/theme";
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
  colorScheme: "dark" | "light"
}

export default function Navigation({ colorScheme }: NavigationProps) {
  const store = useStore();
  const defaultScreenOptions = {
    headerShown: false,
  }
  return (
    <NavigationContainer
      linking={linking}
      theme={colorScheme === "dark" ? darkTheme : lightTheme}
    >
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}

        screenListeners={({ route }) => ({
          state: () => {
            bottomRoutes.map((currentRoute, index) => {
              if (currentRoute.key === route.name) return store.setBottomBarSelectedIndex(index);
            })
            drawerRoutes.map((currentRoute, index) => {
              if (currentRoute.key === route.name) return store.setDrawerSelectedIndex(index);
            })
          },
        })}
      >
        <Stack.Screen name="OnBoarding" component={OnBoarding} options={{...defaultScreenOptions, title: "on_boarding" }} />
        <Stack.Screen name="Home" component={Home} options={{...defaultScreenOptions, title: "home" }} />
        <Stack.Screen name="Models" component={Models} options={{...defaultScreenOptions, title: "models" }} />
        <Stack.Screen name="Model" component={Model} options={{...defaultScreenOptions, title: "model", headerShown: true, headerTitle: "model" }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{...defaultScreenOptions, title: "sign_up" }} />
        <Stack.Screen name="SignIn" component={SignIn} options={{...defaultScreenOptions, title: "sign_in" }} />
        <Stack.Screen name="Account" component={Account} options={{...defaultScreenOptions, title: "account" }} />
        <Stack.Screen name="Security" component={Security} options={{...defaultScreenOptions, title: "security" }} />
        <Stack.Screen name="Articles" component={Articles} options={{...defaultScreenOptions, title: "articles" }} />
        <Stack.Screen name="Portfolio" component={Portfolio} options={{...defaultScreenOptions, title: "portfolio" }} />
        <Stack.Screen name="Error" component={Error} options={{...defaultScreenOptions, title: "error" }} />
        <Stack.Screen name="NotFound" component={NotFound} options={{...defaultScreenOptions, title: "not_foundnot_found" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


