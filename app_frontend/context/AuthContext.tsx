import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import api, { TOKEN_KEY } from '@/services/api';
import { User } from "@/types/models";
import { router } from "expo-router";
import { jwtDecode } from 'jwt-decode';

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


export const AuthProvider = ({ children }: { children: React.ReactNode } ) => {
    const [isLoading, setIsLoading] = useState(false);
    const [authState, setauthState] = useState<{
        token: authToken | null; 
        authenticated: boolean;
    }>({
            token: null,
            authenticated: false
    });

    const refreshToken = async (token: authToken) => {
        try {
            const response = await api.post('/token/refresh/', {
                refresh: token.refresh
            });            
            return {
                refresh: token.refresh,
                access: response.data.access
            };
        } catch (error) {
            console.error('Token refresh error:', error);
            return null;
        }
    }

    const isTokenExpired = (token: authToken) => {
        try {
            const decoded = jwtDecode(token.access);
            if (decoded.exp){
                return (decoded.exp * 1000 < Date.now());
            }
        } catch {
            return true;
        }
    }

    useEffect(() => {
        const loadToken = async () => {
            setIsLoading(true);
            const token_string = await SecureStore.getItemAsync(TOKEN_KEY);
            if(token_string) {
                const token = JSON.parse(token_string);
                console.log('loading token: ', token);
                if (!isTokenExpired(token)) {
                    console.log('token not expired');
                    // Token not expired, login
                    setauthState({
                        token: token,
                        authenticated: true
                    });
                } else {
                    console.log('token expired');
                    // Try to get a refresh token
                    const newToken = await refreshToken(token);
                    if (newToken) {
                        console.log('token refresh successful');
                        // Refresh successful: set request header, and login
                        api.interceptors.request.use(async (config) => {
                            config.headers.set('Authorization', `Bearer ${newToken.access}`);
                            console.log('api header set to: ', newToken.access);
                            return config;
                        });
                        setauthState({
                            token: newToken,
                            authenticated: true
                        });
                    } else {
                        console.log('token refresh failed');
                        // Refresh failed, clear storage, state, and request header.
                        await SecureStore.deleteItemAsync(TOKEN_KEY);
                        api.interceptors.request.use(async (config) => {
                            config.headers.delete('Authorization');
                            return config;
                        });
                        setauthState({
                            token: null,
                            authenticated: false
                        });
                        router.replace('/login')
                    }
                }
            }
            setIsLoading(false);
        }
        loadToken();
    },[]); 

    const login = async (user: authUser) => {
        try {
            console.log('login request')
            setIsLoading(true);
            const response = await api.post('/token/', {
                ...(user.username ? { username: user.username } : { email: user.email }),
                password: user.password,
            });
            const token = response.data;
            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(token));
            api.interceptors.request.use(async (config) => {
                config.headers.set('Authorization', `Bearer ${token.access}`);
                return config;
            });
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
            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(token));
            api.interceptors.request.use(async (config) => {
                config.headers.set('Authorization', `Bearer ${token.access}`);
                return config;
            });
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