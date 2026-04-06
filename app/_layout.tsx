import "@/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
const sansBold = require("../assets/fonts/PlusJakartaSans-Bold.ttf");
const sansExtrabold = require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf");
const sansLight = require("../assets/fonts/PlusJakartaSans-Light.ttf");
const sansMedium = require("../assets/fonts/PlusJakartaSans-Medium.ttf");
const sansRegular = require("../assets/fonts/PlusJakartaSans-Regular.ttf");
const sansSemibold = require("../assets/fonts/PlusJakartaSans-SemiBold.ttf");

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": sansRegular,
    "sans-bold": sansBold,
    "sans-medium": sansMedium,
    "sans-semibold": sansSemibold,
    "sans-extrabold": sansExtrabold,
    "sans-light": sansLight
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}
