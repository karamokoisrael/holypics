
import {
  Center,
  useColorMode,
  Tooltip,
  IconButton,
  SunIcon,
  MoonIcon,
  Image,
  HStack,
  Text,
  Heading,
  Code,
  Link,
  VStack,
  Button,
  AspectRatio,
  Box,
} from "native-base";
import Layout from "../components/Layout";
import useStore from "../context/store";
import React from "react";

// Start editing here, save and see your changes.
export default function Demo() {
  const store = useStore();
  return (
    <Layout>
      <Box flex={1} bg="#fff" alignItems="center" justifyContent="center">
        <Text>Open up App.js to start working on your app!</Text>
      </Box>
    </Layout>
  );
}
// Color Switch Component

