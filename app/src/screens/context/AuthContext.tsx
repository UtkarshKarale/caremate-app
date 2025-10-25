import React, { createContext, useState, useContext, useEffect } from 'react';
import { deleteToken, getToken, saveToken } from '@/lib/auth';
import api, { login as apiLogin } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'patient' | 'doctor' | 'receptionist' | 'admin';
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            if (token) {
                const decodedToken: { exp: number, userId: string, role: string } = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) {
                    await logout();
                } else {
                    const userResponse = await api.get(`/user/${decodedToken.userId}/lookup`);
                    // The role from the token is a string, need to cast it to the User['role'] type
                    const role = decodedToken.role.replace(/[\[\]]/g, '') as User['role'];
                    setUser({ ...userResponse.data, role });
                }
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            await logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await apiLogin(email, password);
            const { token } = response;
            await saveToken(token, response.role);

            const decodedToken: { exp: number, userId: string, role: string } = jwtDecode(token);
            const userResponse = await api.get(`/user/${decodedToken.userId}/lookup`);
            const role = decodedToken.role.replace(/[\[\]]/g, '') as User['role'];
            setUser({ ...userResponse.data, role });

        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await deleteToken();
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};