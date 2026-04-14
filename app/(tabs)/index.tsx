import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { HOME_BALANCE, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { useSubscriptions } from "@/context/subscriptions-context";
import { formatCurrency, formatSubscriptionDateTime } from "@/lib/utils";
import { posthog } from "@/src/config/posthog";
import { styled } from "nativewind";
import React, { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { hasAnalyticsConsent } from "@/lib/analytics";

const SafeAreaView = styled(RNSafeAreaView);

const HomeScreen = () => {
  const { subscriptions, addSubscription } = useSubscriptions();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCreateSubscription = (subscription: Subscription) => {
    addSubscription(subscription);
    setIsModalVisible(false);
    if (hasAnalyticsConsent(posthog)) {
      posthog.capture("subscription_created", {
        subscription_name: subscription.name.trim(),
        subscription_price: subscription.price,
        subscription_category: subscription.category || "uncategorized",
      });
    };
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-background">
      <FlatList
        data={subscriptions}
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
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        ListHeaderComponent={(
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={images.avatar} className="home-avatar" />
                <Text className="home-user-name">{HOME_USER.name}</Text>
              </View>
              <Pressable onPress={() => setIsModalVisible(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Current Balance</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">{formatCurrency(HOME_BALANCE.amount)}</Text>
                <Text className="home-balance-date">
                  Renews {formatSubscriptionDateTime(HOME_BALANCE.nextRenewalDate)}
                </Text>
              </View>
            </View>

            <ListHeading title="Upcoming Subscriptions" />
            <FlatList
              data={UPCOMING_SUBSCRIPTIONS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
              horizontal
              showsHorizontalScrollIndicator={false}
            />

            <ListHeading title="All Subscriptions" />
          </>
        )}
        ListEmptyComponent={
          <View className="py-4">
            <Text className="home-empty-state">No subscriptions found.</Text>
          </View>
        }
      />

      <CreateSubscriptionModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleCreateSubscription}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;