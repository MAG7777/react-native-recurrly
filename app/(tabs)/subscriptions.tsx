import { Text } from "react-native";
import {styled} from "nativewind";
import { SafeAreaView as RNSafeAreView} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreView);

const Subscriiptions = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>Subscriiptions</Text>
    </SafeAreaView>
  )
}

export default Subscriiptions;