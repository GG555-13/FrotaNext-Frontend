import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8001';

export const api = axios.create({
  baseURL: API_URL,
});

export const authApi = axios.create({
  baseURL: AUTH_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('frota_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});