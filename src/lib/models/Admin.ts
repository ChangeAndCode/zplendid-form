import { getConnection } from '../config/database';
import { AutoSchema } from '../utils/autoSchema';

// Interfaces para los tipos de datos
interface PatientRecord {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  patientId?: string;
  status?: string;
  interestArea?: string;
}

interface DoctorRecord {
  id: number;
  userId: number;
  specialties: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  firstName?: string;
  lastName?: string;
  email?: string;
  status?: string;
}

interface AssignmentRecord {
  id: number;
  patientId: string;
  doctorId: number;
  interestArea: string;
  assignedAt: Date;
  status: string;
  notes?: string;
  patientName?: string;
  patientEmail?: string;
  doctorName?: string;
  doctorEmail?: string;
}

interface SearchResult {
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  interestArea?: string;
  procedure?: string;
}

export interface AdminStats {
  totalPatients: number;
  activeDoctors: number;
  pendingRequests: number;
  todaysAssignments: number;
}

export interface PatientSummary {
  id: number;
  patientId: string;
  firstName: string;
  lastName: string;
  email: string;
  interestArea: string;
  status: 'complete' | 'in_progress' | 'assigned';
  createdAt: Date;
  assignedDoctor?: string;
}

export interface DoctorSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export class AdminModel {
  /**
   * Obtener estadísticas generales del panel de administrador
   */
  static async getDashboardStats(): Promise<AdminStats> {
    const connection = await getConnection();
    
    try {
      // Total de pacientes (usuarios con rol 'user')
      const [patientCount] = await connection.execute(
        `SELECT COUNT(*) as totalPatients 
         FROM users 
         WHERE role = 'user' AND isActive = true`
      );
      
      // Doctores activos (de la tabla doctors)
      const [doctorCount] = await connection.execute(
        `SELECT COUNT(*) as activeDoctors 
         FROM doctors 
         WHERE isApproved = true`
      );
      
      // Solicitudes pendientes (doctores con estado pendiente)
      const [pendingCount] = await connection.execute(
        `SELECT COUNT(*) as pendingRequests 
         FROM doctors 
         WHERE isApproved = false`
      );
      
      // Asignaciones de hoy (esto se implementará cuando tengamos la tabla de asignaciones)
      const todaysAssignments = 0; // Por ahora 0, se implementará después
      
      const patientResult = patientCount as { totalPatients: number }[];
      const doctorResult = doctorCount as { activeDoctors: number }[];
      const pendingResult = pendingCount as { pendingRequests: number }[];
      
      return {
        totalPatients: patientResult[0]?.totalPatients || 0,
        activeDoctors: doctorResult[0]?.activeDoctors || 0,
        pendingRequests: pendingResult[0]?.pendingRequests || 0,
        todaysAssignments
      };
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      throw error;
    }
  }

  /**
   * Obtener lista de pacientes con información resumida
   */
  static async getPatientsList(): Promise<PatientSummary[]> {
    const connection = await getConnection();
    
    try {
      const [patients] = await connection.execute(
        `SELECT 
           u.id,
           COALESCE(pr.patientId, 'Sin ID') as patientId,
           u.firstName,
           u.lastName,
           u.email,
           u.createdAt,
           'No especificado' as interestArea,
           CASE 
             WHEN pr.patientId IS NOT NULL THEN 'in_progress'
             ELSE 'registered'
           END as status
         FROM users u
         LEFT JOIN patient_records pr ON u.id = pr.userId
         WHERE u.role = 'user' AND u.isActive = true
         ORDER BY u.createdAt DESC`
      );
      
      const patientsArray = patients as PatientRecord[];
      
      return patientsArray.map(patient => ({
        id: patient.id,
        patientId: patient.patientId || '',
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        interestArea: patient.interestArea || 'No especificado',
        status: (patient.status as 'complete' | 'in_progress' | 'assigned') || 'registered',
        createdAt: patient.createdAt
      }));
    } catch (error) {
      console.error('Error al obtener lista de pacientes:', error);
      throw error;
    }
  }

