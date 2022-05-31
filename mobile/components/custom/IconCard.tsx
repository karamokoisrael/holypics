import { Text, Stack, Image, Pressable, useMediaQuery } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import { Hoverable } from "react-native-web-hover";
import { MAX_SMALL_SCREEN_WIDTH } from "../../constants/layout";
import { sharedStyles } from "../../styles/shared";

type Props = {
  text: string;
  onPress: Function;
  image: any;
};

const IconCard = ({ text, onPress, image }: Props) => {
  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });
  return (
    <Pressable onPress={() => onPress()}>
      <Hoverable>
        {({ hovered }) => (
          <Stack
            flex={1}
            alignItems={"center"}
            style={hovered ? sharedStyles.boxBordered : {}}
          >
            <Image width={35} height={35} source={image} alt={text} />
            <Text
              textAlign={"center"}
              fontWeight={"bold"}
              fontSize={isSmallScreen ? "xs" : "md"}
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

export default IconCard;
