import { MaterialIcons } from "@expo/vector-icons";
import {
  VStack,
  Input,
  Icon,
} from "native-base";
import React from "react";
import { ComponentWithNavigationProps } from "../../@types/component";

const SearchBar = ({ navigation }: ComponentWithNavigationProps) => {
  return (
    <VStack w="100%">
      <Input
        placeholder="Rechercher"
        width="100%"
        borderRadius="4"
        py="3"
        px="1"
        fontSize="14"
        InputLeftElement={
          <Icon
            m="2"
            ml="3"
            size="6"
            color="gray.400"
            as={<MaterialIcons name="search" />}
          />
        }
      />
    </VStack>
  );
};

export default SearchBar;
