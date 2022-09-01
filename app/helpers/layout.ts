import { Dimensions } from 'react-native';
import { MAX_SMALL_SCREEN_WIDTH } from '../constants/layout';
export const isSmallScreen = ()=>  Dimensions.get("window").width <= MAX_SMALL_SCREEN_WIDTH;