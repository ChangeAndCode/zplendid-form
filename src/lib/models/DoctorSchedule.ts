import { getCollection } from '../config/database';
import { ObjectId } from 'mongodb';
import { DoctorSchedule, DoctorScheduleCreate } from '../types/appointments';

export class DoctorScheduleModel {
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
      console.log('Índices ya existen o error al crearlos (no crítico):', error);
    }
  }

  /**
   * Crear o actualizar horario
   */
  static async upsert(doctorId: number, scheduleData: DoctorScheduleCreate): Promise<DoctorSchedule> {
    await this.ensureIndexes();
    const collection = await getCollection('doctor_schedules');
    
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
      throw new Error('Doctor no encontrado');
    }

    const now = new Date();
    const schedule: any = {
      doctorId: doctor._id,
      dayOfWeek: scheduleData.dayOfWeek,
      startTime: scheduleData.startTime,
      endTime: scheduleData.endTime,
      isAvailable: scheduleData.isAvailable,
      updatedAt: now
    };

    // Buscar si ya existe
    const existing = await collection.findOne({
      doctorId: doctor._id,
      dayOfWeek: scheduleData.dayOfWeek
    });

    if (existing) {
      await collection.updateOne(
        { _id: existing._id },
        { $set: schedule }
      );
      const updated = await collection.findOne({ _id: existing._id });
      return updated ? this.mapFromMongo(updated) : this.mapFromMongo(existing);
    } else {
      schedule.createdAt = now;
      const result = await collection.insertOne(schedule);
      const newSchedule = await collection.findOne({ _id: result.insertedId });
      if (!newSchedule) throw new Error('Error al crear horario');
      return this.mapFromMongo(newSchedule);
    }
  }

  /**
   * Obtener horarios de un doctor
   */
  static async findByDoctorId(doctorId: number): Promise<DoctorSchedule[]> {
    const collection = await getCollection('doctor_schedules');
    
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

    const schedules = await collection
      .find({ doctorId: doctor._id })
      .sort({ dayOfWeek: 1 })
      .toArray();

    return schedules.map(s => this.mapFromMongo(s));
  }

  /**
   * Eliminar horario
   */
  static async delete(doctorId: number, dayOfWeek: number): Promise<void> {
    const collection = await getCollection('doctor_schedules');
    
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
      throw new Error('Doctor no encontrado');
    }

    await collection.deleteOne({
      doctorId: doctor._id,
      dayOfWeek
    });
  }

  /**
   * Mapear desde MongoDB
   */
  private static mapFromMongo(schedule: any): DoctorSchedule {
    return {
      id: schedule._id ? parseInt(schedule._id.toString().slice(-8), 16) : schedule.id,
      doctorId: schedule.doctorId ? parseInt(schedule.doctorId.toString().slice(-8), 16) : schedule.doctorId,
      dayOfWeek: schedule.dayOfWeek,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      isAvailable: schedule.isAvailable,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt
    };
  }

  /**
   * Crear índices
   */
  static async createTable(): Promise<void> {
    const collection = await getCollection('doctor_schedules');
    await collection.createIndex({ doctorId: 1 });
    await collection.createIndex({ doctorId: 1, dayOfWeek: 1 }, { unique: true });
  }
}