  /**
   * Obtener lista de doctores con información resumida
   */
  static async getDoctorsList(): Promise<DoctorSummary[]> {
    const connection = await getConnection();
    
    try {
      const [doctors] = await connection.execute(
        `SELECT 
           d.id,
           d.userId,
           d.licenseNumber,
           d.specialties,
           d.isActive,
           d.isApproved,
           u.firstName,
           u.lastName,
           u.email,
           d.createdAt,
           CASE 
             WHEN d.isApproved = true THEN 'approved'
             WHEN d.isApproved = false THEN 'pending'
             ELSE 'pending'
           END as status
         FROM doctors d
         INNER JOIN users u ON d.userId = u.id
         ORDER BY d.createdAt DESC`
      );
      
      const doctorsArray = doctors as DoctorRecord[];
      
      return doctorsArray.map(doctor => {
        // Parsear las especialidades desde JSON
        let specialtyText = 'Sin especialidades';
        try {
          const specialties = typeof doctor.specialties === 'string' 
            ? JSON.parse(doctor.specialties) 
            : doctor.specialties;
          
          if (Array.isArray(specialties) && specialties.length > 0) {
            specialtyText = specialties.join(', ');
          }
        } catch {
          specialtyText = doctor.specialties || 'Sin especialidades';
        }

        return {
          id: doctor.id,
          firstName: doctor.firstName || '',
          lastName: doctor.lastName || '',
          email: doctor.email || '',
          specialty: specialtyText,
          status: (doctor.status as 'pending' | 'approved' | 'rejected') || 'pending',
          createdAt: doctor.createdAt
        };
      });
    } catch (error) {
      console.error('Error al obtener lista de doctores:', error);
      throw error;
    }
  }

  /**
   * Aprobar un doctor
   */
  static async approveDoctor(doctorId: number): Promise<void> {
    const connection = await getConnection();
    
    try {
      await connection.execute(
        'UPDATE doctors SET isApproved = true, updatedAt = NOW() WHERE id = ?',
        [doctorId]
      );
    } catch (error) {
      console.error('Error al aprobar doctor:', error);
      throw error;
    }
  }

  /**
   * Rechazar un doctor
   */
  static async rejectDoctor(doctorId: number): Promise<void> {
    const connection = await getConnection();
    
    try {
      await connection.execute(
        'UPDATE doctors SET isApproved = false, updatedAt = NOW() WHERE id = ?',
        [doctorId]
      );
    } catch (error) {
      console.error('Error al rechazar doctor:', error);
      throw error;
    }
  }

