import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import Error from "../../screens/error/Error";
import { RootStackParamList } from "../../@types/types";
import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { darkTheme, lightTheme } from "../../constants/theme";
import useStore from "../../stores/store";
import Home from "../../screens/home/Home";
import OnBoarding from "../../screens/onBoarding/OnBoarding";
import NotFound from "../../screens/error/NotFound";
import { createDrawerNavigator } from '@react-navigation/drawer';
import Header from "../layout/Header";
import { bottomRoutes } from "../layout/BottomNavigator";
import Models from "../../screens/ai/Models";
import Account from "../../screens/account/Account";


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
  const defaultScreenOptions = {
    headerShown: false,
  }

  return (
    <NavigationContainer
      linking={linking}
      theme={colorScheme === "dark" ? darkTheme : lightTheme}
    >
      <Drawer.Navigator initialRouteName="OnBoarding"
        screenOptions={{
          header: (props) => <Header {...props} />,
        }}

        screenListeners={({ route }) => ({
          state: () => {
            bottomRoutes.map((currentRoute, index) => {
              if (currentRoute.key === route.name) return store.setBottomBarSelectedIndex(index);
            })
            // console.log(route.name);
            // drawerRoutes.map((currentRoute, index) => {
            //   if (currentRoute.key === route.name) return store.setDrawerSelectedIndex(index);
            // })
          },
        })}
      >
        <Drawer.Screen name="OnBoarding" component={OnBoarding} options={{...defaultScreenOptions, title: "on_boarding" }} />
        <Drawer.Screen name="Home" component={Home} options={{...defaultScreenOptions, title: "home", headerShown: false }} />
        <Drawer.Screen name="Models" component={Models} options={{...defaultScreenOptions, title: "models" }} />
        <Drawer.Screen name="Account" component={Account} options={{...defaultScreenOptions, title: "account" }} />
        <Drawer.Screen name="Error" component={Error} options={{...defaultScreenOptions, title: "error" }} />
        <Drawer.Screen name="NotFound" component={NotFound} options={{...defaultScreenOptions, title: "not_foundnot_found" }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


