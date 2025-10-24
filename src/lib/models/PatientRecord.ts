import { getConnection } from '../config/database';
import sql from 'mssql';

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
    const pool = await getConnection();
    
    // Generar número de expediente único si no se proporciona
    const finalPatientId = patientId || await this.generateUniquePatientId();

    // Insertar el nuevo expediente
    const insertResult = await pool.request()
      .input('patientId', sql.VarChar(20), finalPatientId)
      .input('userId', sql.Int, userId)
      .query(`
        INSERT INTO patient_records (patientId, userId, createdAt, updatedAt) 
        OUTPUT INSERTED.id
        VALUES (@patientId, @userId, GETDATE(), GETDATE())
      `);

    const recordId = insertResult.recordset[0].id;

    // Obtener el expediente creado
    const recordResult = await pool.request()
      .input('id', sql.Int, recordId)
      .query('SELECT * FROM patient_records WHERE id = @id');

    const record = recordResult.recordset[0] as PatientRecord;
    return record;
  }

  /**
   * Obtener expediente por ID de usuario
   */
  static async findByUserId(userId: number): Promise<PatientRecord | null> {
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM patient_records WHERE userId = @userId');

    return result.recordset.length > 0 ? result.recordset[0] as PatientRecord : null;
  }

  /**
   * Obtener expediente por número de paciente
   */
  static async findByPatientId(patientId: string): Promise<PatientRecord | null> {
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('patientId', sql.VarChar(20), patientId)
      .query('SELECT * FROM patient_records WHERE patientId = @patientId');

    return result.recordset.length > 0 ? result.recordset[0] as PatientRecord : null;
  }

  /**
   * Generar número de expediente único
   */
  static async generateUniquePatientId(): Promise<string> {
    const pool = await getConnection();
    
    let isUnique = false;
    let patientId: string;
    
    while (!isUnique) {
      // Generar ID con formato: ZP + año + mes + número aleatorio de 4 dígitos
      const year = new Date().getFullYear().toString().slice(-2);
      const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const randomNum = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
      
      patientId = `ZP${year}${month}${randomNum}`;
      
      // Verificar si ya existe
      const result = await pool.request()
        .input('patientId', sql.VarChar(20), patientId)
        .query('SELECT id FROM patient_records WHERE patientId = @patientId');
      
      if (result.recordset.length === 0) {
        isUnique = true;
      }
    }
    
    return patientId!;
  }

  /**
   * Crear tabla de expedientes si no existe
   */
  static async createTable(): Promise<void> {
    const pool = await getConnection();
    
    const createTableQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='patient_records' AND xtype='U')
      CREATE TABLE patient_records (
        id INT IDENTITY(1,1) PRIMARY KEY,
        patientId NVARCHAR(20) UNIQUE NOT NULL,
        userId INT NOT NULL,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
      
      -- Crear índices si no existen
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_patientId' AND object_id = OBJECT_ID('patient_records'))
      CREATE INDEX idx_patientId ON patient_records (patientId);
      
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_userId' AND object_id = OBJECT_ID('patient_records'))
      CREATE INDEX idx_userId ON patient_records (userId);
    `;

    await pool.request().query(createTableQuery);
  }
}