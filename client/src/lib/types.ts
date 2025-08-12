export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  fileFormat?: string;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular';
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  thumbnailUrl?: string;
  quantity: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
