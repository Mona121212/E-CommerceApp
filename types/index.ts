import { type ReactNode } from "react";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface CartIconProps {
  color?: string;
  size?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: () => number;
}

export interface CartProviderProps {
  children: ReactNode;
}

export interface CategoryPillProps {
  categories: string[];
  onSelectCategory: (category: string) => void;
  selectedCategory?: string | null;
}

export interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  initialValue?: string;
}
export interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  style?: object;
}

export interface ProductCarouselProps {
  products: Product[];
  title?: string;
  style?: object;
}

export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}