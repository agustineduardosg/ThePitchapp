import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://aplicaciones-pudu-thepitcher-app.yyjq3p.easypanel.host/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para inyectar el token en cada petición privada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pitch_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales (ej: token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si el 401 (No autorizado) no viene de la ruta de login, forzamos cierre de sesión
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('pitch_token');
        localStorage.removeItem('pitch_user');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
