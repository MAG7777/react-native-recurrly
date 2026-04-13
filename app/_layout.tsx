import "@/global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useGlobalSearchParams, usePathname } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "../src/config/posthog";
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

function ScreenTracker() {
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const previousPathname = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, {
        previous_screen: previousPathname.current ?? null,
        ...params,
      });
      previousPathname.current = pathname;
    }
  }, [pathname, params]);

  return null;
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
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ["testID"],
      }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ScreenTracker />
        <Animated.View style={{ flex: 1, opacity }}>
          <Stack screenOptions={{ headerShown: false }} />
        </Animated.View>
      </ClerkProvider>
    </PostHogProvider>
  );
}
