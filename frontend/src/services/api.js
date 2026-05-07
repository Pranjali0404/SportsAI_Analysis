import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  signup: async (username, email, password) => {
    const response = await api.post('/auth/signup', { username, email, password });
    return response.data;
  },
  resetPassword: async (email, newPassword) => {
    const response = await api.post('/auth/reset-password', { email, new_password: newPassword });
    return response.data;
  },
};

export const analysisService = {
  analyze: async (userId, query) => {
    const response = await api.post('/analyze', { user_id: userId, query });
    return response.data;
  },
  getHistory: async (userId) => {
    const response = await api.get(`/history/${userId}`);
    return response.data;
  },
};

export const playerService = {
  generatePlayerContent: async (playerName, userId = null) => {
    const response = await api.post('/player/generate', {
      player_name: playerName,
      user_id: userId,
    });
    return response.data;
  },
};

export default api;
