import axios from 'axios';
import { getToken } from './auth';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8888/api';

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

export const getHospitals = async () => {
  try {
    const response = await api.get(`/hospitals`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get hospitals error:', error.response?.data || error.message);
    throw error;
  }
};

export const createHospital = async (payload: any) => {
  try {
    const response = await api.post(`/hospitals`, payload);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Create hospital error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateHospital = async (hospitalId: number, payload: any) => {
  try {
    const response = await api.put(`/hospitals/${hospitalId}`, payload);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Update hospital error:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteHospital = async (hospitalId: number) => {
  try {
    const response = await api.delete(`/hospitals/${hospitalId}`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Delete hospital error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAvailableDoctors = async () => {
  try {
    const response = await api.get(`/hospitals/doctors/available`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get available doctors error:', error.response?.data || error.message);
    throw error;
  }
};

export const replaceHospitalDoctors = async (hospitalId: number, doctorIds: number[]) => {
  try {
    const response = await api.put(`/hospitals/${hospitalId}/doctors`, { doctorIds });
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Replace hospital doctors error:', error.response?.data || error.message);
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

export const getAppointmentById = async (id: string) => {
  try {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get appointment by id error:', error.response?.data || error.message);
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

export const getAppointmentsByDoctor = async (doctorId: string) => {
  try {
    const response = await api.get(`/appointments/doctor/${doctorId}`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get appointments by doctor error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAppointmentsByDate = async (date: string) => {
  try {
    const response = await api.get(`/appointments/date/${date}`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get appointments by date error:', error.response?.data || error.message);
    throw error;
  }
};

export const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
  // Keep frontend labels friendly while staying compatible with backend enums.
  const backendStatus = newStatus === 'CHECKED_IN' ? 'CHECK_IN' : newStatus;
  const payload: any = { status: backendStatus };
  if (backendStatus === 'COMPLETED') {
    payload.completedOn = new Date().toISOString();
  }

  const endpoints = [
    `/appointments/update/${appointmentId}`,
    `/appointments/${appointmentId}/status`,
  ];

  let lastError: any = null;
  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Updating appointment status via ${endpoint}`, payload);
      const response = await api.put(endpoint, payload);
      return response.data;
    } catch (error: any) {
      lastError = error;
      console.error(
        `Update appointment status failed on ${endpoint}:`,
        error?.response?.status,
        error?.response?.data || error?.message
      );
    }
  }

  throw lastError;
};

export const createBill = async (payload: any) => {
  try {
    const response = await api.post(`/bills`, payload);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Create bill error:', error.response?.data || error.message);
    throw error;
  }
};

export const createPrescription = async (prescriptionData: any) => {
  try {
    const response = await api.post(`/prescriptions/add`, prescriptionData);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Create prescription error:', error.response?.data || error.message);
    throw error;
  }
};

export const getAllBills = async () => {
  try {
    const response = await api.get(`/bills`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get all bills error:', error.response?.data || error.message);
    throw error;
  }
};

export const getPendingBills = async () => {
  try {
    const response = await api.get(`/bills/pending`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get pending bills error:', error.response?.data || error.message);
    throw error;
  }
};

export const getBillsByPatientId = async (patientId: string) => {
  try {
    const response = await api.get(`/bills/patient/${patientId}`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get bills by patient error:', error.response?.data || error.message);
    throw error;
  }
};

export const getPendingBillsByPatientId = async (patientId: string) => {
  try {
    const response = await api.get(`/bills/patient/${patientId}/pending`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get pending bills by patient error:', error.response?.data || error.message);
    throw error;
  }
};

export const makeBillPayment = async (billId: number, amount: number, paymentMethod: string, notes?: string) => {
  try {
    const response = await api.post(`/bills/${billId}/payment`, {
      amount,
      paymentMethod,
      notes: notes || null,
    });
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Make bill payment error:', error.response?.data || error.message);
    throw error;
  }
};

export const cancelBill = async (billId: number) => {
  try {
    const response = await api.put(`/bills/${billId}/cancel`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Cancel bill error:', error.response?.data || error.message);
    throw error;
  }
};

export const getPrescriptionsByPatientId = async (patientId: string) => {
  try {
    const response = await api.get(`/prescriptions/patient/${patientId}`);
    return response.data;
  } catch (error) {
    // @ts-ignore
    console.error('Get prescriptions by patient id error:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
