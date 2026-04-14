import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/context/subscriptions-context";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const { subscriptions } = useSubscriptions();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  const filteredSubscriptions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return subscriptions;
    }

    return subscriptions.filter((subscription) => {
      const fieldsToSearch = [
        subscription.name,
        subscription.plan,
        subscription.category,
        subscription.paymentMethod,
        subscription.billing,
        subscription.status,
      ];

      return fieldsToSearch.some((value) =>
        value?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, subscriptions]);

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
        <View className="flex-1 p-5">
          <View className="mb-5">
            <Text className="mb-4 font-sans-bold text-primary text-2xl">Subscriptions</Text>
            <View className="bg-card px-4 py-3 border border-border rounded-2xl">
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search subscriptions"
                placeholderTextColor="#8f96a0"
                style={{
                  color: "#0f172a",
                  fontSize: 16,
                  textAlign: "center",
                  minHeight: 44,
                  width: "100%",
                }}
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                returnKeyType="search"
                keyboardType="default"
                editable={true}
              />
            </View>
          </View>

          <FlatList
            data={filteredSubscriptions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const { id, ...subscriptionProps } = item;

              return (
                <SubscriptionCard
                  {...subscriptionProps}
                  expanded={expandedSubscriptionId === id}
                  onPress={() =>
                    setExpandedSubscriptionId((currentId) =>
                      currentId === id ? null : id
                    )
                  }
                />
              );
            }}
            ItemSeparatorComponent={() => <View className="h-4" />}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            ListEmptyComponent={
              <Text className="home-empty-state">No subscriptions found.</Text>
            }
            contentContainerClassName="pb-30"
          />
        </View>
    </SafeAreaView>
  );
};

export default Subscriptions;