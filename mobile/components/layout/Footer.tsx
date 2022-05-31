import { ComponentWithNavigationProps } from "../../@types/component";
import { Box, Text } from "native-base";
import React from "react";

const Footer: React.FC<ComponentWithNavigationProps> = ({
  navigation,
  route,
}) => {
  return (
    <Box
      _light={{ bg: "bg.dark" }}
      _dark={{ bg: "bg.dark" }}
      flexDirection="row"
      // height={"100%"}
      // safeAreaBottom
      // shadow={6}
      // safeAreaTop
      width="100%"
      maxHeight={"400px"}
      padding={0}
      margin={0}
    >
      <Text>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum quasi
        voluptates harum, voluptatibus magni sequi provident fugit doloribus
        reprehenderit adipisci ab laborum dignissimos optio rem quia accusamus?
        Incidunt, accusantium facilis. Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Necessitatibus fugiat, delectus vero sint rerum
        eveniet, quas laudantium expedita similique accusamus, in hic aut iusto
        praesentium facere harum eius ut consequuntur? Lorem ipsum dolor sit
        amet consectetur adipisicing elit. Delectus blanditiis optio, eligendi,
        neque rem sequi rerum molestias officia corporis deserunt dignissimos
        nesciunt ad a expedita porro cumque voluptate. Aperiam, possimus! Lorem
        ipsum dolor sit amet consectetur adipisicing elit. Accusantium in illum
        delectus ipsum magnam sapiente sint, iure provident, error veniam
        fugiat, odit quod pariatur sequi est. Id ipsum eligendi doloremque?
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cum quasi
        voluptates harum, voluptatibus magni sequi provident fugit doloribus
        reprehenderit adipisci ab laborum dignissimos optio rem quia accusamus?
        Incidunt, accusantium facilis. Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Necessitatibus fugiat, delectus vero sint rerum
        eveniet, quas laudantium expedita similique accusamus, in hic aut iusto
        praesentium facere harum eius ut consequuntur? Lorem ipsum dolor sit
        amet consectetur adipisicing elit. Delectus blanditiis optio, eligendi,
        neque rem sequi rerum molestias officia corporis deserunt dignissimos
        nesciunt ad a expedita porro cumque voluptate. Aperiam, possimus! Lorem
        ipsum dolor sit amet consectetur adipisicing elit. Accusantium in illum
        delectus ipsum magnam sapiente sint, iure provident, error veniam
        fugiat, odit quod pariatur sequi est. Id ipsum eligendi doloremque?
      </Text>
    </Box>
  );
};

export default Footer;
