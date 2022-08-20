import { Text, View } from "react-native";
import React from "react";
import Layout from "../../components/layout/Layout";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
export default function SignIn() {
  const navigation = useNavigation();
  return (
    <Layout>
      <View>
      <Text>SignIn</Text>
      <Button onPress={()=> navigation.navigate("SignUp")}>Hey</Button>
      </View>
    </Layout>
  );
}
