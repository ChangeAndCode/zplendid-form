import { getConnection } from '../config/database';
import sql from 'mssql';

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
    const pool = await getConnection();
    try {
      const query = `
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='patient_form_data' AND xtype='U')
        CREATE TABLE patient_form_data (
          id INT IDENTITY(1,1) PRIMARY KEY,
          patientId NVARCHAR(20) NOT NULL,
          formType NVARCHAR(50) NOT NULL,
          formData NVARCHAR(MAX) NOT NULL,
          createdAt DATETIME2 DEFAULT GETDATE(),
          updatedAt DATETIME2 DEFAULT GETDATE()
        );
        
        -- Crear índice si no existe
        IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_patient_form' AND object_id = OBJECT_ID('patient_form_data'))
        CREATE INDEX idx_patient_form ON patient_form_data (patientId, formType);
      `;
      await pool.request().query(query);
    } catch (error) {
      console.error('❌ Error al crear la tabla de datos de formularios:', error);
      throw error;
    }
  }

  /**
   * Guardar datos de un formulario
   */
  static async saveFormData(patientId: string, formType: string, formData: Record<string, unknown>): Promise<PatientFormData> {
    const pool = await getConnection();
    try {
      // Verificar si ya existe un registro para este paciente y tipo de formulario
      const existingResult = await pool.request()
        .input('patientId', sql.VarChar(20), patientId)
        .input('formType', sql.VarChar(50), formType)
        .query('SELECT id FROM patient_form_data WHERE patientId = @patientId AND formType = @formType');

      if (existingResult.recordset.length > 0) {
        // Actualizar registro existente
        await pool.request()
          .input('formData', sql.NVarChar(sql.MAX), JSON.stringify(formData))
          .input('patientId', sql.VarChar(20), patientId)
          .input('formType', sql.VarChar(50), formType)
          .query('UPDATE patient_form_data SET formData = @formData, updatedAt = GETDATE() WHERE patientId = @patientId AND formType = @formType');
      } else {
        // Crear nuevo registro
        await pool.request()
          .input('patientId', sql.VarChar(20), patientId)
          .input('formType', sql.VarChar(50), formType)
          .input('formData', sql.NVarChar(sql.MAX), JSON.stringify(formData))
          .query('INSERT INTO patient_form_data (patientId, formType, formData) VALUES (@patientId, @formType, @formData)');
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
    const pool = await getConnection();
    try {
      const result = await pool.request()
        .input('patientId', sql.VarChar(20), patientId)
        .input('formType', sql.VarChar(50), formType)
        .query('SELECT formData FROM patient_form_data WHERE patientId = @patientId AND formType = @formType');

      if (result.recordset.length > 0) {
        const formDataString = result.recordset[0].formData as string;
        // Parsear el JSON string
        return JSON.parse(formDataString);
      }

      return null;
    } catch (error) {
      console.error('❌ Error al obtener datos del formulario:', error);
      throw error;
    }
  }
}
