import React, { useEffect, useState } from "react";
import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Avatar,
  Image,
  Input,
  Pressable,
  Button,
  IconButton,
  Hidden,
  Menu,
  Spacer,
} from "native-base";

import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Hoverable } from "react-native-web-hover";
import { ComponentWithNavigationProps } from "../../@types/component";
import useStore from "../../context/store";
import { Category } from "../../@types/category";
import { Store } from "../../@types/store";
import { getImageUrl } from "../../helpers/utils";
import { FlatList } from "react-native-gesture-handler";

export type Props = {
  navigation: any;
};
export default function Navbar({
  navigation,
  route,
}: ComponentWithNavigationProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    useStore.subscribe((state: Store) => {
      setCategories(state.configs.categories);
    });
  }, []);

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
          maxW="1184px"
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
                src={require("../../assets/images/logo-bg-square.png")}
              />
            </Pressable>

            <Hidden from="base" till="md">
              <Box h="80%" w="90%" alignItems="flex-start">
                <Menu
                  w="100%"
                  trigger={(triggerProps) => {
                    return (
                      <Button
                        {...triggerProps}
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
                        backgroundColor="primary.900"
                        _hover={{ backgroundColor: "primary.700" }}
                        endIcon={
                          <Icon
                            size="6"
                            name="angle-down"
                            as={FontAwesome}
                            _light={{ color: "coolGray.800" }}
                            _dark={{ color: "coolGray.50" }}
                          />
                        }
                      >
                        Catégories
                      </Button>
                    );
                  }}
                >
                  {categories.map((category: Category) => {
                    return (
                      <Menu.Item key={category.id}>
                        <Hoverable>
                          {({ hovered }) => (
                            <>
                              <Pressable
                                marginBottom={hovered ? 2 : 0}
                                onPress={() =>
                                  navigation.navigate(`Category`, {
                                    id: category.id,
                                  })
                                }
                              >
                                <VStack
                                  display={"flex"}
                                  alignItems={"center"}
                                  justifyContent={"flex-start"}
                                  flexDirection={"row"}
                                  width={"100%"}
                                >
                                  <Avatar
                                    alignSelf="center"
                                    size="md"
                                    source={{
                                      uri: getImageUrl(category.thumb),
                                    }}
                                  ></Avatar>
                                  <Text marginLeft={10}>{category.name}</Text>
                                </VStack>
                              </Pressable>
                              {hovered ? (
                                <FlatList
                                  data={category.sub_categories}
                                  renderItem={({ item }) => (
                                    <VStack
                                      display={"flex"}
                                      alignItems={"center"}
                                      justifyContent={"flex-start"}
                                      flexDirection={"row"}
                                      width={"100%"}
                                    >
                                      {/* <Avatar alignSelf="center" size="xs" source={{uri: getImageUrl(item.thumb)}}></Avatar> */}
                                      <Hoverable>
                                        {(subCatHoverProps) => (
                                          <Text
                                            fontWeight={
                                              subCatHoverProps.hovered
                                                ? "bolder"
                                                : "medium"
                                            }
                                          >
                                            {item.name}
                                          </Text>
                                        )}
                                      </Hoverable>
                                      <Spacer />
                                    </VStack>
                                  )}
                                ></FlatList>
                              ) : // <PresenceTransition visible={hovered}
                              // >
                              //   <VStack display={'flex'} alignItems={'flex-start'} justifyContent={'flex-start'} flexDirection={'column'} width={'100%'}>
                              //     <FlatList data={category.sub_categories} renderItem={(subCategory: Record<string, any>)=>(
                              //        <Text >{subCategory.name}</Text>
                              //     )}>

                              //   </VStack>
                              // </PresenceTransition>
                              null}
                            </>
                          )}
                        </Hoverable>
                      </Menu.Item>
                    );
                  })}
                </Menu>
              </Box>
            </Hidden>
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
