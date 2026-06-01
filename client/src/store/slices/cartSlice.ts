import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, Product } from '../../types';
import { loadJson, saveJson } from '../../utils/storage';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadJson<CartItem[]>('fresh_cart', []),
  },
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find((item) => item.product.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      saveJson('fresh_cart', state.items);
    },
    changeQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      state.items = state.items
        .map((item) => item.product.id === action.payload.productId ? { ...item, quantity: action.payload.quantity } : item)
        .filter((item) => item.quantity > 0);
      saveJson('fresh_cart', state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveJson('fresh_cart', []);
    },
  },
});
