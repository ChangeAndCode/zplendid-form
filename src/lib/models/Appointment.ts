import { getCollection, getDatabase } from '../config/database';
import { ObjectId } from 'mongodb';
import { Appointment, AppointmentCreate, AppointmentResponse } from '../types/appointments';
import { getUserIdAsObjectId } from '../utils/mongoIdHelper';

export class AppointmentModel {
  private static indexesCreated = false;

  /**
   * Asegurar que los índices existen
   */
  private static async ensureIndexes(): Promise<void> {
    if (this.indexesCreated) return;
    try {
      await this.createTable();
      this.indexesCreated = true;
    } catch (error) {
      // Si los índices ya existen, no es un error crítico
      console.log('Índices ya existen o error al crearlos (no crítico):', error);
    }
  }

  /**
   * Crear nueva cita
   */
  static async create(appointmentData: AppointmentCreate, patientUserId: number, patientId: string): Promise<Appointment> {
    await this.ensureIndexes();
    const collection = await getCollection('appointments');
    const db = await getDatabase();

    // Convertir IDs
    const patientUserIdObj = await getUserIdAsObjectId(patientUserId);
    if (!patientUserIdObj) {
      throw new Error('Usuario paciente no encontrado');
    }

    // Buscar doctor
    const doctorsCollection = await getCollection('doctors');
    const doctors = await doctorsCollection.find({}).toArray();
    const doctor = doctors.find((d: any) => {
      if (d._id) {
        const numericId = parseInt(d._id.toString().slice(-8), 16);
        return numericId === appointmentData.doctorId;
      }
      return (d as any).id === appointmentData.doctorId;
    });

    if (!doctor || !doctor._id) {
      throw new Error('Doctor no encontrado');
    }

    const doctorIdObj = doctor._id;
    const doctorUserIdObj = doctor.userId;

    // Verificar disponibilidad
    const appointmentDateTime = new Date(appointmentData.appointmentDate);
    const duration = appointmentData.duration || 30;
    const isAvailable = await this.checkAvailability(
      appointmentData.doctorId,
      appointmentDateTime,
      duration
    );

    if (!isAvailable) {
      throw new Error('El horario seleccionado no está disponible');
    }

    const now = new Date();
    const newAppointment: any = {
      patientId,
      patientUserId: patientUserIdObj,
      doctorId: doctorIdObj,
      doctorUserId: doctorUserIdObj,
      specialty: appointmentData.specialty,
      appointmentDate: appointmentDateTime,
      duration,
      status: 'scheduled' as const,
      reason: appointmentData.reason || null,
      notes: null,
      createdAt: now,
      updatedAt: now
    };

    const result = await collection.insertOne(newAppointment);
    const appointment = await collection.findOne({ _id: result.insertedId });

    if (!appointment) throw new Error('Error al crear cita');

    return this.mapFromMongo(appointment);
  }

  /**
   * Buscar cita por ID
   */
  static async findById(id: number): Promise<AppointmentResponse | null> {
    const db = await getDatabase();
    const appointments = await db.collection('appointments').find({}).toArray();
    const appointment = appointments.find((a: any) => {
      if (a._id) {
        const numericId = parseInt(a._id.toString().slice(-8), 16);
        return numericId === id;
      }
      return (a as any).id === id;
    });

    if (!appointment) return null;

    return await this.enrichWithNames(appointment);
  }

  /**
   * Obtener citas de un paciente
   */
  static async findByPatientId(patientId: string): Promise<AppointmentResponse[]> {
    const db = await getDatabase();
    const appointments = await db.collection('appointments')
      .find({ patientId })
      .sort({ appointmentDate: 1 })
      .toArray();

    const enriched = await Promise.all(
      appointments.map((a: any) => this.enrichWithNames(a))
    );

    return enriched.filter(a => a !== null) as AppointmentResponse[];
  }

