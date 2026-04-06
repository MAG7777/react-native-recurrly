import "@/global.css";
import { Link } from "expo-router";
import { Text } from "react-native";
import {styled} from "nativewind";
import { SafeAreaView as RNSafeAreView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="font-sans-extrabold text-primary text-5xl">Home</Text>
      
      <Link href="./onboarding" className="bg-primary mt-4 p-4 rounded font-sans-bold text-white">
        Onboarding
      </Link>
      <Link href="/(auth)/sign-in" className="bg-primary mt-4 p-4 rounded font-sans-bold text-white">
        Go to Sign In
      </Link>
      <Link href="/(auth)/sign-up" className="bg-primary mt-4 p-4 rounded font-sans-bold text-white √">
        Go to Sign Up
      </Link>
    </SafeAreaView>
  );
}