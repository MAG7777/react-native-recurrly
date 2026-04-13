import { useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

export default function SignUp() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isVerificationStep =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  const canSubmit = useMemo(
    () => emailAddress.trim().length > 0 && password.length >= 8 && fetchStatus !== "fetching",
    [emailAddress, password, fetchStatus]
  );

  const generalError = localError || (errors as any)?.message;

  const handleSubmit = async () => {
    setLocalError(null);

    if (!isValidEmail(emailAddress)) {
      setLocalError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    const { error } = await signUp.password({ emailAddress, password });

    if (error) {
      setLocalError(error.message || "Unable to create an account.");
      return;
    }

    if (signUp.status === "missing_requirements") {
      await signUp.verifications.sendEmailCode();
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.push(url as Href);
        }
      });
    }
  };

  const handleVerify = async () => {
    setLocalError(null);

    if (!code.trim()) {
      setLocalError("Enter the verification code sent to your email.");
      return;
    }

    const { error } = await signUp.verifications.verifyEmailCode({ code });

    if (error) {
      setLocalError(error.message || "Unable to verify code.");
      return;
    }

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.push(url as Href);
        }
      });
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-[#fff7e0] auth-safe-area">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        className="auth-screen"
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
          className="flex-1 justify-center px-6 py-8"
        >
          <View className="items-center space-y-8">
            <View className="flex-row items-center gap-4">
              <View className="justify-center items-center bg-accent rounded-[28px] w-20 h-20">
                <Text className="font-sans-extrabold text-white text-3xl">R</Text>
              </View>
              <View>
                <Text className="font-sans-extrabold text-primary text-3xl">Recurly</Text>
                <Text className="mt-1 font-sans-semibold text-[#43556f] text-xs tracking-[0.24px]">
                  SMART BILLING
                </Text>
              </View>
            </View>

            <View className="space-y-3 text-center">
              <Text className="font-sans-extrabold text-primary text-3xl text-center">Create your account</Text>
              <Text className="px-4 text-[#43556f] text-base text-center">
                Create a secure Recurly account and start managing your recurring expenses in one place.
              </Text>
            </View>

            <View className="bg-card shadow-2xl shadow-black/10 p-6 border border-[#eaddc0] rounded-4xl w-full">
              {isVerificationStep ? (
                <View className="space-y-5">
                  <View>
                    <Text className="auth-field-label">Verification code</Text>
                    <TextInput
                      value={code}
                      onChangeText={setCode}
                      placeholder="Enter your verification code"
                      placeholderTextColor="#5a6b86"
                      keyboardType="numeric"
                      className="auth-input"
                    />
                    {errors.fields?.code && (
                      <Text className="auth-error">{errors.fields.code.message}</Text>
                    )}
                  </View>

                  {generalError ? <Text className="auth-error">{generalError}</Text> : null}

                  <Pressable
                    className="auth-button"
                    onPress={handleVerify}
                    disabled={fetchStatus === "fetching"}
                  >
                    {fetchStatus === "fetching" ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="auth-button-text">Verify</Text>
                    )}
                  </Pressable>

                  <Pressable
                    className="auth-secondary"
                    onPress={() => {
                      signUp.reset();
                      setCode("");
                      setLocalError(null);
                    }}
                  >
                    <Text className="auth-link-text">Start over</Text>
                  </Pressable>
                </View>
              ) : (
                <View className="space-y-5">
                  <View>
                    <Text className="auth-field-label">Email</Text>
                    <TextInput
                      value={emailAddress}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      placeholder="Enter your email"
                      placeholderTextColor="#5a6b86"
                      onChangeText={setEmailAddress}
                      className="auth-input"
                    />
                    {errors.fields?.emailAddress && (
                      <Text className="auth-error">{errors.fields.emailAddress.message}</Text>
                    )}
                  </View>

                  <View>
                    <Text className="auth-field-label">Password</Text>
                    <View className="relative">
                      <TextInput
                        value={password}
                        secureTextEntry={!showPassword}
                        placeholder="Enter your password"
                        placeholderTextColor="#5a6b86"
                        onChangeText={setPassword}
                        className="auth-input"
                      />
                      <Pressable
                        className="top-4 right-4 absolute"
                        onPress={() => setShowPassword((current) => !current)}
                      >
                        <Text className="font-sans-semibold text-accent">
                          {showPassword ? "Hide" : "Show"}
                        </Text>
                      </Pressable>
                    </View>
                    {errors.fields?.password && (
                      <Text className="auth-error">{errors.fields.password.message}</Text>
                    )}
                  </View>

                  {generalError ? <Text className="auth-error">{generalError}</Text> : null}

                  <Pressable
                    className={`auth-button ${!canSubmit ? "opacity-50" : ""}`}
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                  >
                    {fetchStatus === "fetching" ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="auth-button-text">Create account</Text>
                    )}
                  </Pressable>
                </View>
              )}
            </View>

            <View className="items-center px-2">
              <Text className="text-[#43556f] text-sm">
                Already have an account?{' '}
                <Link href="/sign-in">
                  <Text className="auth-link-text">Sign in</Text>
                </Link>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
