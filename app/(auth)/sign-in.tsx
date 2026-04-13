import { finalizeAndNavigate } from "@/lib/auth";
import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
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

export default function SignIn() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => emailAddress.trim().length > 0 && password.length >= 8 && fetchStatus !== "fetching",
    [emailAddress, password, fetchStatus]
  );

  const generalError = localError || (errors as any)?.message;

  const handleSubmit = async () => {
    setLocalError(null);

    if (!isValidEmail(emailAddress)) {
      setLocalError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }
    try {
      const { error } = await signIn.password({ emailAddress, password });

      if (error) {
        setLocalError(error.message || "Unable to sign in. Please check your credentials.");
        return;
      }

      if (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code"
        );

        if (emailCodeFactor) {
          try {
            const { error: mfaError } = await signIn.mfa.sendEmailCode();
            if (mfaError) {
              setLocalError(mfaError.message || "Unable to send verification code.");
            }
          } catch (error) {
            console.error(error);
            setLocalError(
              error instanceof Error
                ? error.message
                : "Unable to send verification code. Please try again."
            );
          }
        } else {
          setLocalError("A second-factor challenge is required. Please check your email for instructions.");
        }

        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({ navigate: finalizeAndNavigate(router) });
      }
    } catch (error) {
      console.error(error);
      setLocalError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during sign-in. Please try again."
      );
    }
  };

  const handleVerify = async () => {
    setLocalError(null);

    try {
      if (!code.trim()) {
        setLocalError("Enter the verification code sent to your email.");
        return;
      }

      const { error } = await signIn.mfa.verifyEmailCode({ code });

      if (error) {
        setLocalError(error.message || "Unable to verify code.");
        return;
      }

      if (signIn.status === "complete") {
        await signIn.finalize({ navigate: finalizeAndNavigate(router) });
      }
    } catch (error) {
      console.error(error);
      setLocalError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during verification. Please try again."
      );
    }
  };

  const isMfaFlow = signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor";

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
              <Text className="font-sans-extrabold text-primary text-3xl text-center">Welcome back</Text>
              <Text className="px-4 text-[#43556f] text-base text-center">
                Sign in to continue managing your subscriptions
              </Text>
            </View>

            <View className="bg-card shadow-2xl shadow-black/10 p-6 border border-[#eaddc0] rounded-4xl w-full">
              {isMfaFlow ? (
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
                      signIn.reset();
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
                    {errors.fields?.identifier && (
                      <Text className="auth-error">{errors.fields.identifier.message}</Text>
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
                      <Text className="auth-button-text">Sign in</Text>
                    )}
                  </Pressable>
                </View>
              )}
            </View>

            <View className="items-center px-2">
              <Text className="text-[#43556f] text-sm">
                New to Recurly?{' '}
                <Link href="/sign-up">
                  <Text className="auth-link-text">Create an account</Text>
                </Link>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