  /**
   * Obtener detalles completos de un paciente
   * Incluye datos del formulario tradicional Y del chatbot
   */
  static async getPatientDetails(patientId: string): Promise<(PatientRecord & { 
    forms: Record<string, Record<string, unknown>>;
    chatbotData: {
      patientInfo?: Record<string, unknown>;
      surgeryInterest?: Record<string, unknown>;
      medicalHistory?: Record<string, unknown>;
      familyHistory?: Record<string, unknown>;
    };
  }) | null> {
    const connection = await getConnection();
    
    try {
      // Obtener información básica del paciente
      const [patientInfo] = await connection.execute(
        `SELECT 
           u.id,
           u.firstName,
           u.lastName,
           u.email,
           pr.patientId,
           u.createdAt
         FROM users u
         INNER JOIN patient_records pr ON u.id = pr.userId
         WHERE pr.patientId = ? AND u.role = 'user'`,
        [patientId]
      );
      
      if (!Array.isArray(patientInfo) || patientInfo.length === 0) {
        return null;
      }
      
      const patient = patientInfo[0] as PatientRecord;
      
      // Obtener datos de formularios tradicionales
      const [formData] = await connection.execute(
        `SELECT formType, formData 
         FROM patient_form_data 
         WHERE patientId = ?`,
        [patientId]
      );
      
      const forms = formData as { formType: string; formData: Record<string, unknown> }[];
      const formDataMap: Record<string, Record<string, unknown>> = {};
      
      forms.forEach(form => {
        formDataMap[form.formType] = form.formData;
      });

      // Obtener datos del chatbot desde las tablas estructuradas
      const chatbotData: {
        patientInfo?: Record<string, unknown>;
        surgeryInterest?: Record<string, unknown>;
        medicalHistory?: Record<string, unknown>;
        familyHistory?: Record<string, unknown>;
      } = {};

      // Obtener medicalRecordId
      const [medicalRecords] = await connection.execute(
        `SELECT mr.id FROM medical_records mr
         INNER JOIN patient_records pr ON mr.recordNumber = pr.patientId
         WHERE pr.patientId = ? LIMIT 1`,
        [patientId]
      );

      if (Array.isArray(medicalRecords) && medicalRecords.length > 0) {
        const medicalRecordId = (medicalRecords[0] as { id: number }).id;

        // Asegurar que las tablas existan antes de intentar leerlas
        await AutoSchema.ensurePatientInfoColumns();
        await AutoSchema.ensureSurgeryInterestColumns();
        await AutoSchema.ensureMedicalHistoryColumns();
        await AutoSchema.ensureFamilyHistoryColumns();

        // Obtener patient_info
        try {
          const [patientInfoData] = await connection.execute(
            `SELECT * FROM patient_info WHERE medicalRecordId = ? LIMIT 1`,
            [medicalRecordId]
          );
          if (Array.isArray(patientInfoData) && patientInfoData.length > 0) {
            const data = patientInfoData[0] as Record<string, unknown>;
            // Remover campos internos
            const { id, medicalRecordId: _, createdAt: __, updatedAt: ___, ...cleanData } = data;
            chatbotData.patientInfo = cleanData;
          }
        } catch (error) {
          console.warn('Error al obtener patient_info (tabla puede no existir aún):', error);
        }

        // Obtener surgery_interest
        try {
          const [surgeryInterestData] = await connection.execute(
            `SELECT * FROM surgery_interest WHERE medicalRecordId = ? LIMIT 1`,
            [medicalRecordId]
          );
          if (Array.isArray(surgeryInterestData) && surgeryInterestData.length > 0) {
            const data = surgeryInterestData[0] as Record<string, unknown>;
            const { id, medicalRecordId: _, createdAt: __, updatedAt: ___, ...cleanData } = data;
            chatbotData.surgeryInterest = cleanData;
          }
        } catch (error) {
          console.warn('Error al obtener surgery_interest (tabla puede no existir aún):', error);
        }

        // Obtener medical_history
        try {
          const [medicalHistoryData] = await connection.execute(
            `SELECT * FROM medical_history WHERE medicalRecordId = ? LIMIT 1`,
            [medicalRecordId]
          );
          if (Array.isArray(medicalHistoryData) && medicalHistoryData.length > 0) {
            const data = medicalHistoryData[0] as Record<string, unknown>;
            const { id, medicalRecordId: _, createdAt: __, updatedAt: ___, ...cleanData } = data;
            chatbotData.medicalHistory = cleanData;
          }
        } catch (error) {
          console.warn('Error al obtener medical_history (tabla puede no existir aún):', error);
        }

        // Obtener family_history
        try {
          const [familyHistoryData] = await connection.execute(
            `SELECT * FROM family_history WHERE medicalRecordId = ? LIMIT 1`,
            [medicalRecordId]
          );
          if (Array.isArray(familyHistoryData) && familyHistoryData.length > 0) {
            const data = familyHistoryData[0] as Record<string, unknown>;
            const { id, medicalRecordId: _, createdAt: __, updatedAt: ___, ...cleanData } = data;
            chatbotData.familyHistory = cleanData;
          }
        } catch (error) {
          console.warn('Error al obtener family_history (tabla puede no existir aún):', error);
        }
      }
      
      return {
        ...patient,
        forms: formDataMap,
        chatbotData
      };
    } catch (error) {
      console.error('Error al obtener detalles del paciente:', error);
      throw error;
    }
  }

