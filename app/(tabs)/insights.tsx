import { Text } from 'react-native'
import {styled} from "nativewind";
import { SafeAreaView as RNSafeAreView} from "react-native-safe-area-context";
import { usePostHog } from 'posthog-react-native';
import { useEffect } from 'react';

const SafeAreaView = styled(RNSafeAreView);

const Insights = () => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('insights_viewed');
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>Insights</Text>
    </SafeAreaView>
  )
}

export default Insights;