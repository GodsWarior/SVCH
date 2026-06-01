import { http } from './http';

export const favoriteApi = {
  getAll: () => http.get('/favorites').then((response) => response.data),
  add: (productId: number) => http.post(`/favorites/${productId}`).then((response) => response.data),
  remove: (productId: number) => http.delete(`/favorites/${productId}`),
};
