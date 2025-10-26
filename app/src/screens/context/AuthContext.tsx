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

    // 🧩 Checks and restores user session from saved token
    const checkLoginStatus = async () => {
        setIsLoading(true);
        try {
            const token = await getToken();
            if (token) {
                const decodedToken: { exp: number; userId: string; role: string } = jwtDecode(token);
                console.log('Decoded Token in checkLoginStatus:', decodedToken);

                // Expiration check
                if (decodedToken.exp * 1000 < Date.now()) {
                    console.log('Token expired, logging out.');
                    await logout();
                } else {
                    try {
                        const userResponse = await api.get(`/user/${decodedToken.userId}/lookup`);
                        console.log('User Response Data in checkLoginStatus:', userResponse.data);

                        const role = decodedToken.role.replace(/[\[\]]/g, '') as User['role'];

                        // ✅ Safely merge token + backend data
                        const finalUser: User = {
                            id: userResponse.data.id?.toString() ?? decodedToken.userId,
                            name:
                                userResponse.data.name ??
                                userResponse.data.fullName ??
                                'Unknown User',
                            email: userResponse.data.email ?? 'unknown@example.com',
                            role,
                        };

                        console.log('✅ Final User Object Set in Context:', finalUser);
                        setUser(finalUser);
                    } catch (lookupError: any) {
                        console.error('Error looking up user in checkLoginStatus:', lookupError);
                        if (lookupError.response?.status === 403) {
                            console.log('User lookup forbidden, setting user to null.');
                            setUser(null);
                        } else {
                            await logout();
                        }
                    }
                }
            } else {
                console.log('No token found, user set to null');
                setUser(null);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            await logout();
        } finally {
            setIsLoading(false);
        }
    };

    // 🧩 Handles login and saves token + user info
    const login = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await apiLogin(email, password);
            const { token, user: userData, role } = response;
            console.log(token, userData, role);
            console.log(response)
            await saveToken(token, role);

            const roleFormatted = role.replace(/[\[\]]/g, '') as User['role'];

            const finalUser: User = {
                id: userData?.id?.toString() ?? 'unknown',
                fullName: userData?.fullName ?? userData?.fullName ?? 'Unknown User',
                name: userData?.fullName ?? userData?.fullName ?? 'Unknown User',
                email: userData?.email ?? 'unknown@example.com',
                role: roleFormatted,
            };

            console.log('✅ User set on login:', finalUser);
            setUser(finalUser);
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login failed');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // 🧩 Clears token and resets user
    const logout = async () => {
        try {
            await deleteToken();
            setUser(null);
            console.log('User logged out and token deleted.');
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