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
      const product = action.payload;
      if (product.stock <= 0) return;

      const existing = state.items.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return;
        existing.quantity += 1;
        existing.product = product;
      } else {
        state.items.push({ product, quantity: 1 });
      }
      saveJson('fresh_cart', state.items);
    },
    changeQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      state.items = state.items
        .map((item) => {
          if (item.product.id !== action.payload.productId) return item;
          if (action.payload.quantity <= 0) return null;
          return {
            ...item,
            quantity: Math.min(action.payload.quantity, item.product.stock),
          };
        })
        .filter((item): item is CartItem => item !== null);
      saveJson('fresh_cart', state.items);
    },
    syncCartStock: (state, action: PayloadAction<Product[]>) => {
      const stockMap = new Map(action.payload.map((product) => [product.id, product]));
      state.items = state.items
        .map((item) => {
          const fresh = stockMap.get(item.product.id);
          if (!fresh || fresh.stock <= 0) return null;
          return {
            product: fresh,
            quantity: Math.min(item.quantity, fresh.stock),
          };
        })
        .filter((item): item is CartItem => item !== null);
      saveJson('fresh_cart', state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveJson('fresh_cart', []);
    },
  },
});
