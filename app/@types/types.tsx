import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
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

  // 
  Legal: NavigatorScreenParams<RootTabParamList> | undefined;
  Articles: NavigatorScreenParams<RootTabParamList> | undefined;
  Portfolio: NavigatorScreenParams<RootTabParamList> | undefined;
  BackupWallet: NavigatorScreenParams<RootTabParamList> | undefined;
  SignUp: NavigatorScreenParams<RootTabParamList> | undefined;
  SignIn: NavigatorScreenParams<RootTabParamList> | undefined;
  PinLocked: NavigatorScreenParams<RootTabParamList> | undefined;
  Home: NavigatorScreenParams<RootTabParamList> | undefined;
  Settings: NavigatorScreenParams<RootTabParamList> | undefined;
  Security: NavigatorScreenParams<RootTabParamList> | undefined;
  TermsAndUse: NavigatorScreenParams<RootTabParamList> | undefined;
  NotFound: NavigatorScreenParams<RootTabParamList> | undefined;

  Models: NavigatorScreenParams<RootTabParamList> | undefined;
  Holipics: NavigatorScreenParams<RootTabParamList> | undefined;
  StableDiffusion: NavigatorScreenParams<RootTabParamList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

