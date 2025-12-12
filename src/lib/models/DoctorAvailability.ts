import { getCollection } from '../config/database';
import { ObjectId } from 'mongodb';
import { DoctorAvailability, DoctorAvailabilityCreate } from '../types/appointments';

export class DoctorAvailabilityModel {
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
   * Crear disponibilidad específica
   */
  static async create(doctorId: number, availabilityData: DoctorAvailabilityCreate): Promise<DoctorAvailability> {
    await this.ensureIndexes();
    const collection = await getCollection('doctor_availabilities');
    
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

    const date = new Date(availabilityData.date);
    date.setHours(0, 0, 0, 0);

    const now = new Date();
    const availability: any = {
      doctorId: doctor._id,
      date,
      startTime: availabilityData.startTime,
      endTime: availabilityData.endTime,
      isAvailable: availabilityData.isAvailable,
      reason: availabilityData.reason || null,
      createdAt: now,
      updatedAt: now
    };

    const result = await collection.insertOne(availability);
    const newAvailability = await collection.findOne({ _id: result.insertedId });
    
    if (!newAvailability) throw new Error('Error al crear disponibilidad');
    
    return this.mapFromMongo(newAvailability);
  }

  /**
   * Obtener disponibilidades de un doctor
   */
  static async findByDoctorId(doctorId: number): Promise<DoctorAvailability[]> {
    const collection = await getCollection('doctor_availabilities');
    
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

    const availabilities = await collection
      .find({ doctorId: doctor._id })
      .sort({ date: 1 })
      .toArray();

    return availabilities.map(a => this.mapFromMongo(a));
  }

  /**
   * Obtener disponibilidades en rango de fechas
   */
  static async findByDateRange(doctorId: number, startDate: Date, endDate: Date): Promise<DoctorAvailability[]> {
    const collection = await getCollection('doctor_availabilities');
    
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

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const availabilities = await collection
      .find({
        doctorId: doctor._id,
        date: {
          $gte: start,
          $lte: end
        }
      })
      .sort({ date: 1 })
      .toArray();

    return availabilities.map(a => this.mapFromMongo(a));
  }

  /**
   * Actualizar disponibilidad
   */
  static async update(id: number, availabilityData: Partial<DoctorAvailabilityCreate>): Promise<void> {
    const collection = await getCollection('doctor_availabilities');
    const availabilities = await collection.find({}).toArray();
    const availability = availabilities.find((a: any) => {
      if (a._id) {
        const numericId = parseInt(a._id.toString().slice(-8), 16);
        return numericId === id;
      }
      return (a as any).id === id;
    });

    if (!availability || !availability._id) {
      throw new Error('Disponibilidad no encontrada');
    }

    const updateData: any = {
      updatedAt: new Date()
    };

    if (availabilityData.date) {
      const date = new Date(availabilityData.date);
      date.setHours(0, 0, 0, 0);
      updateData.date = date;
    }
    if (availabilityData.startTime !== undefined) updateData.startTime = availabilityData.startTime;
    if (availabilityData.endTime !== undefined) updateData.endTime = availabilityData.endTime;
    if (availabilityData.isAvailable !== undefined) updateData.isAvailable = availabilityData.isAvailable;
    if (availabilityData.reason !== undefined) updateData.reason = availabilityData.reason;

    await collection.updateOne(
      { _id: availability._id },
      { $set: updateData }
    );
  }

  /**
   * Eliminar disponibilidad
   */
  static async delete(id: number): Promise<void> {
    const collection = await getCollection('doctor_availabilities');
    const availabilities = await collection.find({}).toArray();
    const availability = availabilities.find((a: any) => {
      if (a._id) {
        const numericId = parseInt(a._id.toString().slice(-8), 16);
        return numericId === id;
      }
      return (a as any).id === id;
    });

    if (!availability || !availability._id) {
      throw new Error('Disponibilidad no encontrada');
    }

    await collection.deleteOne({ _id: availability._id });
  }

  /**
   * Mapear desde MongoDB
   */
  private static mapFromMongo(availability: any): DoctorAvailability {
    return {
      id: availability._id ? parseInt(availability._id.toString().slice(-8), 16) : availability.id,
      doctorId: availability.doctorId ? parseInt(availability.doctorId.toString().slice(-8), 16) : availability.doctorId,
      date: availability.date,
      startTime: availability.startTime,
      endTime: availability.endTime,
      isAvailable: availability.isAvailable,
      reason: availability.reason,
      createdAt: availability.createdAt,
      updatedAt: availability.updatedAt
    };
  }

  /**
   * Crear índices
   */
  static async createTable(): Promise<void> {
    const collection = await getCollection('doctor_availabilities');
    await collection.createIndex({ doctorId: 1 });
    await collection.createIndex({ date: 1 });
    await collection.createIndex({ doctorId: 1, date: 1 });
  }
}
