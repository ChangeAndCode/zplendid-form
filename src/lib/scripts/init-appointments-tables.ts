import { AppointmentModel } from '../models/Appointment';
import { DoctorScheduleModel } from '../models/DoctorSchedule';
import { DoctorAvailabilityModel } from '../models/DoctorAvailability';

async function initAppointmentsTables() {
  try {
    console.log('🔄 Inicializando tablas del sistema de citas...');
    
    await AppointmentModel.createTable();
    console.log('✅ Tabla appointments inicializada');
    
    await DoctorScheduleModel.createTable();
    console.log('✅ Tabla doctor_schedules inicializada');
    
    await DoctorAvailabilityModel.createTable();
    console.log('✅ Tabla doctor_availabilities inicializada');
    
    console.log('✅ Todas las tablas del sistema de citas han sido inicializadas correctamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al inicializar tablas:', error);
    process.exit(1);
  }
}

initAppointmentsTables();
