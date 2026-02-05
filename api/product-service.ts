import { Product } from "../types";

const BASE_URL =
  process.env.EXPO_PUBLIC_FAKESTORE_API_URL || "https://fakestoreapi.com";

// Fetch featured products from the FakeStore API

export const fetchFeaturedProducts = async (limit = 10): Promise<Product[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}`);
    const data = await response.json();
    console.log("Fetched featured products:", data);
    return data as Product[];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
};

// Fetch Products by Category

export const fetchFeaturedProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products/category/${category}`);
    const data = await response.json();
    console.log(`Fetched products for category ${category}:`, data);
    return data as Product[];
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
};

// Fetch All available Categories

export const fetchAllCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    const data = await response.json();
    return data as string[];
  } catch (error) {
    console.error("Error Fetching Categories", error);
    return [];
  }
};

export const searchPorducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${BASE_URL}/Products`);
    const data = (await response.json()) as Product[];

    if (!query.trim()) {
      return [];
    }

    const lowerCaseQuery = query.toLowerCase().trim();

    return data.filter(
      (product) =>
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLocaleLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery),
    );
  } catch (error) {
    console.error("Error searching Products", error);
    return [];
  }
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`{BASE_URL}/products/${id}`);
    const data = await response.json();
    return data as Product;
  } catch (error) {
    console.error(`Error fetching product with ${id}:`, error);
    return null;
  }
};
