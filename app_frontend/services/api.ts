import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const TOKEN_KEY = 'auth-token-key';
export const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//Add auth token to api requests
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
            
            config.headers.Authorization = `Bearer ${JSON.parse(token).access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;