  /**
   * Crear tabla de asignaciones si no existe
   */
  static async createAssignmentsTable(): Promise<void> {
    const connection = await getConnection();
    
    try {
      // Crear la tabla solo si no existe, sin foreign keys por ahora
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS patient_assignments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          patientId VARCHAR(20) NOT NULL,
          doctorId INT NOT NULL,
          interestArea VARCHAR(100) NOT NULL DEFAULT 'No especificado',
          assignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status ENUM('assigned', 'contacted', 'completed') DEFAULT 'assigned',
          notes TEXT,
          INDEX idx_patientId (patientId),
          INDEX idx_doctorId (doctorId),
          INDEX idx_interestArea (interestArea)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;

      await connection.execute(createTableQuery);
      console.log('✅ Tabla patient_assignments verificada/creada');
      
    } catch (error) {
      console.error('Error al crear/verificar tabla patient_assignments:', error);
      throw error;
    }
  }

  /**
   * Obtener historial de asignaciones
   */
  static async getAssignmentsHistory(): Promise<AssignmentRecord[]> {
    const connection = await getConnection();
    
    try {
      // Asegurar que la tabla existe
      await this.createAssignmentsTable();
      
      const [assignments] = await connection.execute(
        `SELECT 
           pa.id,
           pa.patientId,
           pa.interestArea,
           pa.assignedAt,
           pa.status,
           pa.notes,
           u.firstName as patientFirstName,
           u.lastName as patientLastName,
           u.email as patientEmail,
           d.userId as doctorUserId,
           du.firstName as doctorFirstName,
           du.lastName as doctorLastName,
           du.email as doctorEmail
         FROM patient_assignments pa
         INNER JOIN patient_records pr ON pa.patientId = pr.patientId
         INNER JOIN users u ON pr.userId = u.id
         INNER JOIN doctors d ON pa.doctorId = d.id
         INNER JOIN users du ON d.userId = du.id
         ORDER BY pa.assignedAt DESC`
      );
      
      return assignments as AssignmentRecord[];
    } catch (error) {
      console.error('Error al obtener historial de asignaciones:', error);
      // Si hay error, devolver array vacío
      return [];
    }
  }

  /**
   * Asignar paciente a doctor automáticamente
   */
  static async assignPatientToDoctor(
    patientId: string,
    doctorId: number,
    interestArea: string
  ): Promise<void> {
    const connection = await getConnection();
    
    try {
      console.log('🔍 Iniciando asignación con:', { patientId, doctorId, interestArea });
      
      // Asegurar que la tabla existe
      await this.createAssignmentsTable();
      console.log('✅ Tabla verificada/creada');
      
      // Verificar si ya existe una asignación
      console.log('🔍 Buscando asignación existente para patientId:', patientId);
      const [existing] = await connection.execute(
        'SELECT id FROM patient_assignments WHERE patientId = ?',
        [patientId]
      );
      
      console.log('🔍 Resultado de búsqueda:', existing);
      console.log('🔍 Es array?', Array.isArray(existing));
      console.log('🔍 Longitud:', Array.isArray(existing) ? existing.length : 'N/A');
      
      if (Array.isArray(existing) && existing.length > 0) {
        // Actualizar asignación existente
        console.log('📝 Actualizando asignación existente para patientId:', patientId);
        await connection.execute(
          'UPDATE patient_assignments SET doctorId = ?, interestArea = ?, assignedAt = NOW(), status = "assigned" WHERE patientId = ?',
          [doctorId, interestArea, patientId]
        );
        console.log('✅ Asignación actualizada exitosamente');
      } else {
        // Crear nueva asignación
        console.log('➕ Creando nueva asignación para patientId:', patientId, 'doctorId:', doctorId, 'interestArea:', interestArea);
        const [result] = await connection.execute(
          'INSERT INTO patient_assignments (patientId, doctorId, interestArea, status) VALUES (?, ?, ?, "assigned")',
          [patientId, doctorId, interestArea]
        );
        console.log('✅ Nueva asignación creada exitosamente. Resultado:', result);
        
        // Verificar que se insertó
        const [verification] = await connection.execute(
          'SELECT * FROM patient_assignments WHERE patientId = ?',
          [patientId]
        );
        console.log('🔍 Verificación de inserción:', verification);
      }
    } catch (error) {
      console.error('❌ Error al asignar paciente a doctor:', error);
      throw error;
    }
  }

