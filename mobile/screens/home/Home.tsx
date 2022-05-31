import React, { useRef } from "react";
import { Stack, Heading, useMediaQuery, useToast, VStack } from "native-base";

import Layout from "../../components/layout/Layout";
import Carousel from "react-native-reanimated-carousel";
import { ComponentWithNavigationProps } from "../../@types/component";
import { Dimensions } from "react-native";
import MainCarouselItem, {
  MainCarouselItemSkeleton,
} from "../../components/custom/MainCarouselItem";
import useSWR from "swr";
import { formatUrl, getImageUrl, getLogoUrl } from "../../helpers/utils";
import { Gallery } from "../../@types/gallery";
import useStore from "../../context/store";
import { MAX_SMALL_SCREEN_WIDTH, WINDOW_HEIGHT } from "../../constants/layout";
import SearchBar from "../../components/custom/SearchBar";
import { Product } from "../../@types/product";
import ProductCard, {
  ProductCardSkeleton,
} from "../../components/custom/ProductCard";
import CategoryCard, {
  CategoryCardSkeleton,
} from "../../components/custom/CategoryCard";
import IconCard from "../../components/custom/IconCard";
import { ConditionalSuspense } from "../../components/layout/ConditionalSuspense";
import { MapList } from "../../components/layout/MapList";
import ImageCard from "../../components/custom/ImageCard";
import Swiper from "react-native-swiper";
import { sharedStyles } from "../../styles/shared";

