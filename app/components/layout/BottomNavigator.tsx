import React from "react";
import useStore from "../../stores/store";
import { BottomNavigation } from 'react-native-paper';
import theme from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { FULL_WIDTH } from "../../constants/layout";

export const bottomRoutes = [
  {
    id: 0,
    title: "home",
    key: "Home",
    focusedIcon: "home",
    unfocusedIcon: 'home-outline',
  },
  {
    id: 1,
    title: "settings",
    key: "Settings",
    focusedIcon: "cog",
    unfocusedIcon: 'cog',
  }
];

const BottomNavigator: React.FC = () => {

  const renderScene = BottomNavigation.SceneMap({
    Home: ()=> null,
    Settings: ()=> null,
  });

  const selected = useStore((state) => state.bottomBarSelectedIndex);
  const navigation = useNavigation();

  return (
    <BottomNavigation
      style={{minHeight: 70, backgroundColor: theme.colors.headerControls, width: FULL_WIDTH}}
      navigationState={{ index: selected, routes: bottomRoutes }}
      onIndexChange={()=> null}
      renderScene={renderScene}
      // @ts-ignore
      onTabPress={(route)=> navigation.navigate(route.route.key)}
    />
  )
};

export default BottomNavigator;
