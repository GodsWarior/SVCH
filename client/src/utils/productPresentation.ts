import { Category, Product } from '../types';
import { Language } from './i18n';

export const defaultProductImage = 'http://localhost:5000/uploads/products/default-product.svg';

const productFallbackEn: Record<string, { name: string; description?: string }> = {
  'Томаты свежие': { name: 'Fresh Tomatoes', description: 'High-quality product with fast home delivery.' },
  'Огурцы хрустящие': { name: 'Crispy Cucumbers', description: 'High-quality product with fast home delivery.' },
  'Яблоки сезонные': { name: 'Seasonal Apples', description: 'High-quality product with fast home delivery.' },
  Бананы: { name: 'Bananas', description: 'High-quality product with fast home delivery.' },
  'Молоко 3.2%': { name: 'Milk 3.2%', description: 'High-quality product with fast home delivery.' },
  'Творог фермерский': { name: 'Farm Cottage Cheese', description: 'High-quality product with fast home delivery.' },
};

const categoryFallbackEn: Record<string, string> = {
  Овощи: 'Vegetables',
  Фрукты: 'Fruits',
  'Молочные продукты': 'Dairy',
  Хлеб: 'Bread',
  Напитки: 'Drinks',
  Мясо: 'Meat',
};

export const price = (value: string | number) => `${Number(value).toFixed(2)} BYN`;

export const weightFallbackEn = (weight?: string) => weight
  ?.replace('кг', 'kg')
  .replace('г', 'g')
  .replace('л', 'l');

export const getProductName = (product: Product, language: Language) => (
  language === 'en' ? product.nameEn || productFallbackEn[product.name]?.name || product.name : product.name
);

export const getProductDescription = (product: Product, language: Language) => (
  language === 'en'
    ? product.descriptionEn || productFallbackEn[product.name]?.description || product.description
    : product.description
);

export const getCategoryName = (category: Category | undefined, language: Language) => {
  if (!category) return '';
  return language === 'en' ? categoryFallbackEn[category.name] || category.name : category.name;
};

export const getFallbackProductNameEn = (productName: string) => productFallbackEn[productName]?.name || '';

export const getFallbackProductDescriptionEn = (productName: string) => productFallbackEn[productName]?.description || '';
