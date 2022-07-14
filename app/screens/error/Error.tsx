import { Text, View } from "react-native";
import React from "react";
import Layout from "../../components/layout/Layout";
import CustomErrorFallback from "../../components/custom/Error";
export default function Error() {
  return (
    <CustomErrorFallback error={{} as Error} resetError={() => null} />
  );
}
