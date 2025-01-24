import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import api, { TOKEN_KEY } from '@/services/api';
import { User } from "@/types/models";
import { router, Stack } from "expo-router";

const AuthContext = createContext<authProps>({});

interface authUser {
    email?: String;
    username?: String;
    password: String;
}

interface authToken {
    refresh: string;
    access: string;
}
interface authProps {
    authState?: { token: authToken | null; authenticated: boolean | null; },
    isLoading?: boolean,
    onRegister?: (user: User) => Promise<any>;
    onLogin?: (user: authUser) => Promise<any>;
    onLogout?: () => Promise<any>;
}

export const useAuth = () => {
    return useContext(AuthContext);
}

export const refreshToken = async () => {
    try {
        const oldToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (oldToken) {
            const response = await api.post('/token/refresh/',{
                refresh: JSON.parse(oldToken).refresh
            });
            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(response.data));
            return response.data;
        } else {
            throw new Error('No oldToken in Storage.');
        }
    } catch (error: any) {
        console.log(error.message)
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode } ) => {
    const [isLoading, setIsLoading] = useState(false);
    const [authState, setauthState] = useState<{
        token: authToken | null; 
        authenticated: boolean;
    }>({
            token: null,
            authenticated: false
    });

    useEffect(() => {
        const loadToken = async () => {
            setIsLoading(true);
            const token = await refreshToken();
            if(token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token.access}`;
                setauthState({
                    token: token,
                    authenticated: true
                });
            }
            setIsLoading(false);
        }
        loadToken();
    },[]); 

    const login = async (user: authUser) => {
        try {
            setIsLoading(true);
            const response = await api.post('/token/', {
                ...(user.username ? { username: user.username } : { email: user.email }),
                password: user.password,
            });
            const token = response.data;
            api.defaults.headers.common['Authorization'] = `Bearer ${token.access}`;
            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(token));
            setauthState({
                token: {
                    refresh: token.refresh,
                    access: token.access
                },
                authenticated: true
            });
            setIsLoading(false);
            router.replace('/')
            return {error: false};
        } catch (error: any) {
            console.error('Login error:', error);
            return {
                error: true,
                msg: error.response?.data?.detail || 'Login failed'
            };
        }
    }
    useEffect(() => {
        console.log('AuthState changed:', authState);
    }, [authState]);

    const register = async (user: User) => {
        try {
            setIsLoading(true);
            const token = (await api.post('/registration/', user)).data;
            api.defaults.headers.common['Authorization'] = `Bearer ${token.access}`;
            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(token));
            setauthState({
                token: token,
                authenticated: true
            });
            setIsLoading(false);
            return token;
        } catch (error : any) {
            return {
                error: true,
                msg: error.response?.data?.detail || 'Account creation failed'
            };
        }
    }
    
    const logout = async () => {
        try {
            delete api.defaults.headers.common['Authorization'];
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            setauthState({
                token: null,
                authenticated: false
            });
        } catch(error) {

        }
    }

    const value = {
        authState,
        isLoading,
        onRegister: register,
        onLogin: login,
        onLogout: logout
    }
    return (
        <AuthContext.Provider value={value as authProps}>
            {children} 
        </AuthContext.Provider>
    );
}