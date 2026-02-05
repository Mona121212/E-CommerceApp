import { StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import LogoutConfirmModal from "@/components/logout-confirm-modal";

const UserMenuIcon = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { saveCart } = useCart();
  const [showModal, setShowModal] = useState(false);

  const handlePress = () => {
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }
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

  // Only show icon if user is logged in
  if (!user) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Ionicons name="person-outline" size={28} color="#333" />
      </TouchableOpacity>
      <LogoutConfirmModal
        visible={showModal}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancel}
      />
    </>
  );
};

export default UserMenuIcon;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 44,
    minHeight: 44,
  },
});
