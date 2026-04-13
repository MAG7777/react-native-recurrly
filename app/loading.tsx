import { colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <View style={styles.mark}>
          <Text style={styles.line}>SAM</Text>
          <Text style={styles.line}>YAN</Text>
        </View>
        <View style={styles.tag}>
          <Text style={styles.tagLetter}>R</Text>
          <Text style={styles.tagLetter}>E</Text>
          <Text style={styles.tagLetter}>N</Text>
          <Text style={styles.tagLetter}>T</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Սկսում է...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.accent,
    paddingVertical: 22,
    paddingHorizontal: 26,
  },
  mark: {
    marginRight: 16,
  },
  line: {
    color: colors.background,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
  },
  tag: {
    alignItems: "center",
    justifyContent: "center",
  },
  tagLetter: {
    color: colors.accent,
    fontSize: 12,
    letterSpacing: 4,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 48,
    color: colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
});
