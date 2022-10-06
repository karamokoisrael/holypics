import { Dalle } from "dalle-node";
const dalle = new Dalle("Tgtni24YrkoTB21dYxShBTJbnsOkLpHIh2X2Ik6LXCffreTrWF"); // Bearer Token

const exec = async () => {
  const generations = await dalle.generate("a cat driving a car");
  console.log(generations);
};

exec();
