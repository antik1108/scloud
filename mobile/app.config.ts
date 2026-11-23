import type { ConfigContext, ExpoConfig } from "expo/config";

/**
 * Environment-driven Expo config. APP_ENV=dev|prod selects bundle id, app name
 * and Firebase config files. See SPEC.md §2 and firebase-config/README.md.
 */
type AppEnv = "dev" | "prod";

const APP_ENV: AppEnv = process.env.APP_ENV === "prod" ? "prod" : "dev";
const IS_PROD = APP_ENV === "prod";
const BUNDLE_ID = IS_PROD ? "com.lumio.app" : "com.lumio.app.dev";
const FIREBASE_DIR = `./firebase-config/${APP_ENV}`;
const BACKGROUND = "#0E0E10";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_PROD ? "Lumio" : "Lumio Dev",
  slug: "lumio",
  scheme: IS_PROD ? "lumio" : "lumio-dev",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  backgroundColor: BACKGROUND,
  ios: {
    bundleIdentifier: BUNDLE_ID,
    supportsTablet: false,
    googleServicesFile: `${FIREBASE_DIR}/GoogleService-Info.plist`,
    infoPlist: { ITSAppUsesNonExemptEncryption: false },
  },
  android: {
    package: BUNDLE_ID,
    googleServicesFile: `${FIREBASE_DIR}/google-services.json`,
    adaptiveIcon: {
      backgroundColor: BACKGROUND,
      foregroundImage: "./assets/android-icon-foreground.png",
      backgroundImage: "./assets/android-icon-background.png",
      monochromeImage: "./assets/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    // Android 13+ requires this to be declared before requesting notification permission.
    permissions: ["android.permission.POST_NOTIFICATIONS"],
  },
  plugins: [
    "expo-router",
    "expo-status-bar",
    ["expo-splash-screen", { backgroundColor: BACKGROUND, image: "./assets/splash-icon.png", imageWidth: 120 }],
    [
      "expo-build-properties",
      {
        ios: { useFrameworks: "static", deploymentTarget: "17.0" },
        android: { minSdkVersion: 26 },
      },
    ],
    "expo-localization",
    "expo-web-browser",
    [
      "expo-media-library",
      {
        photosPermission: "Lumio needs access to your photos so you can pick portraits to edit.",
        savePhotosPermission: "Lumio saves your edited photos to your library.",
        isAccessMediaLocationEnabled: false,
        granularPermissions: ["photo", "video"],
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission: "Lumio uses the camera so you can take a selfie to edit.",
        microphonePermission: false,
        recordAudioAndroid: false,
        barcodeScannerEnabled: false,
      },
    ],
    [
      "expo-tracking-transparency",
      {
        userTrackingPermission:
          "Your data is used to measure our ads and offer you relevant promotions. You can change this anytime in Settings.",
      },
    ],
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-firebase/app-check",
    "@react-native-firebase/analytics",
    "@react-native-firebase/crashlytics",
    "@react-native-firebase/messaging",
  ],
  experiments: { typedRoutes: true },
  extra: {
    appEnv: APP_ENV,
    eas: process.env.EAS_PROJECT_ID ? { projectId: process.env.EAS_PROJECT_ID } : undefined,
  },
});
