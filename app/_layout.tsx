import { Stack } from "expo-router";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { View, ActivityIndicator, StyleSheet } from "react-native";

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/sign-in" options={{ title: "Sign In" }} />
      <Stack.Screen name="auth/sign-up" options={{ title: "Sign Up" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product-listing" />
      <Stack.Screen name="product/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootLayoutNav />
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
