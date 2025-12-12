export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export interface Appointment {
  id: number;
  patientId: string;
  patientUserId: number;
  doctorId: number;
  doctorUserId: number;
  specialty: string;
  appointmentDate: Date;
  duration: number;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface AppointmentCreate {
  doctorId: number;
  specialty: string;
  appointmentDate: string;
  duration?: number;
  reason?: string;
}

export interface AppointmentResponse {
  id: number;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: number;
  doctorName: string;
  doctorEmail: string;
  specialty: string;
  appointmentDate: Date;
  duration: number;
  status: AppointmentStatus;
  reason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorSchedule {
  id: number;
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorScheduleCreate {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface DoctorAvailability {
  id: number;
  doctorId: number;
  date: Date;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorAvailabilityCreate {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  reason?: string;
}

export interface AvailableTimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableDoctor {
  id: number;
  doctorId: number;
  firstName: string;
  lastName: string;
  email: string;
  specialties: string[];
}
