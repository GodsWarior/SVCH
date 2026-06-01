export const loadJson = <T>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
};

export const saveJson = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const clearAppStorage = () => {
  ['fresh_filters', 'fresh_cart', 'fresh_favorites', 'fresh_theme_mode', 'fresh_language'].forEach((key) => localStorage.removeItem(key));
  Object.keys(localStorage)
    .filter((key) => key.startsWith('fresh_favorites_'))
    .forEach((key) => localStorage.removeItem(key));
};
