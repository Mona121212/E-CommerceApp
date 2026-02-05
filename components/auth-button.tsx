import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import LogoutConfirmModal from "@/components/logout-confirm-modal";

const AuthButton = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { saveCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  const handleSignIn = () => {
    router.push("/auth/sign-in");
  };

  const handleSignOut = () => {
    setShowModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      setShowModal(false);
      // Save cart before signing out
      await saveCart();
      await signOut();
      // Navigate to sign in page
      router.replace("/auth/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      {user ? (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.button, styles.signInButton]}
          onPress={handleSignIn}
          activeOpacity={0.7}
        >
          <Text style={[styles.buttonText, styles.signInButtonText]}>Sign In</Text>
        </TouchableOpacity>
      )}
      {user && (
        <LogoutConfirmModal
          visible={showModal}
          onConfirm={handleConfirmLogout}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};

export default AuthButton;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  signInButton: {
    backgroundColor: "#5B37B7",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  signInButtonText: {
    color: "#fff",
  },
});
