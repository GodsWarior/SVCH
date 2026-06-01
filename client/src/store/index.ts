import { configureStore } from '@reduxjs/toolkit';
import { authSlice, cartSlice, catalogSlice, settingsSlice } from './slices';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    catalog: catalogSlice.reducer,
    cart: cartSlice.reducer,
    settings: settingsSlice.reducer,
  },
});

export const authActions = authSlice.actions;
export const catalogActions = catalogSlice.actions;
export const cartActions = cartSlice.actions;
export const settingsActions = settingsSlice.actions;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
