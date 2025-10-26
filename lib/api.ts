import axios from 'axios';
import { getToken, deleteToken } from './auth';

const API_URL = 'http://192.168.0.106:8888/api'; // Replace with your actual backend URL

const api = axios.create({

  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  await new Promise((res) => setTimeout(res, 100)); // short delay
  const token = await getToken();
  console.log('🧩 Token in interceptor:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      console.error("Unauthorized/Forbidden request detected by interceptor.");
      // Do NOT delete token here. AuthContext will handle logout.
      // You might want to navigate the user to the login screen here.
      // This depends on your navigation setup.
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(`/user/login`, { email, password });
    return response.data; // Should contain user, token, and role
  } catch (error) {
    // @ts-ignore
    console.error('Login error in api.ts:', error.response?.data || error.message);
    throw error;
  }
};


export const register = async (userData: any) => {
  try {
    const response = await api.post(`/user/register`, userData);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Registration error in api.ts:', error.response?.data || error.message);
    throw error;
  }
};

// You can keep the rest of your API functions here.
// For example:
export const getAllDoctors = async () => {
    try {
        const response = await api.get(`/user/lookup/all`);
        // The backend should ideally have a dedicated endpoint for doctors
        return response.data.filter(user => user.roles.includes('DOCTOR'));
    } catch (error) {
        // @ts-ignore
        console.error('Get all doctors error:', error.response?.data || error.message);
        throw error;
    }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get(`/user/lookup/all`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get all users error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (id: string, userData: any) => {
  try {
    const response = await api.put(`/user/${id}/update/allfields`, userData);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Update user error:', error.response?.data || error.message);
    throw error;
  }
};

export const findUserById = async (id: string | undefined) => {
  try {
    const response = await api.get(`/user/${id}/lookup`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Find user by id error:', error.response?.data || error.message);
    throw error;
  }
};

export const applyAppointment = async (appointmentData: any) => {
  try {
    const response = await api.post(`/appointments/apply`, appointmentData);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Apply appointment error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllAppointments = async () => {
  try {
    const response = await api.get(`/appointments/all`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get all appointments error:', error.response?.data || error.message);
    throw error;
  }
};


export const getUserAppointments = async (userId) => {
  const token = await getToken();
  console.log("📡 Sending request GET /appointments/user/" + userId);
  console.log("🔐 Token attached:", token ? token.slice(0, 25) + "..." : "missing");

  try {
    const response = await api.get(`/appointments/patient/${userId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Backend response data:", error.response?.data);
    console.error("❌ Backend status:", error.response?.status);
    throw error;
  }
};

export const getDoctorTodaysAppointments = async (doctorId: string) => {
  try {
    const response = await api.get(`/appointments/doctor/${doctorId}/today`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get doctor todays appointments error:', error.response?.data || error.message);
    throw error;
  }
};

export default api;