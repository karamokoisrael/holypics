import { Dimensions } from "react-native";
const window = Dimensions.get("window");
export const MAX_SMALL_SCREEN_WIDTH = 767
export const WINDOW_HEIGHT = window.height
export const WINDOW_WIDTH = window.width
export const APP_WITH_LIMIT = 600 //1185
export const FULL_WIDTH = WINDOW_WIDTH > APP_WITH_LIMIT ? APP_WITH_LIMIT : WINDOW_WIDTH