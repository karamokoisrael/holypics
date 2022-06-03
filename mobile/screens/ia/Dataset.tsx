import { FontAwesome5 } from "@expo/vector-icons";
import {
  Center,
  Icon,
  Text,
  Image,
  Stack,
  Heading,
  Button,
  Box,
  VStack,
  Divider,
  useMediaQuery,
  Modal,
  Input,
  FormControl,
  TextArea,
  CheckIcon,
  Select,
  WarningOutlineIcon,
  useToast,
} from "native-base";
import React, { useEffect, useState } from "react";
import { ComponentWithNavigationProps } from "../../@types/component";
import { Dataset } from "../../@types/global";
import Layout from "../../components/layout/Layout";
import {
  MAX_SMALL_SCREEN_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from "../../constants/layout";
import { formatUrl, getImageUrl } from "../../helpers/utils";
import useStore from "../../stores/store";
import * as ImagePicker from "expo-image-picker";
import { MapList } from "../../components/layout/MapList";
import { Platform, Pressable } from "react-native";
import axios from "axios";
import environment from "../../constants/environment";
import * as FileSystem from "expo-file-system";
export default function DatasetAnalyser({
  navigation,
  route,
}: ComponentWithNavigationProps) {
  const datasets = useStore((state) => state.configs.datasets);
  const directus = useStore((state) => state.directus);
  const toast = useToast();
  const [dataset, setDataset] = useState<Dataset>({
    id: "",
    name: "",
    description: "",
    short_description: "",
    prediction_threshold: 0.5,
    class_names: [],
    thumb: "",
    production_models: [],
  });

  const uuid = (
    key: number = Math.floor(Math.random() * (10000 - 100 + 1)) + 100
  ) => `${Date.now().toFixed().toString()}-${key}`;

  type Prediction = {
    id: string;
    uri: any;
    textData: string;
    json: Record<string, any>;
    rating: number;
    comment: string | null;
    classNames: string[];
    predictionData?: Record<string, any> | null;
  };

  const [isSmallScreen] = useMediaQuery({ maxWidth: MAX_SMALL_SCREEN_WIDTH });
  const [showModal, setShowModal] = useState(false);

  const [modalContent, setModalContent] = useState<Prediction>({
    id: uuid(),
    uri: getImageUrl(dataset.thumb),
    textData: "",
    json: {},
    rating: -1,
    comment: null,
    classNames: [],
    predictionData: null,
  });

  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const predict = async (base64Image: string) => {
    try {
      const res = await axios.post(formatUrl(`ai/predict/${dataset.name}`), {
        base64Image: base64Image.split(",")[1]
      });

      // if (res.data.data === undefined) throw new Error("No data returned");
      // const { id, textData } = res.data.data;
      // setPredictions([
      //   ...predictions,
      //   {
      //     id,
      //     textData,
      //     json: res.data.data,
      //     uri: base64Image,
      //     rating: -1,
      //     comment: null,
      //     classNames: [],
      //   },
      // ]);
    } catch (error) {
      console.log("handled error => ", error);
      toast.closeAll();
      toast.show({
        title: "Nous avons rencontré un problème lors de l'opération",
      });
    }
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const base64: string =
          Platform.OS == "web"
            ? (result as Record<string, any>).uri
            : await FileSystem.readAsStringAsync(
                (result as Record<string, any>).uri,
                { encoding: "base64" }
              );
        
        await predict(base64);
      }
    } catch (error) {
      toast.closeAll();
      toast.show({
        title: "Nous avons rencontré un problème lors de l'opération",
      });
    }
  };

  useEffect(() => {
    if (route.params.id === undefined) return navigation.navigate("Home");

    const currentDataset = datasets.find((item) => item.id === route.params.id);

    if (currentDataset === undefined || currentDataset === null)
      return navigation.navigate("Home");

    setDataset(currentDataset);
    // directus.items("categories").readByQuery().then((items)=>{
    //   console.log("items => ", items);

    // })
  }, []);

  return (
    <Layout navigation={navigation} route={route}>
      <>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Prédiction</Modal.Header>
            <Modal.Body>
              <Box borderRadius="md" flexBasis={isSmallScreen ? "48%" : "24%"}>
                <VStack space="4" divider={<Divider />}>
                  <Box px="4" pt="4">
                    <Image
                      height={isSmallScreen ? 150 : 200}
                      width={"100%"}
                      source={{ uri: modalContent.uri }}
                      alt={modalContent.id}
                    />
                  </Box>
                  <Box px="4">{modalContent.textData}</Box>
                  <Box
                    px="4"
                    flex={1}
                    width="100%"
                    justifyContent={"space-around"}
                    alignItems={"center"}
                  >
                    <Stack
                      justifyContent={"space-around"}
                      alignItems={"center"}
                      direction={"row"}
                    >
                      <MapList
                        data={[...Array(5).keys()]}
                        render={(star) => (
                          <Pressable
                            key={star}
                            onPress={() =>
                              setModalContent({
                                ...modalContent,
                                rating:
                                  modalContent.rating === star
                                    ? star - 1
                                    : star,
                              })
                            }
                          >
                            <Icon
                              color={
                                modalContent.rating >= star ? "#ffff00" : "#000"
                              }
                              as={FontAwesome5}
                              name="star"
                            />
                          </Pressable>
                        )}
                      />
                    </Stack>
                  </Box>

                  <Box
                    px="4"
                    flex={1}
                    width="100%"
                    justifyContent={"space-around"}
                    alignItems={"center"}
                  >
                    <FormControl w="3/4" maxW="300">
                      <FormControl.Label>
                        Choisissez une classe
                      </FormControl.Label>
                      <Select
                        minWidth="200"
                        accessibilityLabel="Choisissez une classe"
                        placeholder="Choisissez une classe"
                        _selectedItem={{
                          bg: "teal.600",
                          endIcon: <CheckIcon size={5} />,
                        }}
                        // selectedValue={modalContent.classNames[0]}
                        mt="1"
                        onValueChange={(value) => {
                          if (value === undefined || value === null) return;
                          setModalContent({
                            ...modalContent,
                            classNames: [value],
                          });
                        }}
                      >
                        {dataset.class_names.map((className) => (
                          <Select.Item
                            key={className}
                            label={className}
                            value={className}
                          />
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box
                    px="4"
                    flex={1}
                    width="100%"
                    justifyContent={"space-around"}
                    alignItems={"center"}
                  >
                    <Text>Commentaire</Text>
                    <TextArea
                      h={20}
                      placeholder="Votre commentaire"
                      w="75%"
                      maxW="300"
                      onChangeText={(text) =>
                        setModalContent({ ...modalContent, comment: text })
                      }
                      value={modalContent.comment}
                    />
                  </Box>
                </VStack>
              </Box>
              {/* <FormControl>
                <FormControl.Label>Name</FormControl.Label>
                <Input />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Email</FormControl.Label>
                <Input />
              </FormControl> */}
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setShowModal(false);
                  }}
                >
                  Annuler
                </Button>
                <Button
                  onPress={async () => {
                    console.log(modalContent);

                    return;
                    try {
                      const res = await axios.post(
                        formatUrl("items/feedbacks"),
                        {
                          comment: modalContent.comment,
                          rating: modalContent.rating - 1,
                          dataset_id: dataset.id,
                          class_names: modalContent.classNames,
                          prediction_data: modalContent.predictionData || null,
                          image_url: modalContent.uri,
                          status: "published",
                        }
                      );

                      if ([204, 200].includes(res.status)) {
                        toast.closeAll();
                        toast.show({ title: "Réponse soumisse avec succès" });
                        return setShowModal(false);
                      }
                    } catch (error) {}
                  }}
                >
                  Soumettre
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
        <Image
          source={{ uri: getImageUrl(dataset.thumb) }}
          height={300}
          width={"100%"}
          // style={{ resizeMode: "resize" }}
          alt={dataset.name}
        />
        <Stack
          top={4}
          left={1}
          backgroundColor={"bg.dark"}
          height={12}
          position="absolute"
          fontSize={20}
          zIndex={99}
          flex={1}
          alignItems="flex-start"
          justifyContent="flex-start"
          padding={1.5}
          rounded={"xl"}
        >
          <Text color={"#fff"} fontSize={"2xl"}>
            {dataset.name}
          </Text>
        </Stack>
        <Text color={"#fff"} fontSize={"md"} padding={2}>
          {dataset.description}
        </Text>
        <Heading margin={5}>Tester {dataset.name}</Heading>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-around"}
        >
          <Button onPress={pickImage}>
            Sélectionner une image depuis l'appareil
          </Button>
        </Stack>
        <Stack
          flex={1}
          alignItems={"center"}
          width={"100%"}
          paddingBottom={2}
          justifyContent={"flex-start"}
          direction={"row"}
          flexWrap={"wrap"}
          marginTop={7}
          marginBottom={7}
        >
          {predictions.map((prediction) => (
            <Box
              borderRadius="md"
              key={prediction.id}
              flexBasis={isSmallScreen ? "48%" : "24%"}
            >
              <VStack space="4" divider={<Divider />}>
                <Box px="4" pt="4">
                  <Image
                    height={isSmallScreen ? 150 : 200}
                    width={"100%"}
                    source={{ uri: prediction.uri }}
                    alt={prediction.id}
                  />
                  <Stack
                    top={4}
                    left={4}
                    height={4}
                    position="absolute"
                    zIndex={99}
                    flex={1}
                    alignItems="flex-start"
                    justifyContent="flex-start"
                  >
                    <Button
                      size={"md"}
                      onPress={() => {
                        const currentPredictions = predictions.filter((item)=> item.id !== prediction.id)
                        setPredictions(currentPredictions);
                      }}
                      height={7}
                      width={7}
                    >
                      <Icon
                        size={"xs"}
                        as={FontAwesome5}
                        name="trash"
                      />
                    </Button>
                  </Stack>
                </Box>
                <Box px="4">{prediction.textData}</Box>
                <Box px="4" flex={1}>
                  <Button
                    onPress={() => {
                      setModalContent(prediction);
                      setShowModal(true);
                    }}
                  >
                    Voir plus
                  </Button>
                </Box>
              </VStack>
            </Box>
          ))}
        </Stack>
        {/* <Stack
          alignItems="center"
          justifyContent="space-around"
          height={WINDOW_HEIGHT}
        >
        
        </Stack> */}
      </>
    </Layout>
  );
}
