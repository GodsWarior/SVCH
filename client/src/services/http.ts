import axios from 'axios';

const apiUrl = typeof process !== 'undefined'
  ? process.env.REACT_APP_API_URL
  : undefined;

export const http = axios.create({
  baseURL: apiUrl || 'http://localhost:5000/api',
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('fresh_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
