import React, { useEffect, useRef, useState } from "react";
import { FlatList, Linking, Platform, StyleSheet, TouchableHighlight, View } from "react-native";
import { Button, Card, IconButton, Paragraph, TextInput, Title, Text, ActivityIndicator, Portal, Modal } from "react-native-paper";
import Layout from "../../components/layout/Layout";
import { FULL_WIDTH, SMALL_SCREEN, WINDOW_HEIGHT } from "../../constants/layout";
import I18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";
import useSWR from "swr";
import { formatUrl } from "../../helpers/utils";
import useStore from "../../stores/store";
import { languages } from "../../constants/translations";
import * as FileSystem from "expo-file-system";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

export default function Model({ route }) {
  const { id } = route.params;
  const toast = {
    show: ({ title }) => { },
    closeAll: () => { },
    close: (id: any) => { }
  }
  const navigation = useNavigation();
  const configs = useStore(state => state.configs);
  const req = useSWR("models", async (...args: any) => {
    const data = configs.models.find((item) => item.name == id);
    const supData = data.translations.find((item) => item.languages_id == languages[I18n.locale].key)
    return { ...data, ...supData }
  }, {
    revalidateOnFocus: false,
    shouldRetryOnError: true,
  });

  const [predictions, setPredictions] = useState<Record<string, any>[]>([]);
  const [predictionControls, setPredictionControls] = useState({
    cameraOn: false,
    cameraPermissionGranted: false,
    cameraType: Camera.Constants.Type["front"]
  });

  const cameraRef = useRef(null);
  const formRef = useRef({
    imageUrl: ""
  })

  const [predictionModalData, setPredictionModalData] = useState({
    visible: false,
    content: {
      id: " ",
      uri: "",
      textData: "",
      json: {},
      rating: -1,
      comment: null
    } as Record<string, any>
  })

  const predict = async (base64Image: string = null, url: string = null, live = false) => {
    const id = toast.show({ title: "Prédiction en cours" });

    setLoadingStatus(true)
    try {
      const formData = new FormData();
      formData.append("get_image_back", "true")
      if (base64Image != null) {
        formData.append("base64_image", base64Image);
      }
      if (url != null) {
        formData.append("url", url);
      }

      const res = await fetch(formatUrl(`ai/predict/${req.data?.name}?culture=${I18n.locale}`), { body: formData, method: "POST" })
      const resJson = await res.json();

      if (resJson.data === undefined) throw new Error("No data returned");

      const { id, text_data } = resJson.data;
      const predictionOutput = {
        id,
        textData: text_data,
        json: resJson.data,
        uri: resJson.data.base64_image,
        rating: -1,
        comment: null
      }

      setPredictions([
        ...[predictionOutput],
        ...predictions
      ]);


    } catch (error) {
      console.log("handled error => ", error);
      toast.closeAll();
      toast.show({
        title: "Nous avons rencontré un problème lors de l'opération",
      });
    } finally {
      toast.close(id);
      setLoadingStatus(false);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const base64: string = Platform.OS === "web"
          ? (result as Record<string, any>).uri
          : `data:image/jpg;base64,${await FileSystem.readAsStringAsync(
            (result as Record<string, any>).uri,
            { encoding: "base64" }
          )}`
        // console.log(base64);

        await predict(base64);
      }
    } catch (error) {
      toast.closeAll();
      toast.show({
        title: "Nous avons rencontré un problème lors de l'opération",
      });
    }
  };

  const [isLoading, setLoadingStatus] = useState(false);

  const handleImageCapture = async () => {
    try {
      const imageData = await cameraRef.current?.takePictureAsync({
        base64: true,
      });
      await predict(imageData.base64, null, false)

    } catch (error) {
      console.log(error);
    } finally {
      setPredictionControls({ ...predictionControls, cameraOn: false })
    }
  };

  useEffect(() => {

    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      if (cameraPermission.status === "granted") {
        setPredictionControls({ ...predictionControls, cameraPermissionGranted: true })
      }

    })()

  }, []);



  return (
    <Layout>
      <>
        <Portal>
          <Modal contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'white', padding: 20, width: FULL_WIDTH }} visible={predictionModalData.visible} onDismiss={() => setPredictionModalData({ ...predictionModalData, visible: false })}>
            <Card key={predictionModalData.content.id}>
              <Card.Cover source={{ uri: predictionModalData.content.uri }} />
              <Card.Content>
                <Paragraph>{predictionModalData.content.textData}</Paragraph>
                {/* @ts-ignore */}
                <TextInput
                  label={I18n.t("comment")}
                  onChangeText={text => setPredictionModalData({ ...predictionModalData, content: { ...predictionModalData.content, comment: text } })}
                  style={{ width: "100%", marginBottom: 10 }}
                />
                <View style={{ minHeight: 100, flex: 1, alignItems: "center", justifyContent: "space-around", flexDirection: "row" }}>

                  {
                    [...Array(5).keys()].map((star) => (
                      <IconButton key={star} iconColor={predictionModalData.content.rating >= star ? "#ffff00" : "#000"} icon="star" mode="contained" onPress={() => {
                        setPredictionModalData({
                          ...predictionModalData,
                          content: {
                            ...predictionModalData.content,
                            rating:
                              predictionModalData.content.rating === star
                                ? star - 1
                                : star
                          }
                        })
                      }} />
                    ))
                  }

                </View>
              </Card.Content>
              <Card.Actions style={{ marginTop: 100 }}>

                <Button mode="contained" onPress={async () => {
                  try {
                    setLoadingStatus(true)
                    const res = await fetch(
                      formatUrl("items/feedbacks"),
                      {
                        body: JSON.stringify(
                          {
                            comment: predictionModalData.content.comment,
                            rating: predictionModalData.content.rating - 1,
                            model_id: req.data?.id,
                            prediction_data: predictionModalData.content.json || null,
                            image_data: predictionModalData.content.uri,
                          }
                        ),
                        method: "POST"
                      }
                    );


                    if ([204, 200].includes(res.status)) {
                      toast.closeAll();
                      toast.show({ title: "Réponse soumise avec succès" });
                      return setPredictionModalData({ ...predictionModalData, visible: false })
                    }
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setLoadingStatus(false);
                  }
                }}>{I18n.t("submit_feedback")}</Button>

                <IconButton icon="close" mode="contained" style={{ flexBasis: "10%" }} onPress={() => {
                  setPredictionModalData({ ...predictionModalData, visible: false })
                }} />

                <IconButton icon="delete" mode="contained" style={{ flexBasis: "10%" }} onPress={() => {
                  const currentPredictions = predictions.filter(
                    (item) => item.id !== predictionModalData.content.id
                  );
                  setPredictions(currentPredictions);
                  setPredictionModalData({ ...predictionModalData, visible: false })
                }} />



              </Card.Actions>
            </Card>
          </Modal>
        </Portal>

        <Portal>
          <Modal contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'white', padding: 20, width: FULL_WIDTH }} visible={predictionControls.cameraPermissionGranted && predictionControls.cameraOn} onDismiss={() => setPredictionControls({ ...predictionControls, cameraOn: false })} >
            <Camera
              ref={cameraRef}
              style={{
                width: FULL_WIDTH - 20,
                height: 500,
              }}
              // @ts-ignore
              type={predictionControls.cameraType}
              autoFocus={true}
              // @ts-ignore
              whiteBalance={Camera.Constants.WhiteBalance.auto}
            ></Camera>

            <View style={{ flex: 1, alignItems: "center", justifyContent: "space-around", flexDirection: "row", flexWrap: "wrap", width: FULL_WIDTH }}>

              <IconButton icon="camera-iris" mode="contained" style={{ flexBasis: "50%" }} onPress={() => handleImageCapture()} />

              <IconButton icon="camera-retake" mode="contained" style={{ flexBasis: "10%" }} onPress={() => {
                setPredictionControls({
                  ...predictionControls,
                  // @ts-ignore
                  cameraType: predictionControls.cameraType === Camera.Constants.Type.front ? Camera.Constants.Type.back : Camera.Constants.Type.front
                })
              }} />

              <IconButton icon="close-circle-outline" mode="contained" style={{ flexBasis: "10%" }} onPress={() => {
                setPredictionControls({ ...predictionControls, cameraOn: false })
              }} />

            </View>

          </Modal>
        </Portal>

        <Card>
          {/* <Card.Title title={req.data?.title} /> */}
          <Card.Cover source={{ uri: formatUrl(`file/${req.data?.thumb}`) }} />
          <Card.Content>
            <Title>{req.data?.title}</Title>
            <Paragraph>{req.data?.description}</Paragraph>
            <Button mode="contained" style={{ marginTop: 10 }} onPress={() => Linking.openURL(req.data?.doc_url)}>{I18n.t("see_documentation")}</Button>
          </Card.Content>
        </Card>

        <View>
          <Text style={{ textAlign: "center", padding: 20 }} variant="titleMedium">{I18n.t("test")} {req.data?.title}</Text>
          <View style={{ flex: 1, alignItems: "center", justifyContent: "space-around", flexDirection: "row", flexWrap: "wrap", width: FULL_WIDTH }}>
            {/* @ts-ignore */}
            <TextInput
              label={I18n.t("image_url")}
              // value={formRef.current.imageUrl}
              onChangeText={text => formRef.current.imageUrl = text}
              style={{ flexBasis: "85%", width: "89%", marginBottom: 10 }}
            />
            <IconButton icon="send" mode="contained" style={{ flexBasis: "10%" }} onPress={() => predict(null, formRef.current.imageUrl)} />
          </View>

          <View style={{ flex: 1, alignItems: "center", justifyContent: "space-around", flexDirection: "row", flexWrap: "wrap", width: FULL_WIDTH }}>

            <IconButton icon="camera" mode="contained" style={{ flexBasis: "10%" }} onPress={() => setPredictionControls({ ...predictionControls, cameraOn: true })} />

            <IconButton icon="file" mode="contained" style={{ flexBasis: "10%" }} onPress={() => pickImage()} />

            <IconButton icon="image-filter-hdr" mode="contained" style={{ flexBasis: "10%" }} onPress={() => predict()} />

            <IconButton icon="delete" mode="contained" style={{ flexBasis: "10%" }} onPress={() => setPredictions([])} />
          </View>
        </View>
        {
          isLoading ?
            <ActivityIndicator />
            :
            null
        }

        {
          predictions.map((item) => (
            <TouchableHighlight
              key={item.id}
              onPress={() => setPredictionModalData({ visible: true, content: { ...predictionModalData, ...item } })}>
              <Card key={item.id}>
                <Card.Cover source={{ uri: item.uri }} />
                <Card.Content>
                  {/* <Title>{item.textData}</Title> */}
                  <Paragraph>{item.textData}</Paragraph>
                  {/* <Card.Actions>
                    <IconButton icon="delete"/>
                  </Card.Actions> */}
                </Card.Content>
              </Card>
            </TouchableHighlight>
          ))
        }
      </>



    </Layout>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    height: "100%",
    width: FULL_WIDTH
  },
  container: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  }
})
