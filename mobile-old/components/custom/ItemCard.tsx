import {
  Image,
  Stack,
  Text,
  Pressable,
  Skeleton,
  Button,
  useMediaQuery,
} from "native-base";
import { StyleSheet } from "react-native";
import React from "react";
import { getImageUrl } from "../../helpers/utils";
import { Hoverable } from "react-native-web-hover";
import { sharedStyles } from "../../styles/shared";
import { ConditionalSuspense } from "../layout/ConditionalSuspense";
import { MAX_SMALL_SCREEN_WIDTH, WINDOW_WIDTH } from "../../constants/layout";
type Props = {
  image: string;
  text: string;
  secondText: string;
  onPress: ()=>void
};
const ItemCard = ({ image, text, secondText, onPress }: Props) => {
  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });

  return (
    <Pressable
      flex={1}
      alignItems="center"
      flexBasis={isSmallScreen ? "100%" : "40%"}
      width={isSmallScreen ? "100%" : "40%"}
      marginBottom={2}
      height={isSmallScreen ? 380 : 448}
      onPress={() => onPress()}
    >
      <Image
        rounded={10}
        height={isSmallScreen ? 300 : 370}
        width={isSmallScreen ? WINDOW_WIDTH - 26 : 380}
        source={{ uri: image }}
        alt={text}
      />
      <Stack
        alignItems={"flex-start"}
        flexDirection={"column"}
        justifyContent={"flex-start"}
        width={isSmallScreen ? WINDOW_WIDTH - 26 : 380}
      >
        <Text
          color={"#fff"}
          fontSize={"xl"}
          fontWeight={"extrabold"}
          numberOfLines={1}
          ellipsizeMode="tail"
          width={isSmallScreen ? WINDOW_WIDTH - 26 : 380}
          textAlign={"center"}
        >
          {text}
        </Text>
        <Text
          fontSize={isSmallScreen ? "md" : "xl"}
          numberOfLines={1}
          ellipsizeMode="tail"
          width={isSmallScreen ? WINDOW_WIDTH - 26 : 380}
          textAlign={"center"}
        >
          {secondText}
        </Text>
      </Stack>
    </Pressable>
  );
};

export const ItemCardSkeleton = () => {
  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });
  return (
    <Stack
      flex={1}
      alignItems="center"
      flexBasis={isSmallScreen ? "100%" : "40%"}
      width={isSmallScreen ? "100%" : "40%"}
      height={isSmallScreen ? 200 : 300}
      marginBottom={2}
      justifyContent={"space-around"}
    >
      <Skeleton
        px="4"
        my="4"
        rounded="md"
        flexBasis={isSmallScreen ? "100%" : "40%"}
        h="5"
        // width={isSmallScreen ? WINDOW_WIDTH - 26 : 380}
      />
      <Skeleton.Text
        px="4"
        height={isSmallScreen ? 20 : 30}
        width={isSmallScreen ? WINDOW_WIDTH - 26 : 380}
        maxHeight={"15%"}
      />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default ItemCard;
