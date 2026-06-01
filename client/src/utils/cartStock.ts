import { CartItem, Product } from '../types';

export const getCartQuantity = (items: CartItem[], productId: number) => (
  items.find((item) => item.product.id === productId)?.quantity ?? 0
);

export const canAddToCart = (product: Product, cartQuantity: number) => (
  product.stock > 0 && cartQuantity < product.stock
);

export const hasCartStockIssues = (items: CartItem[]) => (
  items.some((item) => item.product.stock <= 0 || item.quantity > item.product.stock)
);

export const isCartItemUnavailable = (item: CartItem) => item.product.stock <= 0;

export const isCartItemOverStock = (item: CartItem) => (
  item.product.stock > 0 && item.quantity > item.product.stock
);
