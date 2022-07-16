import React from "react";
import useStore from "../../stores/store";
import { BottomNavigation } from 'react-native-paper';
import theme from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import { FULL_WIDTH } from "../../constants/layout";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import I18n from "i18n-js";


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
    title: "articles",
    key: "Articles",
    focusedIcon: "newspaper",
    unfocusedIcon: 'newspaper-variant',
  },
  {
    id: 2,
    title: "models",
    key: "Models",
    focusedIcon: "camera",
    unfocusedIcon: 'camera-outline',
  },
  {
    id: 3,
    title: "account",
    key: "Account",
    focusedIcon: "account",
    unfocusedIcon: 'account-outline',
  },

];

const BottomNavigator: React.FC = () => {

  const insets = useSafeAreaInsets();
  
  const renderScene = BottomNavigation.SceneMap({
    Home: () => null,
    Articles: () => null,
    Models: () => null,
    Account: () => null,
  });

  const store = useStore();
  const selected = useStore((state) => state.bottomBarSelectedIndex);
  const navigation = useNavigation();

  return (
      <BottomNavigation
        style={{ minHeight: 70, backgroundColor: theme.colors.primary, width: FULL_WIDTH, marginBottom: insets.bottom }}
        navigationState={{ index: selected, routes: bottomRoutes.map((item)=> {return {...item, title: I18n.t(item.title)}}) }}
        onIndexChange={() => null}
        renderScene={renderScene}
        activeColor={theme.colors.primary}
        
        // style={{backgroundColor: theme.colors.primary}}
        // @ts-ignore
        onTabPress={(route) => { navigation.navigate(route.route.key); store.setBottomBarSelectedIndex(route.route.id) }}
      />
  )
};

export default BottomNavigator;
