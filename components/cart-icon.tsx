import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCart } from "../context/cart-context";
import { CartIconProps } from "@/types";

const CartIcon = (props: CartIconProps = { color: "#333", size: 30 }) => {
  const router = useRouter();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push({ pathname: "/cart" } as any)}
      activeOpacity={0.7}
    >
      <Ionicons name="cart-outline" size={24} color={props.color} />
      {itemCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {itemCount > 99 ? "99+" : itemCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartIcon;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 10,
    paddingHorizontal: 4,
  },
});
