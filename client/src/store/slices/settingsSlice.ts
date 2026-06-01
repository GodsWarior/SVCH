import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadJson, saveJson } from '../../utils/storage';

type ThemeMode = 'light' | 'dark';
type Language = 'ru' | 'en';

export const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    themeMode: loadJson<ThemeMode>('fresh_theme_mode', 'light'),
    language: loadJson<Language>('fresh_language', 'ru'),
  },
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      saveJson('fresh_theme_mode', action.payload);
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      saveJson('fresh_language', action.payload);
    },
  },
});
