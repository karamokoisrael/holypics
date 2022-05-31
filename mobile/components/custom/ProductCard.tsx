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
import { Product } from "../../@types/product";
import { getImageUrl } from "../../helpers/utils";
import { Hoverable } from "react-native-web-hover";
import { sharedStyles } from "../../styles/shared";
import { ConditionalSuspense } from "../layout/ConditionalSuspense";
import { MAX_SMALL_SCREEN_WIDTH } from "../../constants/layout";

type Props = {
  product: Product;
  addToCard?: boolean;
};

type SkeletonProps = {
  isSmallScreen: boolean;
};

const ProductCard = ({ product, addToCard }: Props) => {
  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });
  const textWith = isSmallScreen == true ? 138.8 : 190;
  let productHeight = isSmallScreen == true ? 230.8 : 285.5;
  // const reduction = 0;
  const reduction =
    product.price_before_promotion != null
      ? ((product.price_before_promotion - product.price) * 100) /
        product.price_before_promotion
      : 0;
  if (addToCard != true)
    productHeight += product.price_before_promotion != null ? 32 : 10;
  return (
    <Pressable
      flex={1}
      alignItems="center"
      flexBasis={isSmallScreen == true ? "48%" : "24%"}
      width={isSmallScreen == true ? "48%" : "24%"}
      paddingBottom={2}
      height={productHeight}
      onPress={() => alert(product.name)}
    >
      <Hoverable>
        {({ hovered }) => (
          <Pressable
            onPress={() => alert(product.name)}
            width={"100%"}
            height={"100%"}
            flex={1}
            alignItems={"center"}
            style={hovered ? sharedStyles.boxBordered : {}}
          >
            <ConditionalSuspense condition={reduction > 0}>
              <Stack
                top={4}
                left={1}
                backgroundColor={"primary.900"}
                height={5}
                position="absolute"
                fontSize={20}
                zIndex={99}
                flex={1}
                alignItems="flex-start"
                justifyContent="flex-start"
              >
                <Text color={"text.50"}>-{reduction}%</Text>
              </Stack>
            </ConditionalSuspense>

            <Image
              src={getImageUrl(product.thumb)}
              alt={product.name}
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
              {product.name}
            </Text>
            <Text fontWeight={"bold"} width={textWith} textAlign={"center"}>
              {new Intl.NumberFormat("fr-FR", {
                style: "currency",
                currency: "XOF",
              }).format(product.price)}
            </Text>
            {product.price_before_promotion != null ? (
              <Text
                style={{
                  textDecorationLine: "line-through",
                  textDecorationStyle: "solid",
                }}
                width={textWith}
                textAlign={"center"}
              >
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                }).format(product.price_before_promotion)}
              </Text>
            ) : null}

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
              width={"80%"}
              backgroundColor="primary.900"
              _hover={{ backgroundColor: "primary.700" }}
              flex={1}
              flexDirection={"column"}
              height={21}
            >
              J'ACHÈTE
            </Button>
          </Pressable>
        )}
      </Hoverable>
    </Pressable>
  );
};

export const ProductCardSkeleton = () => {
  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });
  return (
    <Stack
      flexBasis={isSmallScreen == true ? "48%" : "24%"}
      width={isSmallScreen == true ? "48%" : "24%"}
      paddingBottom={5}
      height={isSmallScreen == true ? 190 : 210}
      flex={1}
      alignItems={"center"}
    >
      <Skeleton
        px="4"
        my="4"
        rounded="md"
        height={"60%"}
        maxHeight={"60%"}
        width={"80%"}
      />
      <Skeleton.Text px="4" width={"80%"} height={"15%"} maxHeight={"15%"} />
    </Stack>
  );
};

const styles = StyleSheet.create({});

export default ProductCard;
