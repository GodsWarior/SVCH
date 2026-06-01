import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';
import { loadJson, saveJson } from '../../utils/storage';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: loadJson<User | null>('fresh_user', null),
    token: localStorage.getItem('fresh_token'),
  },
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('fresh_token', action.payload.token);
      saveJson('fresh_user', action.payload.user);
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      saveJson('fresh_user', action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('fresh_token');
      localStorage.removeItem('fresh_user');
    },
  },
});
