import { Product, ProductFilters } from '../types';
import { http } from './http';

const query = (params: Partial<ProductFilters>) => {
  const entries = Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1]));
  return entries.length ? `?${new URLSearchParams(entries).toString()}` : '';
};

export const productApi = {
  getAll: (filters: ProductFilters) => http.get(`/products${query(filters)}`).then((response) => response.data),
  getOne: (id: string) => http.get(`/products/${id}`).then((response) => response.data),
  create: (payload: Partial<Product>) => http.post('/products', payload).then((response) => response.data),
  update: (id: number, payload: Partial<Product>) => http.put(`/products/${id}`, payload).then((response) => response.data),
  remove: (id: number) => http.delete(`/products/${id}`),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return http.post('/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((response) => response.data as { imageUrl: string });
  },
};
