import React, { useEffect, useState } from "react";
import {
  Box,
  HStack,
  Icon,
  Image,
  Input,
  Pressable,
  Button,
  IconButton,
  Hidden
} from "native-base";

import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Hoverable } from "react-native-web-hover";
import { ComponentWithNavigationProps } from "../../@types/component";
import useStore from "../../stores/store";
import { Category } from "../../@types/category";
import { Store } from "../../@types/store";
import { getImageUrl } from "../../helpers/utils";
import { FlatList } from "react-native-gesture-handler";
import { APP_WITH_LIMIT } from "../../constants/layout";

export type Props = {
  navigation: any;
};
export default function Navbar({
  navigation,
  route,
}: ComponentWithNavigationProps) {

  return (
    <Box
      px={{ base: "4", md: "8" }}
      pt={{ base: "4", md: "3" }}
      pb={{ base: "5", md: "3" }}
      borderBottomWidth={{ md: "1" }}
      _dark={{ bg: "coolGray.900", borderColor: "coolGray.700" }}
      _light={{
        bg: { base: "white", md: "white" },
        borderColor: "coolGray.200",
      }}
      width="100%"
    >
      {/* Desktop header */}
      <HStack alignItems="center" justifyContent="space-around" width="100%">
        <HStack
          alignItems="center"
          justifyContent="space-between"
          maxW={`${APP_WITH_LIMIT}px`}
          width="100%"
        >
          <HStack space="8" alignItems="center">
            <IconButton
              variant="ghost"
              colorScheme="light"
              icon={
                <Icon
                  size="6"
                  name="menu-sharp"
                  as={Ionicons}
                  _light={{ color: "coolGray.800" }}
                  _dark={{ color: "coolGray.50" }}
                />
              }
              onPress={() => navigation.toggleDrawer()}
            />
            <Pressable onPress={() => navigation.navigate("Home")}>
              <Image
                w="60"
                h="12"
                rounded="sm"
                src={require("../../assets/img/logo-dark.png")}
              />
            </Pressable>
          </HStack>

          <Hidden from="base" till="lg">
            <HStack space="8" alignItems="center">
              <Input
                px="4"
                w="100%"
                size="md"
                placeholder="Search"
                InputLeftElement={
                  <Icon
                    px="2"
                    size="4"
                    name={"search"}
                    as={FontAwesome}
                    _light={{
                      color: "coolGray.400",
                    }}
                    _dark={{
                      color: "coolGray.100",
                    }}
                  />
                }
              />
              <Button
                py="2"
                px="2"
                borderRadius="4"
                variant="subtle"
                _text={{
                  _dark: { color: "text.50" },
                  _light: { color: "text.50" },
                  fontWeight: "normal",
                }}
                //@ts-ignore
                _light={{ colorScheme: "primary" }}
                backgroundColor="primary.900"
                _hover={{ backgroundColor: "primary.700" }}
              >
                RECHERCHER
              </Button>
            </HStack>
          </Hidden>
          <HStack space="8" alignItems="center">
            <HStack space="5" alignItems="center">
              <Hidden only={["md", "lg", "xl"]}>
                <IconButton
                  icon={
                    <Icon
                      size="6"
                      _dark={{ color: "coolGray.50" }}
                      _light={{ color: "coolGray.400" }}
                      as={Ionicons}
                      name={"search"}
                      onPress={() => navigation.navigate("Search")}
                    />
                  }
                />
              </Hidden>
              <IconButton
                icon={
                  <Icon
                    size="6"
                    _dark={{ color: "coolGray.50" }}
                    _light={{ color: "coolGray.400" }}
                    as={Ionicons}
                    name={"person"}
                    onPress={() => navigation.navigate("Account")}
                  />
                }
              />

              <IconButton
                icon={
                  <Icon
                    size="6"
                    _dark={{ color: "coolGray.50" }}
                    _light={{ color: "coolGray.400" }}
                    as={Feather}
                    name={"shopping-cart"}
                    onPress={() => navigation.navigate("ShoppingCard")}
                  />
                }
              />
            </HStack>
          </HStack>
        </HStack>
      </HStack>
    </Box>
  );
}
