import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const TOKEN_KEY = 'auth-token-key';
export const API_URL = 'http://10.0.0.224:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//Add auth token to api requests
api.interceptors.request.use(
    async (config) => {
        const tokens = await SecureStore.getItemAsync(TOKEN_KEY);
        if (tokens) {
            config.headers.set('Authorization', `Bearer ${JSON.parse(tokens).access}`);
            console.log('Request headers:', config.headers);
        } else {
            console.log('No token found in storage');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
export default api;