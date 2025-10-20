import { getConnection } from '../config/database';

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
    const connection = await getConnection();
    
    // Generar número de expediente único si no se proporciona
    const finalPatientId = patientId || await this.generateUniquePatientId();

    // Insertar el nuevo expediente
    const [result] = await connection.execute(
      `INSERT INTO patient_records (patientId, userId, createdAt, updatedAt) 
       VALUES (?, ?, NOW(), NOW())`,
      [finalPatientId, userId]
    );

    const insertResult = result as { insertId: number };
    const recordId = insertResult.insertId;

    // Obtener el expediente creado
    const [records] = await connection.execute(
      'SELECT * FROM patient_records WHERE id = ?',
      [recordId]
    );

    const record = (records as PatientRecord[])[0];
    return record;
  }

  /**
   * Obtener expediente por ID de usuario
   */
  static async findByUserId(userId: number): Promise<PatientRecord | null> {
    const connection = await getConnection();
    
    const [records] = await connection.execute(
      'SELECT * FROM patient_records WHERE userId = ?',
      [userId]
    );

    const recordArray = records as PatientRecord[];
    return recordArray.length > 0 ? recordArray[0] : null;
  }

  /**
   * Obtener expediente por número de paciente
   */
  static async findByPatientId(patientId: string): Promise<PatientRecord | null> {
    const connection = await getConnection();
    
    const [records] = await connection.execute(
      'SELECT * FROM patient_records WHERE patientId = ?',
      [patientId]
    );

    const recordArray = records as PatientRecord[];
    return recordArray.length > 0 ? recordArray[0] : null;
  }

  /**
   * Generar número de expediente único
   */
  static async generateUniquePatientId(): Promise<string> {
    const connection = await getConnection();
    
    let isUnique = false;
    let patientId: string;
    
    while (!isUnique) {
      // Generar ID con formato: ZP + año + mes + número aleatorio de 4 dígitos
      const year = new Date().getFullYear().toString().slice(-2);
      const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
      const randomNum = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
      
      patientId = `ZP${year}${month}${randomNum}`;
      
      // Verificar si ya existe
      const [existing] = await connection.execute(
        'SELECT id FROM patient_records WHERE patientId = ?',
        [patientId]
      );
      
      if (Array.isArray(existing) && existing.length === 0) {
        isUnique = true;
      }
    }
    
    return patientId!;
  }

  /**
   * Crear tabla de expedientes si no existe
   */
  static async createTable(): Promise<void> {
    const connection = await getConnection();
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS patient_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patientId VARCHAR(20) UNIQUE NOT NULL,
        userId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_patientId (patientId),
        INDEX idx_userId (userId),
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createTableQuery);
    console.log('✅ Tabla de expedientes de pacientes creada/verificada correctamente');
  }
}