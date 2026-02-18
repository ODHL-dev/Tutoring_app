import axios from 'axios';

// Utilise 10.0.2.2 pour l'émulateur Android, ou l'IP de ton PC pour un vrai tel
const API_URL = 'http://10.0.2.2:8000/api/'; 

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;