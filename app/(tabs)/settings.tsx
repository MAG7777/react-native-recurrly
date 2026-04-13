import { useClerk } from "@clerk/expo";
import { styled } from "nativewind";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOut();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-4 font-sans-semibold text-foreground text-lg">Settings</Text>
      <View className="mt-4">
        <Pressable
          className="bg-background px-4 py-3 border border-black/10 rounded-2xl"
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? (
            <ActivityIndicator color="#081126" />
          ) : (
            <Text className="font-sans-semibold text-primary text-base">Sign Out</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

export default Settings;