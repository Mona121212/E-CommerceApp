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

    // Allow users to browse products without login
    // Default behavior: redirect to tabs (product browsing page)
    
    // If on root path, always redirect to tabs to browse products
    if (segments.length === 0) {
      router.replace("/(tabs)");
      return;
    }

    // If logged in and on auth page, redirect to tabs
    if (user && segments[0] === "auth") {
      router.replace("/(tabs)");
      return;
    }

    // If not on tabs, product, or auth pages, redirect to tabs
    if (segments[0] !== "(tabs)" && segments[0] !== "product" && segments[0] !== "auth") {
      router.replace("/(tabs)");
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
