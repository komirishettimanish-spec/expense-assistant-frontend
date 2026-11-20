import axios from 'axios';

export const TOKEN_KEY = 'ea_token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://expense-assistant-backend-q0tm.onrender.com/api',
  timeout: 60000,
});

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register');
    if (error.response?.status === 401 && !isAuthCall && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

export default api;
