import { icons } from "@/constants/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const FREQUENCY_OPTIONS = ["Monthly", "Yearly"] as const;
const CATEGORY_OPTIONS = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#fb7185",
  "AI Tools": "#818cf8",
  "Developer Tools": "#22c55e",
  Design: "#ec4899",
  Productivity: "#0ea5e9",
  Cloud: "#8b5cf6",
  Music: "#f59e0b",
  Other: "#a78bfa",
};

type FrequencyOption = (typeof FREQUENCY_OPTIONS)[number];
type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

type CreateSubscriptionModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (subscription: any) => void;
};

const CreateSubscriptionModal = ({
  visible,
  onClose,
  onSubmit,
}: CreateSubscriptionModalProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<FrequencyOption>("Monthly");
  const [category, setCategory] = useState<CategoryOption>("Entertainment");
  const [error, setError] = useState<string | null>(null);

  const numericPrice = useMemo(() => parseFloat(price), [price]);
  const isValid = useMemo(
    () => name.trim().length > 0 && !Number.isNaN(numericPrice) && numericPrice > 0,
    [name, numericPrice]
  );

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Please enter a subscription name.");
      return;
    }

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("Please enter a valid price greater than zero.");
      return;
    }

    const newSubscription = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim(),
      price: numericPrice,
      frequency,
      category,
      status: "active",
      startDate: dayjs().format("MMM D, YYYY"),
      renewalDate: dayjs()
        .add(frequency === "Monthly" ? 1 : 1, frequency === "Monthly" ? "month" : "year")
        .format("MMM D, YYYY"),
      icon: icons.wallet,
      billing: frequency,
      color: CATEGORY_COLORS[category] ?? "#0f172a",
    };

    onSubmit(newSubscription);
    handleClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
        style={{ flex: 1 }}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(15,23,42,0.45)" }}
          onPress={handleClose}
        />
        <View className="bg-background shadow-2xl px-6 pt-5 pb-8 rounded-t-3xl">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="font-sans-bold text-primary text-xl">New Subscription</Text>
            <Pressable onPress={handleClose} className="bg-card p-2 rounded-full">
              <Text className="text-primary text-lg">x</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <View className="mb-4">
              <Text className="mb-2 font-sans-medium text-slate-500 text-sm">Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Subscription name"
                placeholderTextColor="#94a3b8"
                className="auth-input"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 font-sans-medium text-slate-500 text-sm">Price</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                placeholderTextColor="#94a3b8"
                className="auth-input"
                keyboardType="decimal-pad"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-3 font-sans-medium text-slate-500 text-sm">Frequency</Text>
              <View className="flex-row gap-2">
                {FREQUENCY_OPTIONS.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => setFrequency(option)}
                    className={clsx(
                      "flex-1 px-4 py-3 rounded-full",
                      frequency === option ? "picker-option-active" : "picker-option"
                    )}
                  >
                    <Text
                      className={clsx(
                        "text-sm text-center",
                        frequency === option ? "text-white" : "text-slate-700"
                      )}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="mb-6">
              <Text className="mb-3 font-sans-medium text-slate-500 text-sm">Category</Text>
              <View className="flex-row flex-wrap">
                {CATEGORY_OPTIONS.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => setCategory(option)}
                    className={clsx(
                      "mr-2 mb-2 px-4 py-2 rounded-full",
                      category === option ? "category-chip-active" : "category-chip"
                    )}
                  >
                    <Text
                      className={clsx(
                        "text-sm",
                        category === option ? "text-white" : "text-slate-700"
                      )}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {error ? <Text className="mb-4 text-red-500 text-sm">{error}</Text> : null}

            <Pressable
              onPress={handleSubmit}
              disabled={!isValid}
              className={clsx("px-4 py-4 rounded-2xl", isValid ? "auth-button" : "auth-button-disabled")}
            >
              <Text className="font-sans-bold text-white text-base text-center">
                Create subscription
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateSubscriptionModal;