import {  Text } from 'react-native'
import {styled} from "nativewind";
import { SafeAreaView as RNSafeAreView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreView);

const Insights = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>Insights</Text>
    </SafeAreaView>
  )
}

export default Insights;