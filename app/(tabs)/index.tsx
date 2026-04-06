import "@/global.css";
import { Link } from "expo-router";
import { Text } from "react-native";
import {styled} from "nativewind";
import { SafeAreaView as RNSafeAreView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="font-bold text-success text-xl">
        Welcome to Nativewind!
      </Text>
      <Link href="./onboarding" className="bg-primary mt-4 p-4 rounded text-white">
        Onboarding
      </Link>
      <Link href="/(auth)/sign-in" className="bg-primary mt-4 p-4 rounded text-white">
        Go to Sign In
      </Link>
      <Link href="/(auth)/sign-up" className="bg-primary mt-4 p-4 rounded text-white">
        Go to Sign Up
      </Link>
      <Link href="/subscriptions/spotify">Spotify Subscription</Link>
      <Link href={{
        pathname: "/subscriptions/[id]",
        params: { id: "claude" }
      }}>
        Claude Max Subscription
      </Link>
    </SafeAreaView>
  );
}