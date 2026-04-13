import "@/global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
const sansBold = require("../assets/fonts/PlusJakartaSans-Bold.ttf");
const sansExtrabold = require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf");
const sansLight = require("../assets/fonts/PlusJakartaSans-Light.ttf");
const sansMedium = require("../assets/fonts/PlusJakartaSans-Medium.ttf");
const sansRegular = require("../assets/fonts/PlusJakartaSans-Regular.ttf");
const sansSemibold = require("../assets/fonts/PlusJakartaSans-SemiBold.ttf");

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;
if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file as EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "sans-regular": sansRegular,
    "sans-bold": sansBold,
    "sans-medium": sansMedium,
    "sans-semibold": sansSemibold,
    "sans-extrabold": sansExtrabold,
    "sans-light": sansLight
  });
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().then(() => {
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [fontsLoaded]);

  if (fontError) throw fontError;
  if (!fontsLoaded) return null;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Animated.View style={{ flex: 1, opacity }}>
        <Stack screenOptions={{ headerShown: false }} />
      </Animated.View>
    </ClerkProvider>
  );
}
