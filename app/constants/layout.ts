import { Dimensions } from "react-native";
const window = Dimensions.get("window");
export const MAX_SMALL_SCREEN_WIDTH = 767
export const WINDOW_HEIGHT = window.height
export const WINDOW_WIDTH = window.width
export const APP_WITH_LIMIT = 1185 //1185
export const FULL_WIDTH = WINDOW_WIDTH > APP_WITH_LIMIT ? APP_WITH_LIMIT : WINDOW_WIDTH
export const SMALL_SCREEN = WINDOW_WIDTH < MAX_SMALL_SCREEN_WIDTH;
