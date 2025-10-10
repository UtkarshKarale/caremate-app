export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  instructions: string;
  datePrescribed: string;
}

export interface Report {
  id: string;
  patientId: string;
  doctorId: string;
  type: string; // e.g., 'Blood Test', 'X-Ray', 'Diagnosis'
  details: string;
  dateGenerated: string;
  fileUrl?: string; // Optional URL to a file if applicable
}