  /**
   * Obtener citas de un doctor
   */
  static async findByDoctorId(doctorId: number): Promise<AppointmentResponse[]> {
    const db = await getDatabase();
    
    // Buscar doctor ObjectId
    const doctorsCollection = await getCollection('doctors');
    const doctors = await doctorsCollection.find({}).toArray();
    const doctor = doctors.find((d: any) => {
      if (d._id) {
        const numericId = parseInt(d._id.toString().slice(-8), 16);
        return numericId === doctorId;
      }
      return (d as any).id === doctorId;
    });

    if (!doctor || !doctor._id) {
      return [];
    }

    const appointments = await db.collection('appointments')
      .find({ doctorId: doctor._id })
      .sort({ appointmentDate: 1 })
      .toArray();

    const enriched = await Promise.all(
      appointments.map((a: any) => this.enrichWithNames(a))
    );

    return enriched.filter(a => a !== null) as AppointmentResponse[];
  }

  /**
   * Obtener citas en rango de fechas
   */
  static async findByDateRange(doctorId: number, startDate: Date, endDate: Date): Promise<AppointmentResponse[]> {
    const db = await getDatabase();
    
    const doctorsCollection = await getCollection('doctors');
    const doctors = await doctorsCollection.find({}).toArray();
    const doctor = doctors.find((d: any) => {
      if (d._id) {
        const numericId = parseInt(d._id.toString().slice(-8), 16);
        return numericId === doctorId;
      }
      return (d as any).id === doctorId;
    });

    if (!doctor || !doctor._id) {
      return [];
    }

    const appointments = await db.collection('appointments')
      .find({
        doctorId: doctor._id,
        appointmentDate: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .sort({ appointmentDate: 1 })
      .toArray();

    const enriched = await Promise.all(
      appointments.map((a: any) => this.enrichWithNames(a))
    );

    return enriched.filter(a => a !== null) as AppointmentResponse[];
  }

  /**
   * Actualizar estado de cita
   */
  static async updateStatus(id: number, status: string, notes?: string): Promise<void> {
    const collection = await getCollection('appointments');
    const appointments = await collection.find({}).toArray();
    const appointment = appointments.find((a: any) => {
      if (a._id) {
        const numericId = parseInt(a._id.toString().slice(-8), 16);
        return numericId === id;
      }
      return (a as any).id === id;
    });

    if (!appointment || !appointment._id) {
      throw new Error('Cita no encontrada');
    }

    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (notes !== undefined) {
      updateData.notes = notes;
    }

    if (status === 'cancelled') {
      updateData.cancelledAt = new Date();
    }

    await collection.updateOne(
      { _id: appointment._id },
      { $set: updateData }
    );
  }

  /**
   * Cancelar cita
   */
  static async cancel(id: number, reason: string): Promise<void> {
    const collection = await getCollection('appointments');
    const appointments = await collection.find({}).toArray();
    const appointment = appointments.find((a: any) => {
      if (a._id) {
        const numericId = parseInt(a._id.toString().slice(-8), 16);
        return numericId === id;
      }
      return (a as any).id === id;
    });

    if (!appointment || !appointment._id) {
      throw new Error('Cita no encontrada');
    }

    await collection.updateOne(
      { _id: appointment._id },
      {
        $set: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancellationReason: reason,
          updatedAt: new Date()
        }
      }
    );
  }

  /**
   * Verificar disponibilidad
   */
  static async checkAvailability(doctorId: number, date: Date, duration: number): Promise<boolean> {
    const db = await getDatabase();
    
    // Buscar doctor
    const doctorsCollection = await getCollection('doctors');
    const doctors = await doctorsCollection.find({}).toArray();
    const doctor = doctors.find((d: any) => {
      if (d._id) {
        const numericId = parseInt(d._id.toString().slice(-8), 16);
        return numericId === doctorId;
      }
      return (d as any).id === doctorId;
    });

    if (!doctor || !doctor._id) {
      return false;
    }

    // Verificar que no sea en el pasado
    if (date < new Date()) {
      return false;
    }

    // Verificar horario de trabajo (día de la semana)
    const dayOfWeek = date.getDay();
    const schedulesCollection = await getCollection('doctor_schedules');
    const schedule = await schedulesCollection.findOne({
      doctorId: doctor._id,
      dayOfWeek,
      isAvailable: true
    });

    if (!schedule) {
      return false;
    }

    // Verificar disponibilidad específica
    const dateStr = date.toISOString().split('T')[0];
    const availabilitiesCollection = await getCollection('doctor_availabilities');
    const availability = await availabilitiesCollection.findOne({
      doctorId: doctor._id,
      date: new Date(dateStr)
    });

    if (availability && !availability.isAvailable) {
      return false;
    }

    // Verificar que no haya citas conflictivas
    const startTime = new Date(date);
    const endTime = new Date(date.getTime() + duration * 60000);

    const conflictingAppointments = await db.collection('appointments').find({
      doctorId: doctor._id,
      status: { $in: ['scheduled', 'confirmed'] },
      $or: [
        {
          appointmentDate: {
            $gte: startTime,
            $lt: endTime
          }
        },
        {
          appointmentDate: {
            $lte: startTime
          },
          $expr: {
            $gte: [
              { $add: ['$appointmentDate', { $multiply: ['$duration', 60000] }] },
              startTime
            ]
          }
        }
      ]
    }).toArray();

    return conflictingAppointments.length === 0;
  }

  /**
   * Enriquecer cita con nombres de paciente y doctor
   */
  private static async enrichWithNames(appointment: any): Promise<AppointmentResponse | null> {
    try {
      const db = await getDatabase();

      // Obtener información del paciente
      const patientUser = await db.collection('users').findOne({ _id: appointment.patientUserId });
      if (!patientUser) return null;

      // Obtener información del doctor
      const doctorUser = await db.collection('users').findOne({ _id: appointment.doctorUserId });
      if (!doctorUser) return null;

      return {
        id: appointment._id ? parseInt(appointment._id.toString().slice(-8), 16) : appointment.id,
        patientId: appointment.patientId,
        patientName: `${patientUser.firstName} ${patientUser.lastName}`,
        patientEmail: patientUser.email,
        doctorId: appointment.doctorId ? parseInt(appointment.doctorId.toString().slice(-8), 16) : appointment.doctorId,
        doctorName: `${doctorUser.firstName} ${doctorUser.lastName}`,
        doctorEmail: doctorUser.email,
        specialty: appointment.specialty,
        appointmentDate: appointment.appointmentDate,
        duration: appointment.duration || 30,
        status: appointment.status,
        reason: appointment.reason,
        notes: appointment.notes,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt
      };
    } catch (error) {
      console.error('Error al enriquecer cita:', error);
      return null;
    }
  }

  /**
   * Mapear desde MongoDB
   */
  private static mapFromMongo(appointment: any): Appointment {
    return {
      id: appointment._id ? parseInt(appointment._id.toString().slice(-8), 16) : appointment.id,
      patientId: appointment.patientId,
      patientUserId: appointment.patientUserId ? parseInt(appointment.patientUserId.toString().slice(-8), 16) : appointment.patientUserId,
      doctorId: appointment.doctorId ? parseInt(appointment.doctorId.toString().slice(-8), 16) : appointment.doctorId,
      doctorUserId: appointment.doctorUserId ? parseInt(appointment.doctorUserId.toString().slice(-8), 16) : appointment.doctorUserId,
      specialty: appointment.specialty,
      appointmentDate: appointment.appointmentDate,
      duration: appointment.duration || 30,
      status: appointment.status,
      reason: appointment.reason,
      notes: appointment.notes,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      cancelledAt: appointment.cancelledAt,
      cancellationReason: appointment.cancellationReason
    };
  }

  /**
   * Crear índices
   */
  static async createTable(): Promise<void> {
    const collection = await getCollection('appointments');
    await collection.createIndex({ patientId: 1 });
    await collection.createIndex({ doctorId: 1 });
    await collection.createIndex({ appointmentDate: 1 });
    await collection.createIndex({ status: 1 });
    await collection.createIndex({ doctorId: 1, appointmentDate: 1 });
  }
}
