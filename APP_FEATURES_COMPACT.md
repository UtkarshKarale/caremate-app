# Caremate App - Compact Feature Document

## Roles
- Patient
- Doctor
- Receptionist
- Admin

## Authentication
- Login and registration with JWT-based session handling.
- Role-based app routing after login.

## Patient Features
- Browse doctors and specialties.
- Book appointments with slot selection.
- View upcoming appointments.
- View prescriptions/medical records.
- Profile management.

## Doctor Features
- View today's appointments.
- View patient list and patient details.
- Add prescriptions for appointments.
- Profile screen.

## Receptionist Features
- Appointment/check-in workflows.
- Billing flow screens (generate, preview, accept payment, success).
- Pending payments and billing history views.

## Admin Features
- User management (view/search/filter/update role).
- Doctor visibility via user role filter.
- Hospital management (full CRUD):
  - Create hospital
  - List hospitals
  - Update hospital
  - Delete hospital
  - Assign/unassign doctors to hospital
- Billing & analytics (backend-driven):
  - Live summary cards
  - Recent bills
  - Pending bills
  - Collect due payments
  - Cancel bills
- Dashboard with backend-driven placeholders while data loads.

## Backend Modules Connected
- User APIs
- Appointment APIs
- Hospital APIs
- Bill APIs
- Prescription APIs

## Key API-backed Admin Operations
- Manage users and roles.
- Manage hospitals and doctor-hospital assignments.
- View operational metrics (appointments/users/hospitals).
- Manage billing operations (pending/paid/cancelled state transitions).

## Notes
- Data is now loaded from backend for admin dashboard/reports (no hardcoded admin activity or billing lists).
- Hospital-doctor linkage is persisted via backend relation.
