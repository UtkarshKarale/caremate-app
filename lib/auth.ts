import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User } from './schema';

const USER_KEY = 'user';

export const saveUser = async (user: User) => {
  try {
    const userString = JSON.stringify(user);
    if (Platform.OS === 'web') {
      localStorage.setItem(USER_KEY, userString);
    } else {
      await SecureStore.setItemAsync(USER_KEY, userString);
    }
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    let userString: string | null = null;
    if (Platform.OS === 'web') {
      userString = localStorage.getItem(USER_KEY);
    } else {
      userString = await SecureStore.getItemAsync(USER_KEY);
    }
    if (userString) {
      return JSON.parse(userString) as User;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const deleteUser = async () => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(USER_KEY);
    } else {
      await SecureStore.deleteItemAsync(USER_KEY);
    }
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};