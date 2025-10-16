
import axios from 'axios';
import { getToken } from './auth';

const API_URL = 'http://192.168.0.106:8888/api'; // Replace with your actual backend URL

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(`/user/login`, { email, password });
      return { role: response.data.role, token: response.data.token };
  } catch (error) {
    // @ts-ignore
      console.error('Login error login function:', error.response?.data || error.message);
    throw error;
  }
};

export const register = async (userData: any) => {
  try {
    let url = '/user/register';
    if(userData.role === 'DOCTOR'){
      url = '/doctor/register';
    }
    const response = await api.post(url, userData);
    return response.data;
  } catch (error) {
    // @ts-ignore
      console.error('Signup error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/user/${id}/update/allfields`, userData);
    return response.data;
  } catch (error) {
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

export const getAllUsers = async () => {
  try {
    const response = await api.get(`/user/lookup/all`);
    return response.data;
  } catch (error) {
    console.error('Get all users error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllActiveUsers = async () => {
  try {
    const response = await api.get(`/user/lookup/all/active`);
    return response.data;
  } catch (error) {
    console.error('Get all active users error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllDoctors = async () => {
    try {
        const response = await api.get(`/doctor/lookup/all`);
        return response.data;
    } catch (error) {
        console.error('Get all doctors error:', error.response?.data || error.message);
        throw error;
    }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.put(`/user/forgot-password`, null, { params: { email } });
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAppointmentsByPatient = async (patientId: string) => {
  try {
    const response = await api.get(`/appointments/patient/${patientId}`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get appointments by patient error:', error.response?.data || error.message);
    throw error;
  }
};

export const resetPassword = async (data) => {
  try {
    const response = await api.put(`/user/reset-password`, data);
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error.response?.data || error.message);
    throw error;
  }
};
