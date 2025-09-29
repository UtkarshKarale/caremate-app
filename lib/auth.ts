
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'jwt_token';
const ROLE_KEY = 'user_role';

export const saveToken = async (token, role) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(ROLE_KEY, role);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(ROLE_KEY, role);
    }
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const getToken = async () => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const getRole = async () => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(ROLE_KEY);
    } else {
      return await SecureStore.getItemAsync(ROLE_KEY);
    }
  } catch (error) {
    console.error('Error getting role:', error);
    return null;
  }
};

export const deleteToken = async () => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ROLE_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(ROLE_KEY);
    }
  } catch (error) {
    console.error('Error deleting token:', error);
  }
};