export default function Home({
  navigation,
  route,
}: ComponentWithNavigationProps) {
  const toast = useToast();
  type ScreenData = {
    services: Gallery[];
    slides: Gallery[];
    brands: Gallery[];
  };

  const categories = useStore((state) => state.configs.categories);

  const renderGalleryUrl = (itemId, currentGallery) =>
    currentGallery.length - 1 > itemId
      ? getImageUrl(`${currentGallery[itemId].image}`)
      : getLogoUrl();

  const screenData = useSWR<ScreenData>(
    formatUrl(
      "items/gallery?limit=-1&filter[status]=published&sort=-date_created"
    ),
    async (...args: Parameters<typeof fetch>) => {
      const res = await fetch(...args);
      const resJson = await res.json();
      if (resJson.errors != undefined)
        return toast.show({ title: resJson.errors[0].message });

      const gottenServices = (resJson.data as Gallery[]).filter(
        (galleryItem: Gallery) => galleryItem.group == "service"
      );

      const gottenSlides = (resJson.data as Gallery[]).filter(
        (galleryItem: Gallery) => galleryItem.group == "slider"
      );

      const gottenBrands = (resJson.data as Gallery[]).filter(
        (galleryItem: Gallery) => galleryItem.group == "brand"
      );

      return {
        services: gottenServices,
        slides: gottenSlides,
        brands: gottenBrands,
      };
    },
    { revalidateOnFocus: false, shouldRetryOnError: true }
  );

  const nowToSeeProducts = useSWR<Product[]>(
    formatUrl(
      "items/products?limit=20&filter[status]=published&sort=-date_created"
    ),
    async (...args: Parameters<typeof fetch>) => {
      const res = await fetch(...args);
      const resJson = await res.json();
      if (resJson.errors != undefined) {
        toast.show({ title: resJson.errors[0].message });
        throw new Error(resJson.errors);
      }

      return resJson.data;
    },
    { revalidateOnFocus: false, shouldRetryOnError: true }
  );
  type CategoryMap = {
    id: string;
    name: string;
    products: Product[];
  };

  const categoriesProducts = useSWR<CategoryMap[]>(
    formatUrl(
      "items/products?limit=10&filter[status]=published&sort=-date_created"
    ),
    async (...args: Parameters<typeof fetch>) => {
      const data: CategoryMap[] = [];
      for (const category of categories) {
        const res = await fetch(`${args[0]}&filter[category]=${category.id}`);
        const resJson = await res.json();
        if (resJson.errors != undefined) throw new Error(resJson.errors);
        if (resJson.data.length != 0) {
          data.push({
            id: category.id,
            name: category.name,
            products: resJson.data as Product[],
          });
        }
      }

      return data;
    },
    { revalidateOnFocus: false, shouldRetryOnError: true }
  );

  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });

  const menus = [
    {
      text: "Soldes",
      route: "Home",
      icon: "52a7196b-eea7-4e0f-9aa6-99eee1145ce5",
    },
    {
      text: "Boutiques",
      route: "Home",
      icon: "fa4014a2-9e42-49d2-b6d6-8aa102ea7beb",
    },
    {
      text: "Made in CI",
      route: "Home",
      icon: "ec3ce20b-1145-4e6d-b98c-ae0a897c5785",
    },
    {
      text: "Recommandés",
      route: "Home",
      icon: "f2c80949-cae7-4295-a10e-486273147030?",
    },
  ];

  const screenWidth =
    Dimensions.get("window").width > 1184
      ? 1184
      : Dimensions.get("window").width;

  const mainCarouselRef = useRef<any>({
    prev: () => {},
    next: () => {},
  });

  return (
    <Layout navigation={navigation} route={route}>
      <>
        <ConditionalSuspense condition={isSmallScreen}>
          <SearchBar navigation={navigation} route={route} />
        </ConditionalSuspense>

        <ConditionalSuspense
          condition={screenData.data != undefined}
          fallBack={<MainCarouselItemSkeleton />}
        >
          <Carousel
            width={screenWidth}
            height={isSmallScreen ? 300 : 500}
            data={screenData.data?.slides}
            autoPlay={true}
            autoPlayInterval={3000}
            // ref={mainCarouselRef}
            renderItem={({ item }) => {
              const slideId = screenData.data?.slides.findIndex(
                (currentItem: Gallery) => item.id == currentItem.id
              );
              return (
                <MainCarouselItem
                  onPressPrev={
                    typeof mainCarouselRef.current.prev == "function"
                      ? mainCarouselRef.current.prev
                      : () => {}
                  }
                  onPressNext={
                    typeof mainCarouselRef.current.next == "function"
                      ? mainCarouselRef.current.next
                      : () => {}
                  }
                  id={slideId}
                  totalItem={screenData.data.slides.length}
                  heading={item.name}
                  imageUri={renderGalleryUrl(slideId, screenData.data.slides)}
                  content={item.description}
                  btnText="VOIR PLUS"
                  paddingBottom={2}
                  width="100%"
                  height={isSmallScreen ? 300 : 500}
                  imageBackgroundStyle={!isSmallScreen ? {} : { height: 300 }}
                  containerStyle={!isSmallScreen ? {} : { height: 300 }}
                  btnAction={() => {}}
                />
              );
            }}
          />
        </ConditionalSuspense>

        <Stack
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-around"}
          flexDirection={"row"}
          paddingTop={2}
          width="100%"
        >
          <MapList
            data={menus}
            render={(menu) => (
              <IconCard
                key={menu.text}
                onPress={() => alert(menu.text)}
                text={menu.text}
                image={{ uri: getImageUrl(menu.icon) }}
              />
            )}
          />
        </Stack>

        <Stack display={"flex"} alignItems={"center"}>
          <Heading margin={5}> SÉLECTION RAPIDE</Heading>
          <Stack
            alignItems={"center"}
            justifyContent={"flex-start"}
            direction={"row"}
            flexWrap={"wrap"}
          >
            <ConditionalSuspense
              condition={categories.length != 0}
              fallBack={
                <MapList
                  data={[...Array(8).keys()]}
                  render={(key) => <CategoryCardSkeleton key={key} />}
                />
              }
            >
              <MapList
                data={categories}
                render={(item) => (
                  <CategoryCard
                    key={item.id}
                    category={item}
                    navigation={navigation}
                  />
                )}
              />
            </ConditionalSuspense>
          </Stack>
        </Stack>

        <Stack flex={1} alignItems={"center"} width={"100%"} paddingBottom={2}>
          <Heading margin={5}> ACHÈTE DÈS MAINTENANT</Heading>
          <Stack
            alignItems={"center"}
            justifyContent={"flex-start"}
            direction={"row"}
            flexWrap={"wrap"}
            width={"100%"}
          >
            <ConditionalSuspense
              condition={nowToSeeProducts.data != undefined}
              fallBack={
                <MapList
                  data={[...Array(8).keys()]}
                  render={(key) => <ProductCardSkeleton key={key} />}
                />
              }
            >
              <MapList
                data={nowToSeeProducts.data}
                render={(item: Product) => (
                  <ProductCard key={item.id} product={item} />
                )}
              />
            </ConditionalSuspense>
          </Stack>
        </Stack>
        {/* TODO: brands section */}
        {/* 
        <Stack flex={1} alignItems={"center"} width={"100%"} paddingBottom={2}>
          <Heading margin={5}> LES MEILLEURS MARQUES</Heading>
          <Stack
            alignItems={"center"}
            justifyContent={"flex-start"}
            direction={"row"}
            flexWrap={"wrap"}
            width={"100%"}
          >
            <ConditionalSuspense condition={screenData.data ? true : false}>
              <MapList
                data={screenData.data?.brands}
                render={(item: Gallery) => (
                  <ImageCard
                    key={item.id}
                    image={getImageUrl(item.image)}
                    text={item.name}
                    onPress={() => navigation.navigate("Category")}
                  />
                )}
              />
            </ConditionalSuspense>
          </Stack>
        </Stack> */}

        <Stack flex={1} alignItems={"center"} width={"100%"} paddingBottom={2}>
          <Heading margin={5}> LES NOUVEAUTÉS</Heading>

          <ConditionalSuspense
            condition={nowToSeeProducts.data != undefined}
            fallBack={
              <MapList
                data={[...Array(8).keys()]}
                render={(key) => <ProductCardSkeleton key={key} />}
              />
            }
          >
            <Swiper horizontal={true} style={sharedStyles.responsiveRow}>
              <MapList
                data={nowToSeeProducts.data}
                render={(item: Product) => (
                  <ProductCard key={item.id} product={item} />
                )}
              />
            </Swiper>
          </ConditionalSuspense>
        </Stack>
      </>
    </Layout>
  );
}
