import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductFilters } from '../../types';
import { loadJson, saveJson } from '../../utils/storage';

const defaultFilters: ProductFilters = {
  search: '',
  categoryId: '',
  minPrice: '',
  maxPrice: '',
  sort: 'name',
};

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    products: [] as Product[],
    filters: loadJson<ProductFilters>('fresh_filters', defaultFilters),
    favorites: [] as number[],
  },
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      saveJson('fresh_filters', state.filters);
    },
    resetFilters: (state) => {
      state.filters = defaultFilters;
      saveJson('fresh_filters', defaultFilters);
    },
    setFavorites: (state, action: PayloadAction<number[]>) => {
      state.favorites = action.payload;
    },
    toggleFavoriteLocal: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.favorites = state.favorites.includes(productId)
        ? state.favorites.filter((id) => id !== productId)
        : [...state.favorites, productId];
    },
    clearFavoritesLocal: (state) => {
      state.favorites = [];
    },
  },
});
