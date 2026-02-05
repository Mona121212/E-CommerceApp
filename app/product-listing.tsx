import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  type ListRenderItem,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import ProductCard from "@/components/product-card";
import SearchBar from "@/components/search-bar";
import CartIcon from "@/components/cart-icon";
import { searchProducts } from "@/api/product-service";
import type { Product } from "@/types";
import { useEffect, useState } from "react";

import React from "react";

const ProductListingScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams() as Record<string, string | undefined>;
  const { query } = params;

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = async (searchQuery?: string): Promise<void> => {
    try {
      setLoading(true);
      const QueryToUse = searchQuery ?? query ?? "";
      const results = await searchProducts(QueryToUse);
      setProducts(results);
    } catch (error) {
      console.error("Error loading products in listing page", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadProducts();
  }, [query]);

  const renderItem: ListRenderItem<Product> = ({ item }) => (
    <ProductCard
      product={item}
      style={styles.productCard}
      onPress={() => {
        router.push({
          pathname: `/(tabs)/product/${item.id}`,
          params: {
            initialData: JSON.stringify(item),
          },
        });
      }}
    />
  );

  const handleSearch = (newQuery: string): void => {
    router.setParams({ query: newQuery });
    loadProducts(newQuery);
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: query ? `Search for: ${query} ...` : "Product Listing",
          headerRight: () => <CartIcon />,
        }}
      />
      <View style={styles.container}>
        <SearchBar
          placeholder="Search products..."
          onSearch={handleSearch}
          initialValue={query ?? ""}
        />
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5B37B7" />
          </View>
        ) : (
          <>
            {" "}
            {products.length > 0 ? (
              <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.productList}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                  />
                }
                ListHeaderComponent={
                  <Text style={styles.resultsText}>
                    {`${products.length} ${products.length === 1 ? "result" : "results"}`}
                  </Text>
                }
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products found</Text>
                <Text style={styles.emptySubText}>
                  Please try a different search term.
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </>
  );
};

export default ProductListingScreen;

const styles = StyleSheet.create({
  productCard: {
    flex: 1,
    margin: 8,
    maxWidth: "50%",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  productList: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultsText: {
    fontSize: 16,
    color: "#555",
    marginVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginTop: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
});
