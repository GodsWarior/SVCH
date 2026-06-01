import { http } from './http';

export const authApi = {
  register: (payload: { name: string; email: string; password: string; phone?: string }) =>
    http.post('/auth/register', payload).then((response) => response.data),
  login: (payload: { email: string; password: string }) =>
    http.post('/auth/login', payload).then((response) => response.data),
  me: () => http.get('/auth/me').then((response) => response.data),
  updateMe: (payload: { name: string; email: string; phone?: string }) =>
    http.put('/auth/me', payload).then((response) => response.data),
};
