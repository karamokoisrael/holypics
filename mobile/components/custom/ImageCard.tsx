import { Image, Stack, Text, Pressable, useMediaQuery } from "native-base";
import { StyleSheet } from "react-native";
import React from "react";
import { Hoverable } from "react-native-web-hover";
import { sharedStyles } from "../../styles/shared";
import { MAX_SMALL_SCREEN_WIDTH } from "../../constants/layout";

type Props = {
  image: string;
  text: string;
  onPress: Function;
};

const ImageCard = ({ image, text, onPress }: Props) => {
  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });
  const textWith = isSmallScreen == true ? 138.8 : 190;
  const imageHeight = isSmallScreen == true ? 230.8 : 285.5;
  // const reduction = 0;
  return (
    <Pressable
      flex={1}
      alignItems="center"
      flexBasis={isSmallScreen == true ? "48%" : "24%"}
      width={isSmallScreen == true ? "48%" : "24%"}
      paddingBottom={2}
      height={imageHeight}
      onPress={() => alert(text)}
    >
      <Hoverable>
        {({ hovered }) => (
          <Stack
            width={"100%"}
            height={"100%"}
            flex={1}
            alignItems={"center"}
            style={hovered ? sharedStyles.boxBordered : {}}
          >
            <Image
              src={image}
              alt={text}
              height={isSmallScreen == true ? 150.8 : 190}
              width={isSmallScreen == true ? 150.8 : 190}
            />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              fontSize={isSmallScreen == true ? "md" : "md"}
              width={textWith}
              textAlign={"center"}
            >
              {text}
            </Text>
          </Stack>
        )}
      </Hoverable>
    </Pressable>
  );
};

const styles = StyleSheet.create({});

export default ImageCard;
