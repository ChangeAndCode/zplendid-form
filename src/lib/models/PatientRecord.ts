import { getCollection } from '../config/database';
import { ObjectId } from 'mongodb';
import { getUserIdAsObjectId } from '../utils/mongoIdHelper';

export interface PatientRecord {
  id: number;
  patientId: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PatientRecordModel {
  /**
   * Crear un nuevo expediente de paciente
   */
  static async create(userId: number, patientId?: string): Promise<PatientRecord> {
    const collection = await getCollection<PatientRecord>('patient_records');
    
    // Generar número de expediente único si no se proporciona
    const finalPatientId = patientId || await this.generateUniquePatientId();

    // Convertir userId numérico a ObjectId
    const userIdValue = await getUserIdAsObjectId(userId);
    if (!userIdValue) {
      throw new Error('Usuario no encontrado');
    }

    const now = new Date();
    const newRecord: any = {
      patientId: finalPatientId,
      userId: userIdValue,
      createdAt: now,
      updatedAt: now
    };

    const result = await collection.insertOne(newRecord);
    const record = await collection.findOne({ _id: result.insertedId });
    
    if (!record) throw new Error('Error al crear expediente');
    
    return this.mapFromMongo(record);
  }

  /**
   * Obtener expediente por ID de usuario
   */
  static async findByUserId(userId: number): Promise<PatientRecord | null> {
    const collection = await getCollection<PatientRecord>('patient_records');
    
    // Convertir userId numérico a ObjectId
    const userIdValue = await getUserIdAsObjectId(userId);
    if (!userIdValue) {
      return null;
    }
    
    const record = await collection.findOne({ userId: userIdValue });
    return record ? this.mapFromMongo(record) : null;
  }

  /**
   * Obtener expediente por número de paciente
   */
  static async findByPatientId(patientId: string): Promise<PatientRecord | null> {
    const collection = await getCollection<PatientRecord>('patient_records');
    const record = await collection.findOne({ patientId });
    return record ? this.mapFromMongo(record) : null;
  }

  /**
   * Generar número de expediente único
   */
  static async generateUniquePatientId(): Promise<string> {
    const collection = await getCollection<PatientRecord>('patient_records');
    
    let isUnique = false;
    let patientId: string;
    
    while (!isUnique) {
      // Generar ID con formato: ZP + año + mes + número aleatorio de 4 dígitos
      const year = new Date().getFullYear().toString().slice(-2);
      const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const randomNum = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
      
      patientId = `ZP${year}${month}${randomNum}`;
      
      // Verificar si ya existe
      const existing = await collection.findOne({ patientId });
      
      if (!existing) {
        isUnique = true;
      }
    }
    
    return patientId!;
  }

  /**
   * Mapear desde MongoDB a PatientRecord
   */
  private static mapFromMongo(record: any): PatientRecord {
    return {
      id: record._id ? parseInt(record._id.toString().slice(-8), 16) : record.id,
      patientId: record.patientId,
      userId: record.userId instanceof ObjectId ? parseInt(record.userId.toString().slice(-8), 16) : record.userId,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    };
  }

  /**
   * Crear índices (equivalente a createTable)
   */
  static async createTable(): Promise<void> {
    const collection = await getCollection<PatientRecord>('patient_records');
    await collection.createIndex({ patientId: 1 }, { unique: true });
    await collection.createIndex({ userId: 1 });
  }
}