import { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import api, { TOKEN_KEY } from '@/services/api';
import { User } from "@/types/models";

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
    authState?: { token: authToken | null; authenticated: boolean | null; }
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
    } catch (error) {
        console.log("Error refreshing token.")
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode } ) => {
    const [authState, setauthState] = useState<{
        token: authToken | null; 
        authenticated: boolean | null;
    }>({
            token: null,
            authenticated: false
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await refreshToken();
            if(token) {
                api.defaults.headers.common['Authorization'] = `Bearer ${token.access}`;
                setauthState({
                    token: token,
                    authenticated: true
                });
            }
        }
        loadToken();
    },[]); 

    const login = async (user: authUser) => {
        try {
            const response = await api.post('/token/', {
                ...(user.username ? { username: user.username } : { email: user.email }),
                password: user.password,
            });
            const token = response.data;
            api.defaults.headers.common['Authorization'] = `Bearer ${token.access}`;
            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(token));
            setauthState({
                token: token,
                authenticated: true
            });
            return response.data;
        } catch (error) {
            
        }
    }
    
    const register = async (user: User) => {
        try {
            const token = (await api.post('/registration/', user)).data;
            api.defaults.headers.common['Authorization'] = `Bearer ${token.access}`;
            await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(token));
            setauthState({
                token: token,
                authenticated: true
            });
            return token;
        } catch (error) {
          
        }
    }
    
    const logout = async () => {
        try {
            delete api.defaults.headers.common['Authorization'];
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            setauthState({
                token: null,
                authenticated: false
            })

        } catch(error) {

        }
    }

    const value = {
        authState: authState,
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