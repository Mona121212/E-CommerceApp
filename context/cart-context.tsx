import {
  CartIconProps,
  CartContextType,
  CartItem,
  CartProviderProps,
  Product,
} from "@/types";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/config/firebase";

// Create the Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the Provider component

export const CartProvider = ({ children, userId }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from Firestore if user is logged in, otherwise from AsyncStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (userId) {
          // Load from Firestore for logged-in users
          const cartRef = doc(db, "carts", userId);
          const cartSnap = await getDoc(cartRef);
          
          if (cartSnap.exists()) {
            const cartData = cartSnap.data();
            setItems(cartData.items || []);
          } else {
            // If no cart exists in Firestore, try to migrate from AsyncStorage
            const savedCart = await AsyncStorage.getItem("cart");
            if (savedCart) {
              const parsedCart = JSON.parse(savedCart);
              setItems(parsedCart);
              // Save to Firestore
              await setDoc(cartRef, { items: parsedCart });
              // Clear AsyncStorage after migration
              await AsyncStorage.removeItem("cart");
            }
          }
        } else {
          // Load from AsyncStorage for guest users
          const savedCart = await AsyncStorage.getItem("cart");
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
        // Fallback to AsyncStorage on error
        try {
          const savedCart = await AsyncStorage.getItem("cart");
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        } catch (fallbackError) {
          console.error("Error loading cart from storage", fallbackError);
        }
      }
    };
    loadCart();
  }, [userId]);

  // Sync cart to Firestore (for logged-in users) or AsyncStorage (for guests)
  useEffect(() => {
    const saveCart = async () => {
      try {
        if (userId) {
          // Save to Firestore for logged-in users
          const cartRef = doc(db, "carts", userId);
          await setDoc(cartRef, { items }, { merge: true });
        } else {
          // Save to AsyncStorage for guest users
          await AsyncStorage.setItem("cart", JSON.stringify(items));
        }
      } catch (error) {
        console.error("Error saving cart:", error);
        // Fallback to AsyncStorage on error
        try {
          await AsyncStorage.setItem("cart", JSON.stringify(items));
        } catch (fallbackError) {
          console.error("Error saving cart to storage", fallbackError);
        }
      }
    };
    
    // Only save if items have been loaded (avoid saving empty cart on initial load)
    if (items.length > 0 || userId) {
      saveCart();
    }
  }, [items, userId]);

  // Add product to cart
  const addItem = (product: Product, quantity: number) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        // Add new item if it doesn't exist
        return [...prevItems, { product, quantity }];
      }
    });
  };

  // Remove product from cart
  const removeItem = (porductId: number) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== porductId),
    );
  };

  // Function to update the quantity of a specific item in the cart
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  // function to clear the cart
  const clearCart = () => {
    setItems([]);
  };

  // Function to explicitly save cart (useful before sign out)
  const saveCart = async () => {
    try {
      if (userId) {
        // Save to Firestore for logged-in users
        const cartRef = doc(db, "carts", userId);
        await setDoc(cartRef, { items }, { merge: true });
      } else {
        // Save to AsyncStorage for guest users
        await AsyncStorage.setItem("cart", JSON.stringify(items));
      }
    } catch (error) {
      console.error("Error saving cart:", error);
      // Fallback to AsyncStorage on error
      try {
        await AsyncStorage.setItem("cart", JSON.stringify(items));
      } catch (fallbackError) {
        console.error("Error saving cart to storage", fallbackError);
      }
    }
  };

  // Function to get the total number of items in the cart
  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  // Function to get the total price of items in the cart
  const getTotal = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotal,
        saveCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart Context

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
