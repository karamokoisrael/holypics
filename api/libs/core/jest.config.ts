import type { Config } from "@jest/types";
process.env = Object.assign(process.env || {}, {
  PUBLIC_URL: "http://localhost:8055",
});
const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
export default config;
