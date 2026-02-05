import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { fetchProductById } from "@/api/product-service";
import { useCart } from "@/context/cart-context";
import CartIcon from "@/components/cart-icon";
import type { Product } from "@/types";

const ProductDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, initialData } = params;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(
    initialData ? JSON.parse(initialData as string) : null
  );
  const [loading, setLoading] = useState(!initialData);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      // If we have initialData, use it first
      if (initialData) {
        setProduct(JSON.parse(initialData as string));
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      try {
        setLoading(true);
        const productData = await fetchProductById(id as string);
        if (productData) {
          setProduct(productData);
        } else {
          Alert.alert("Error", "Product not found");
          router.back();
        }
      } catch (error) {
        console.error("Error loading product:", error);
        Alert.alert("Error", "Failed to load product");
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      Alert.alert("Success", "Product added to cart!", [
        {
          text: "Continue Shopping",
          style: "cancel",
        },
        {
          text: "View Cart",
          onPress: () => router.push("/(tabs)/cart"),
        },
      ]);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5B37B7" />
        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/cart")}
              style={styles.headerButton}
            >
              <CartIcon />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShadowVisible: false,
        }}
      />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
      >
        {/* Product Image Section */}
        <View style={styles.imageSection}>
          <Image source={{ uri: product.image }} style={styles.image} />
        </View>

        {/* Product Info Card */}
        <View style={styles.card}>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.priceRatingRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={18} color="#FFD700" />
                <Text style={styles.rating}>
                  {product.rating.rate}
                </Text>
                <Text style={styles.reviewCount}>
                  ({product.rating.count} reviews)
                </Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.categorySection}>
            <Text style={styles.sectionLabel}>Category</Text>
            <Text style={styles.category}>
              {product.category.charAt(0).toUpperCase() +
                product.category.slice(1)}
            </Text>
          </View>
        </View>

        {/* Description Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About this item</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Quantity & Add to Cart Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantitySection}>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={decreaseQuantity}
              >
                <Ionicons name="remove" size={22} color="#333" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={increaseQuantity}
              >
                <Ionicons name="add" size={22} color="#333" />
              </TouchableOpacity>
            </View>
            <Text style={styles.subtotalText}>
              Subtotal: ${(product.price * quantity).toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Ionicons name="cart" size={22} color="#fff" />
            <Text style={styles.addToCartText}>
              Add {quantity} to Cart
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#5B37B7",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageSection: {
    backgroundColor: "#fff",
    marginBottom: 12,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 350,
    backgroundColor: "#fafafa",
    resizeMode: "contain",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    lineHeight: 30,
  },
  priceRatingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#5B37B7",
    letterSpacing: -0.5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 2,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 16,
  },
  categorySection: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  category: {
    fontSize: 16,
    color: "#333",
    textTransform: "capitalize",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: "#4a4a4a",
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  quantitySection: {
    marginTop: 8,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  quantityButton: {
    padding: 10,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 20,
    minWidth: 50,
    textAlign: "center",
    color: "#1a1a1a",
  },
  subtotalText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
    fontWeight: "500",
  },
  addToCartButton: {
    backgroundColor: "#5B37B7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 20,
    gap: 10,
    shadowColor: "#5B37B7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
