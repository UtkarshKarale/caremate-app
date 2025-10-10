import { users, doctors, appointments, prescriptions, reports } from './data';
import { User, Prescription, Report, Appointment } from './schema';

export const login = async (email: string, password: string): Promise<{ token: string, role: string, user: User }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.email === email
      );
      if (user) {
        // In a real app, you'd also check the password.
        // Here, we'll just use the user ID as a mock token.
        resolve({ token: user.id, role: user.role, user });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 500);
  });
};

export const getAppointments = async (userId: string) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userAppointments = appointments.filter(a => a.patientId === userId);
            resolve(userAppointments);
        }, 500);
    });
};

export const getDoctorAppointments = async (doctorId: string) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const doctorAppointments = appointments.filter(a => a.doctorId === doctorId);
            resolve(doctorAppointments);
        }, 500);
    });
};

export const getAllDoctors = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(doctors);
        }, 500);
    });
};

export const getUser = async (userId: string) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = users.find(u => u.id === userId);
            resolve(user);
        }, 500);
    });
};

export const getPrescriptionsForPatient = async (patientId: string): Promise<Prescription[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patientPrescriptions = prescriptions.filter(p => p.patientId === patientId);
      resolve(patientPrescriptions);
    }, 500);
  });
};

export const getReportsForPatient = async (patientId: string): Promise<Report[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patientReports = reports.filter(r => r.patientId === patientId);
      resolve(patientReports);
    }, 500);
  });
};

export const addPrescription = async (prescription: Prescription): Promise<Prescription> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      prescriptions.push(prescription);
      resolve(prescription);
    }, 500);
  });
};

export const addReport = async (report: Report): Promise<Report> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      reports.push(report);
      resolve(report);
    }, 500);
  });
};

export const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']): Promise<Appointment> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
      if (appointmentIndex > -1) {
        appointments[appointmentIndex].status = status;
        resolve(appointments[appointmentIndex]);
      } else {
        reject(new Error('Appointment not found'));
      }
    }, 500);
  });
};