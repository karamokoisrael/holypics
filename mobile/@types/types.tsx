/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Authentication: NavigatorScreenParams<RootTabParamList> | undefined;
  Account: NavigatorScreenParams<RootTabParamList> | undefined;
  Error: NavigatorScreenParams<RootTabParamList> | undefined;
  Notification: NavigatorScreenParams<RootTabParamList> | undefined;
  Order: NavigatorScreenParams<RootTabParamList> | undefined;
  Other: NavigatorScreenParams<RootTabParamList> | undefined;
  OnBoarding: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
