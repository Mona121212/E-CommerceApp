import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@/context/auth-context";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      // User is not authenticated, redirect to sign-in
      if (segments[0] !== "auth") {
        router.replace("/auth/sign-in");
      }
    } else {
      // User is authenticated, redirect to tabs
      if (segments[0] === "auth") {
        router.replace("/(tabs)");
      } else if (segments[0] !== "(tabs)" && segments[0] !== "product") {
        router.replace("/(tabs)");
      }
    }
  }, [user, loading, segments]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#5B37B7" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
