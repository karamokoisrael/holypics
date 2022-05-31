import React from "react";
import { StyleSheet } from "react-native";
import {
  Text,
  Stack,
  Image,
  Pressable,
  Skeleton,
  useMediaQuery,
} from "native-base";
import { Hoverable } from "react-native-web-hover";
import { Category } from "../../@types/category";
import { getImageUrl } from "../../helpers/utils";
import { sharedStyles } from "../../styles/shared";
import { MAX_SMALL_SCREEN_WIDTH } from "../../constants/layout";

type Props = {
  category: Category;
  navigation: any;
};

const CategoryCard = ({ category, navigation }: Props) => {
  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });
  return (
    <Pressable
      onPress={() => navigation.navigate("Category", { id: category.id })}
      flexBasis={isSmallScreen ? "33%" : "25%"}
      height={isSmallScreen ? 100 : 125}
      key={category.id}
    >
      <Hoverable>
        {({ hovered }) => (
          <Stack
            flex={1}
            alignItems={"center"}
            style={hovered ? sharedStyles.boxBordered : {}}
          >
            <Image
              rounded={50}
              width={isSmallScreen ? 50 : 70}
              height={isSmallScreen ? 50 : 70}
              source={{ uri: getImageUrl(category.thumb) }}
              alt={category.name}
            />
            <Text
              textAlign={"center"}
              fontWeight={"bold"}
              fontSize={isSmallScreen ? "xs" : "md"}
              paddingLeft={1}
              height={isSmallScreen ? 4 : 7}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {category.name}
            </Text>
          </Stack>
        )}
      </Hoverable>
    </Pressable>
  );
};

export const CategoryCardSkeleton = () => {
  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });
  return (
    <Skeleton
      flexBasis={isSmallScreen ? "33%" : "25%"}
      width={isSmallScreen ? 50 : 70}
      height={isSmallScreen ? 50 : 70}
      px="4"
      my="4"
      rounded="md"
    />
  );
};

const styles = StyleSheet.create({});

export default CategoryCard;
