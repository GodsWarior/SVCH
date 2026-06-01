import { http } from './http';

export const categoryApi = {
  getAll: () => http.get('/categories').then((response) => response.data),
  create: (payload: { name: string; description?: string }) => http.post('/categories', payload).then((response) => response.data),
};
