import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Détermine dynamiquement l'URL de l'API :
// - Sur le web (navigateur) on utilise l'hôte courant (localhost ou IP de la machine).
// - Sur un émulateur Android classique, on garde 10.0.2.2 qui mappe vers l'hôte.
let API_URL = 'http://10.0.2.2:8000/api/';
if (typeof window !== 'undefined' && window.location) {
  const host = window.location.hostname || 'localhost';
  API_URL = `http://${host}:8000/api/`;
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pour injecter automatiquement le token JWT stocké dans AsyncStorage
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token && config && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // silently ignore
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;