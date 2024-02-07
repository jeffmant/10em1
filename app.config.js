module.exports = {
  expo: {
    name: "10em1",
    slug: "10em1",
    version: "5.0.0",
    scheme: "myapp",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#1B1B1F"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.clubdev.DezEmUm"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#1B1B1F"
      },
      package: "com.clubdev.DezEmUm",
      versionCode: 5
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "42ed7d45-eac2-4dae-9196-79d4b8e37689"
      }
    },
    plugins: [
      [
        "onesignal-expo-plugin",
        {
          mode: "development",
        }
      ]
    ]
  }
}
