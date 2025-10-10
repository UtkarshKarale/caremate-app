import { User, Appointment, Doctor, Prescription, Report } from './schema';

export const users: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'patient',
    avatar: 'https://i.pravatar.cc/150?u=patient1',
  },
  {
    id: '2',
    name: 'Dr. Jane Smith',
    email: 'jane.smith@example.com',
    role: 'doctor',
    avatar: 'https://i.pravatar.cc/150?u=doctor1',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin1',
  },
    {
    id: '4',
    name: 'Dr. Peter Jones',
    email: 'peter.jones@example.com',
    role: 'doctor',
    avatar: 'https://i.pravatar.cc/150?u=doctor2',
  },
];

export const doctors: Doctor[] = [
  {
    id: '2',
    name: 'Dr. Jane Smith',
    specialty: 'Cardiologist',
    avatar: 'https://i.pravatar.cc/150?u=doctor1',
  },
  {
    id: '4',
    name: 'Dr. Peter Jones',
    specialty: 'Neurologist',
     avatar: 'https://i.pravatar.cc/150?u=doctor2',
  },
];

export const appointments: Appointment[] = [
  {
    id: '101',
    patientId: '1',
    doctorId: '2',
    date: '2025-10-20',
    time: '10:00 AM',
    reason: 'Regular check-up',
    status: 'scheduled',
  },
  {
    id: '102',
    patientId: '1',
    doctorId: '4',
    date: '2025-10-22',
    time: '02:30 PM',
    reason: 'Headache',
    status: 'scheduled',
  },
  {
    id: '103',
    patientId: '1',
    doctorId: '2',
    date: '2025-09-15',
    time: '11:00 AM',
    reason: 'Follow-up',
    status: 'completed',
  },
];

export const prescriptions: Prescription[] = [
  {
    id: 'P001',
    patientId: '1',
    doctorId: '2',
    medication: 'Amoxicillin',
    dosage: '250mg, twice a day',
    instructions: 'Take with food for 7 days.',
    datePrescribed: '2025-10-18',
  },
  {
    id: 'P002',
    patientId: '1',
    doctorId: '4',
    medication: 'Ibuprofen',
    dosage: '200mg, as needed',
    instructions: 'Do not exceed 3 doses in 24 hours.',
    datePrescribed: '2025-10-21',
  },
];

export const reports: Report[] = [
  {
    id: 'R001',
    patientId: '1',
    doctorId: '2',
    type: 'Blood Test',
    details: 'Cholesterol levels are slightly elevated. Further monitoring recommended.',
    dateGenerated: '2025-10-19',
    fileUrl: 'https://example.com/bloodtest_john_doe.pdf',
  },
  {
    id: 'R002',
    patientId: '1',
    doctorId: '4',
    type: 'MRI Scan',
    details: 'MRI of the brain shows no abnormalities.',
    dateGenerated: '2025-10-23',
    fileUrl: 'https://example.com/mri_john_doe.pdf',
  },
];