  /**
   * Obtener doctores por especialidad
   */
  static async getDoctorsBySpecialty(specialty: string): Promise<DoctorRecord[]> {
    const connection = await getConnection();
    
    try {
      const [doctors] = await connection.execute(
        `SELECT d.*, u.firstName, u.lastName, u.email
         FROM doctors d
         INNER JOIN users u ON d.userId = u.id
         WHERE d.specialties LIKE ? AND d.isApproved = true AND d.isActive = true`,
        [`%${specialty}%`]
      );
      
      return doctors as DoctorRecord[];
    } catch (error) {
      console.error('Error al obtener doctores por especialidad:', error);
      return [];
    }
  }

  /**
   * Buscar pacientes según tipo y valor
   */
  static async searchPatients(searchType: string, searchValue: string): Promise<SearchResult[]> {
    const connection = await getConnection();
    
    try {
      let query = '';
      let params: unknown[] = [];

      if (searchType === 'expediente') {
        // Buscar por número de expediente
        query = `
          SELECT 
            u.id,
            COALESCE(pr.patientId, 'Sin ID') as patientId,
            u.firstName,
            u.lastName,
            u.email,
            u.createdAt,
            'No especificado' as interestArea,
            CASE 
              WHEN pr.patientId IS NOT NULL THEN 'in_progress'
              ELSE 'registered'
            END as status
          FROM users u
          LEFT JOIN patient_records pr ON u.id = pr.userId
          WHERE u.role = 'user' 
            AND u.isActive = true 
            AND pr.patientId IS NOT NULL
            AND pr.patientId LIKE ?
          ORDER BY u.createdAt DESC
        `;
        params = [`%${searchValue}%`];
      } else if (searchType === 'nombre') {
        // Buscar por nombre del paciente
        query = `
          SELECT 
            u.id,
            COALESCE(pr.patientId, 'Sin ID') as patientId,
            u.firstName,
            u.lastName,
            u.email,
            u.createdAt,
            'No especificado' as interestArea,
            CASE 
              WHEN pr.patientId IS NOT NULL THEN 'in_progress'
              ELSE 'registered'
            END as status
          FROM users u
          LEFT JOIN patient_records pr ON u.id = pr.userId
          WHERE u.role = 'user' 
            AND u.isActive = true 
            AND (u.firstName LIKE ? OR u.lastName LIKE ?)
          ORDER BY u.createdAt DESC
        `;
        params = [`%${searchValue}%`, `%${searchValue}%`];
      } else if (searchType === 'procedimiento') {
        // Buscar por área de interés/procedimiento - simplificar para evitar errores con JSON
        query = `
          SELECT 
            u.id,
            COALESCE(pr.patientId, 'Sin ID') as patientId,
            u.firstName,
            u.lastName,
            u.email,
            u.createdAt,
            'No especificado' as interestArea,
            CASE 
              WHEN pr.patientId IS NOT NULL THEN 'in_progress'
              ELSE 'registered'
            END as status
          FROM users u
          LEFT JOIN patient_records pr ON u.id = pr.userId
          WHERE u.role = 'user' 
            AND u.isActive = true 
            AND pr.patientId IS NOT NULL
          ORDER BY u.createdAt DESC
        `;
        params = [];
      } else {
        return [];
      }

      const [results] = await connection.execute(query, params);
      
      return results as SearchResult[];
    } catch (error) {
      console.error('Error al buscar pacientes:', error);
      throw error;
    }
  }
}
