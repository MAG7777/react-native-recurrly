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
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#f79c3c",
    paddingVertical: 22,
    paddingHorizontal: 26,
  },
  mark: {
    marginRight: 16,
  },
  line: {
    color: "#ffffff",
    fontSize: 32,
    lineHeight: 36,
    fontWeight: "800",
  },
  tag: {
    alignItems: "center",
    justifyContent: "center",
  },
  tagLetter: {
    color: "#f79c3c",
    fontSize: 12,
    letterSpacing: 4,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 48,
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
