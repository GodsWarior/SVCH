export type RoleName = 'customer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: RoleName;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  price: string | number;
  imageUrl?: string;
  weight?: string;
  stock: number;
  isPopular: boolean;
  CategoryId: number;
  Category?: Category;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AddressPayload {
  city: string;
  street: string;
  house: string;
  flat?: string;
  comment?: string;
}

export interface Order {
  id: number;
  status: string;
  total: string | number;
  deliverySlot?: string;
  createdAt: string;
  OrderItems?: Array<{ id: number; quantity: number; price: string | number; Product: Product }>;
}

export interface ProductFilters {
  search: string;
  categoryId: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}
