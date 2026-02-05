import { Text, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  fetchAllCategories,
  fetchFeaturedProducts,
  fetchFeaturedProductsByCategory,
} from "@/api/product-service";
import CartIcon from "@/components/cart-icon";
import type { Product } from "@/types";
import { router, Stack } from "expo-router";
import CategoryPill from "@/components/category-pill";
import SearchBar from "@/components/search-bar";
import ProductCarousel from "@/components/product-carousel";
import { useAuth } from "@/context/auth-context";

export default function Index() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);

  // Extract username from email (part before @)
  const getUsername = () => {
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Guest";
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch Featured products from the API
      const products = await fetchFeaturedProducts(10);
      setFeaturedProducts(products);

      // Fetch all available categories from the API
      const categoryData = await fetchAllCategories();
      setCategories(categoryData);

      // Fetch Product by Category
      if (categoryData.length > 0) {
        const defaultCategory = categoryData[0];
        const categoryProductData =
          await fetchFeaturedProductsByCategory(defaultCategory);
        setCategoryProducts(categoryProductData);
        setSelectedCategory(defaultCategory);
      }
    } catch (error) {
      console.error("Error loading data on index page", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (category: string | null) => {
    setSelectedCategory(category);
    if (!category) {
      // if All is selected
      setCategoryProducts(featuredProducts);
      return;
    }
    try {
      const products = await fetchFeaturedProductsByCategory(category);
      setCategoryProducts(products);
    } catch (error) {
      console.error("Error fetching products by category", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "My Store",
          headerRight: () => <CartIcon />,
        }}
      />
      <View style={styles.container}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingText}>
            {getGreeting()}, <Text style={styles.usernameText}>{getUsername()}</Text>
          </Text>
        </View>
        <SearchBar
          onSearch={(query) => {
            if (query.trim()) {
              router.push({
                pathname: "/product-listing",
                params: { query },
              });
            }
          }}
        />
        <ProductCarousel
          products={featuredProducts}
          title="Featured Products"
          style={{ marginBottom: 16 }}
        />
        <View style={{ maxHeight: 80 }}>
          <CategoryPill
            categories={categories}
            onSelectCategory={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        </View>
        <View style={styles.categoryProductContainer}>
          {categoryProducts.length > 0 ? (
            <ProductCarousel
              products={categoryProducts}
              title={
                selectedCategory
                  ? `Product in ${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}`
                  : "All Products"
              }
            />
          ) : (
            <Text style={styles.noProductsText}>
              No products found in this category.
            </Text>
          )}
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  greetingContainer: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  usernameText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5B37B7",
  },
  categoryProductContainer: {
    marginTop: 8,
  },
  noProductsText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
