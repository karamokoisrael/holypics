import "dotenv/config";

export default {
  expo: {
    name: "megamax development",
    slug: "megamaxDevelopment",
    extra: {
      huggingFaceApiToken: process.env.HUGGING_FACE_API_TOKEN,
    },
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/img/logo-bg.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/img/logo-splash.png",
      resizeMode: "contain",
      backgroundColor: "#f3f4f6",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.megamaxdevelopment.app",
      adaptiveIcon: {
        foregroundImage: "./assets/img/logo.png",
        backgroundColor: "#f3f4f6",
      },
    },
    web: {
      favicon: "./assets/img/logo.png",
    },
    plugins: [
      [
        "expo-image-picker",
        {
          photosPermission:
            "The app accesses your photos to let you share them with your friends.",
        },
      ],
    ],
  },
};
