import { FontAwesome } from "@expo/vector-icons";
import {
  Box,
  VStack,
  Text,
  Button,
  Icon,
  useMediaQuery,
  Skeleton,
} from "native-base";
import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { Pressable } from "native-base";
import { MAX_SMALL_SCREEN_WIDTH } from "../../constants/layout";

type Props = {
  heading: string;
  imageUri: string;
  content: string;
  btnText: string;
  btnAction: Function;
  onPressNext: Function;
  onPressPrev: Function;
  id: number | string;
  totalItem: number;
  _android?: Record<string, any>;
  _ios?: Record<string, any>;
  imageBackgroundStyle?: Record<string, any>;
  containerStyle?: Record<string, any>;
  width?: number | string;
  height?: number | string;
  paddingBottom?: number;
  overlayOpacity?: number;
};

const MainCarouselItem = ({
  heading,
  imageUri,
  content,
  btnText,
  btnAction,
  width,
  height,
  paddingBottom,
  overlayOpacity,
  _android,
  _ios,
  imageBackgroundStyle,
  containerStyle,
  onPressNext,
  onPressPrev,
  id,
  totalItem,
}: Props) => {
  const defaultProps = {
    height: 426,
    width: "100%",
  };

  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });

  return (
    <Pressable
      w={width != undefined ? width : defaultProps.width}
      h={height != undefined ? height : defaultProps.height}
      shadow={3}
      mb={paddingBottom != undefined ? paddingBottom : 0}
    >
      {/* @ts-ignore */}
      <ImageBackground
        style={{
          ...styles.imageBackground,
          width: width != undefined ? width : defaultProps.width,
          height: height != undefined ? height : defaultProps.height,
          ...(imageBackgroundStyle != undefined ? imageBackgroundStyle : {}),
        }}
        source={{
          uri: imageUri,
        }}
      >
        <VStack
          space="4"
          w={width != undefined ? width : defaultProps.width}
          h={height != undefined ? height : defaultProps.height}
          backgroundColor={`rgba(0, 0, 0, ${
            overlayOpacity != undefined ? overlayOpacity : 0.6
          })`}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          _android={_android != undefined ? _android : {}}
          _ios={_ios != undefined ? _ios : {}}
          style={containerStyle != undefined ? containerStyle : {}}
        >
          <Box px="4" pt="4">
            <Text fontSize="md" color="text.50" style={styles.text}>
              {heading}
            </Text>
          </Box>
          <Box
            px="4"
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-around"}
            flexDirection={"row"}
          >
            {!isSmallScreen ? (
              <Pressable onPress={() => onPressPrev()}>
                <Icon
                  mb="1"
                  as={<FontAwesome name="angle-left" />}
                  color="white"
                  size="lg"
                  width={"5%"}
                />
              </Pressable>
            ) : null}
            <Text
              width={"85%"}
              fontSize="2xl"
              color="text.50"
              style={styles.text}
            >
              {content}
            </Text>
            {!isSmallScreen ? (
              <Pressable onPress={() => onPressNext()}>
                <Icon
                  mb="1"
                  as={<FontAwesome name="angle-right" />}
                  color="white"
                  size="lg"
                  width={"5%"}
                />
              </Pressable>
            ) : null}
          </Box>
          <Box px="4" pb="4">
            <Button
              py="2"
              px="1"
              borderRadius="4"
              variant="subtle"
              _text={{
                _dark: { color: "text.50" },
                _light: { color: "coolGray.800" },
                fontWeight: "normal",
              }}
              //@ts-ignore
              _light={{ colorScheme: "primary" }}
              _dark={{
                bg: "bg.dark",
                //@ts-ignore
                colorScheme: "dark",
              }}
              onPress={() => btnAction()}
            >
              {btnText}
            </Button>
          </Box>
          <Box
            px="4"
            pb="4"
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-around"}
            flexDirection={"row"}
          >
            {[...Array(totalItem).keys()].map((key: number | string) => (
              <Icon
                mb="1"
                as={<FontAwesome name="circle" />}
                key={key}
                color={key == id ? "#fff" : "#000"}
                size={3}
              />
            ))}
          </Box>
        </VStack>
      </ImageBackground>
    </Pressable>
  );
};

export const MainCarouselItemSkeleton = () => (
  <>
    <Skeleton h="40" />
    <Skeleton.Text px="4" />
    <Skeleton px="4" my="4" rounded="md" />
  </>
);
const styles = StyleSheet.create({
  imageBackground: {},
  text: {
    textAlign: "center",
  },
});

export default MainCarouselItem;
