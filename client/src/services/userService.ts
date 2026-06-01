import { http } from './http';

export const userApi = {
  getAll: () => http.get('/users').then((response) => response.data),
  update: (id: number, payload: Partial<{ name: string; email: string; phone: string; role: string }>) =>
    http.put(`/users/${id}`, payload).then((response) => response.data),
};
