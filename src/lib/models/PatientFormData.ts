import { getCollection } from '../config/database';

export interface PatientFormData {
  id?: number;
  patientId: string;
  formType: string;
  formData: string; // JSON string
  createdAt?: Date;
  updatedAt?: Date;
}

interface PatientFormDataDoc {
  _id?: any;
  patientId: string;
  formType: string;
  formData: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class PatientFormDataModel {
  /**
   * Crear índices (equivalente a createTable)
   */
  static async createTable(): Promise<void> {
    const collection = await getCollection<PatientFormDataDoc>('patient_form_data');
    await collection.createIndex({ patientId: 1, formType: 1 }, { unique: true });
  }

  /**
   * Guardar datos de un formulario
   */
  static async saveFormData(patientId: string, formType: string, formData: Record<string, unknown>): Promise<PatientFormData> {
    const collection = await getCollection<PatientFormDataDoc>('patient_form_data');
    
    const now = new Date();
    const doc: PatientFormDataDoc = {
      patientId,
      formType,
      formData,
      createdAt: now,
      updatedAt: now
    };

    await collection.updateOne(
      { patientId, formType },
      { $set: { ...doc, updatedAt: now } },
      { upsert: true }
    );

    return { patientId, formType, formData: JSON.stringify(formData), createdAt: now, updatedAt: now };
  }

  /**
   * Obtener datos de un formulario
   */
  static async getFormData(patientId: string, formType: string): Promise<Record<string, unknown> | null> {
    const collection = await getCollection<PatientFormDataDoc>('patient_form_data');
    const doc = await collection.findOne({ patientId, formType });
    return doc ? doc.formData : null;
  }
}
