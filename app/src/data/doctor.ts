export const doctors = [
    {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        rating: 4.8,
        experience: 12,
        hospital: 'City General Hospital',
        image: 'https://images.unsplash.com/photo-1559839734-2b716b17f7d1?w=400',
        availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
    },
    {
        id: '2',
        name: 'Dr. Michael Chen',
        specialty: 'Neurology',
        rating: 4.9,
        experience: 15,
        hospital: 'Neuro Care Center',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
        availableSlots: ['09:30 AM', '11:00 AM', '01:00 PM', '02:30 PM', '04:00 PM']
    },
    {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        specialty: 'Pediatrics',
        rating: 4.7,
        experience: 8,
        hospital: 'Children Medical Center',
        image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
        availableSlots: ['08:00 AM', '09:00 AM', '10:30 AM', '01:00 PM', '03:00 PM']
    },
    {
        id: '4',
        name: 'Dr. James Wilson',
        specialty: 'Orthopedics',
        rating: 4.6,
        experience: 10,
        hospital: 'Orthopedic Clinic',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
        availableSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM']
    },
];

export const upcomingAppointments = [
    { id: '1', doctor: 'Dr. Sarah Miller', specialty: 'Cardiology', time: 'Today, 3:30 PM', status: 'Confirmed' },
    { id: '2', doctor: 'Dr. Michael Chen', specialty: 'Dermatology', time: 'Tomorrow, 10:00 AM', status: 'Scheduled' },
];

export const medicalHistory = [
    { condition: 'Asthma', diagnosed: '2010', status: 'Managed' },
    { condition: 'Hypertension', diagnosed: '2018', status: 'Controlled' },
    { condition: 'Allergic Rhinitis', diagnosed: '2005', status: 'Seasonal' },
];

export const dates = [
    { id: '1', day: 'Mon', date: '13', month: 'Oct' },
    { id: '2', day: 'Tue', date: '14', month: 'Oct' },
    { id: '3', day: 'Wed', date: '15', month: 'Oct' },
    { id: '4', day: 'Thu', date: '16', month: 'Oct' },
    { id: '5', day: 'Fri', date: '17', month: 'Oct' },
    { id: '6', day: 'Sat', date: '18', month: 'Oct' },
];
export const specialties = ['All Specialties', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics'];