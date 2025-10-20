import { getConnection } from '../config/database';

export interface PatientFormData {
  id?: number;
  patientId: string;
  formType: string;
  formData: string; // JSON string
  createdAt?: Date;
  updatedAt?: Date;
}

export class PatientFormDataModel {
  /**
   * Crea la tabla de datos de formularios si no existe.
   */
  static async createTable(): Promise<void> {
    const connection = await getConnection();
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS patient_form_data (
          id INT AUTO_INCREMENT PRIMARY KEY,
          patientId VARCHAR(20) NOT NULL,
          formType VARCHAR(50) NOT NULL,
          formData JSON NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_patient_form (patientId, formType)
        );
      `;
      await connection.execute(query);
    } catch (error) {
      console.error('❌ Error al crear la tabla de datos de formularios:', error);
      throw error;
    }
  }

  /**
   * Guardar datos de un formulario
   */
  static async saveFormData(patientId: string, formType: string, formData: Record<string, unknown>): Promise<PatientFormData> {
    const connection = await getConnection();
    try {
      // Verificar si ya existe un registro para este paciente y tipo de formulario
      const [existing] = await connection.execute(
        'SELECT id FROM patient_form_data WHERE patientId = ? AND formType = ?',
        [patientId, formType]
      );

      if (Array.isArray(existing) && existing.length > 0) {
        // Actualizar registro existente
        await connection.execute(
          'UPDATE patient_form_data SET formData = ?, updatedAt = NOW() WHERE patientId = ? AND formType = ?',
          [JSON.stringify(formData), patientId, formType]
        );
      } else {
        // Crear nuevo registro
        await connection.execute(
          'INSERT INTO patient_form_data (patientId, formType, formData) VALUES (?, ?, ?)',
          [patientId, formType, JSON.stringify(formData)]
        );
      }

      return { patientId, formType, formData: JSON.stringify(formData) };
    } catch (error) {
      console.error('❌ Error al guardar datos del formulario:', error);
      throw error;
    }
  }

  /**
   * Obtener datos de un formulario
   */
  static async getFormData(patientId: string, formType: string): Promise<Record<string, unknown> | null> {
    const connection = await getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT formData FROM patient_form_data WHERE patientId = ? AND formType = ?',
        [patientId, formType]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        const result = rows[0] as { formData: Record<string, unknown> };
        // Los datos ya están parseados por MySQL (columna JSON)
        return result.formData;
      }

      return null;
    } catch (error) {
      console.error('❌ Error al obtener datos del formulario:', error);
      throw error;
    }
  }
}
