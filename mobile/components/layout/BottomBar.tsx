import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { ComponentWithNavigationProps } from "../../@types/component";
import { Box, Center, Icon, Pressable, Text } from "native-base";
import React from "react";
import useStore from "../../stores/store";

export const bottomRoutes = [
  {
    id: 0,
    title: "Accueil",
    path: "Home",
  },
  {
    id: 1,
    title: "Mon compte",
    path: "Account",
  },
  {
    id: 2,
    title: "Recherche",
    path: "Search",
  },
  {
    id: 3,
    title: "Panier",
    path: "ShoppingCard",
  },
];

const BottomBar: React.FC<ComponentWithNavigationProps> = ({
  navigation,
  route,
}) => {
  const store = useStore();
  const selected = useStore((state) => state.bottomBarSelectedIndex);

  const routes = [
    {
      ...bottomRoutes[0],
      icon: (
        <Icon
          mb="1"
          as={
            <MaterialCommunityIcons
              name={selected === 0 ? "home" : "home-outline"}
            />
          }
          _light={{ color: "white" }}
          _dark={{ color: selected === 0 ? "primary.500" : "white" }}
          size="sm"
        />
      ),
    },
    {
      ...bottomRoutes[1],
      icon: (
        <Icon
          mb="1"
          as={
            <MaterialCommunityIcons
              name={selected === 1 ? "account" : "account-outline"}
            />
          }
          _light={{ color: "white" }}
          _dark={{ color: selected === 1 ? "primary.500" : "white" }}
          size="sm"
        />
      ),
    },
    {
      ...bottomRoutes[2],
      icon: (
        <Icon
          mb="1"
          as={<MaterialIcons name="search" />}
          _light={{ color: "white" }}
          _dark={{ color: selected === 2 ? "primary.500" : "white" }}
          size="sm"
        />
      ),
    },
    {
      ...bottomRoutes[3],
      icon: (
        <Icon
          mb="1"
          as={
            <MaterialCommunityIcons
              name={selected === 3 ? "cart" : "cart-outline"}
            />
          }
          _light={{ color: "white" }}
          _dark={{ color: selected === 3 ? "primary.500" : "white" }}
          color="white"
          size="sm"
        />
      ),
    },
  ];

  return (
    <Box
      _light={{ bg: "primary.600" }}
      _dark={{ bg: "bg.dark" }}
      flexDirection="row"
      width="100%"
      maxHeight={"100px"}
      padding={0}
      margin={0}
    >
      {routes.map((route) => (
        <Pressable
          key={route.id}
          opacity={selected === route.id ? 1 : 0.5}
          py="3"
          flex={1}
          onPress={() => {
            store.setBottomBarSelectedIndex(route.id);
            navigation.navigate(route.path);
          }}
        >
          <Center>
            {route.icon}
            <Text
              _light={{ color: "white" }}
              _dark={{ color: selected === route.id ? "primary.500" : "white" }}
              fontSize="12"
            >
              {route.title}
            </Text>
          </Center>
        </Pressable>
      ))}
    </Box>
  );
};

export default BottomBar;
