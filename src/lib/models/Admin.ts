import { getCollection, getDatabase } from '../config/database';
import { ObjectId } from 'mongodb';
import { getUserIdAsObjectId } from '../utils/mongoIdHelper';

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
    try {
      const usersCollection = await getCollection('users');
      const doctorsCollection = await getCollection('doctors');
      const assignmentsCollection = await getCollection('patient_assignments');
      
      // Total de pacientes (usuarios con rol 'user')
      const totalPatients = await usersCollection.countDocuments({ 
        role: 'user', 
        isActive: true 
      });
      
      // Doctores activos
      const activeDoctors = await doctorsCollection.countDocuments({ 
        isApproved: true 
      });
      
      // Solicitudes pendientes
      const pendingRequests = await doctorsCollection.countDocuments({ 
        isApproved: false 
      });
      
      // Asignaciones de hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todaysAssignments = await assignmentsCollection.countDocuments({
        assignedAt: { $gte: today }
      });
      
      return {
        totalPatients,
        activeDoctors,
        pendingRequests,
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
    try {
      const db = await getDatabase();
      
      const patients = await db.collection('users').aggregate([
        { $match: { role: 'user', isActive: true } },
        {
          $lookup: {
            from: 'patient_records',
            localField: '_id',
            foreignField: 'userId',
            as: 'patientRecord'
          }
        },
        {
          $project: {
            id: { 
              $ifNull: [
                { 
                  $toInt: { 
                    $substr: [
                      { $toString: '$_id' }, 
                      { $subtract: [{ $strLenCP: { $toString: '$_id' } }, 8] }, 
                      8
                    ] 
                  } 
                }, 
                0
              ] 
            },
            patientId: { $ifNull: [{ $arrayElemAt: ['$patientRecord.patientId', 0] }, 'Sin ID'] },
            firstName: 1,
            lastName: 1,
            email: 1,
            createdAt: 1,
            interestArea: 'No especificado',
            status: {
              $cond: {
                if: { $gt: [{ $size: '$patientRecord' }, 0] },
                then: 'in_progress',
                else: 'registered'
              }
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ]).toArray();
      
      return patients.map((p: any) => ({
        id: p._id ? parseInt(p._id.toString().slice(-8), 16) : (p.id || 0),
        patientId: p.patientId || '',
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        interestArea: p.interestArea || 'No especificado',
        status: (p.status as 'complete' | 'in_progress' | 'assigned') || 'registered',
        createdAt: p.createdAt
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
    try {
      const db = await getDatabase();
      
      const doctors = await db.collection('doctors').aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            id: { 
              $ifNull: [
                { 
                  $toInt: { 
                    $substr: [
                      { $toString: '$_id' }, 
                      { $subtract: [{ $strLenCP: { $toString: '$_id' } }, 8] }, 
                      8
                    ] 
                  } 
                }, 
                0
              ] 
            },
            userId: 1,
            licenseNumber: 1,
            specialties: 1,
            isActive: 1,
            isApproved: 1,
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            email: '$user.email',
            createdAt: 1,
            status: {
              $cond: {
                if: '$isApproved',
                then: 'approved',
                else: 'pending'
              }
            }
          }
        },
        { $sort: { createdAt: -1 } }
      ]).toArray();
      
      return doctors.map((doctor: any) => {
        let specialtyText = 'Sin especialidades';
        try {
          const specialties = typeof doctor.specialties === 'string' 
            ? JSON.parse(doctor.specialties) 
            : doctor.specialties;
          
          if (Array.isArray(specialties) && specialties.length > 0) {
            specialtyText = specialties.join(', ');
          } else if (doctor.specialties) {
            specialtyText = String(doctor.specialties);
          }
        } catch {
          specialtyText = doctor.specialties || 'Sin especialidades';
        }

        return {
          id: doctor._id ? parseInt(doctor._id.toString().slice(-8), 16) : (doctor.id || 0),
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
    const collection = await getCollection('doctors');
    
    try {
      // Buscar doctor por id numérico
      const doctors = await collection.find({}).toArray();
      const doctor = doctors.find((d: any) => {
        if (d._id) {
          const numericId = parseInt(d._id.toString().slice(-8), 16);
          return numericId === doctorId;
        }
        return (d as any).id === doctorId;
      });
      
      if (doctor && doctor._id) {
        await collection.updateOne(
          { _id: doctor._id },
          { $set: { isApproved: true, updatedAt: new Date() } }
        );
      }
    } catch (error) {
      console.error('Error al aprobar doctor:', error);
      throw error;
    }
  }

  /**
   * Rechazar un doctor
   */
  static async rejectDoctor(doctorId: number): Promise<void> {
    const collection = await getCollection('doctors');
    
    try {
      // Buscar doctor por id numérico
      const doctors = await collection.find({}).toArray();
      const doctor = doctors.find((d: any) => {
        if (d._id) {
          const numericId = parseInt(d._id.toString().slice(-8), 16);
          return numericId === doctorId;
        }
        return (d as any).id === doctorId;
      });
      
      if (doctor && doctor._id) {
        await collection.updateOne(
          { _id: doctor._id },
          { $set: { isApproved: false, updatedAt: new Date() } }
        );
      }
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
    try {
      const db = await getDatabase();
      
      // Obtener información básica del paciente
      const patientRecords = await db.collection('patient_records').aggregate([
        { $match: { patientId } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        { $match: { 'user.role': 'user' } }
      ]).toArray();
      
      if (!patientRecords || patientRecords.length === 0) {
        return null;
      }
      
      const pr = patientRecords[0] as any;
      const patient: PatientRecord = {
        id: pr._id ? parseInt(pr._id.toString().slice(-8), 16) : pr.id,
        patientId: pr.patientId,
        userId: pr.userId instanceof ObjectId ? parseInt(pr.userId.toString().slice(-8), 16) : pr.userId,
        createdAt: pr.createdAt,
        updatedAt: pr.updatedAt
      };
      
      // Obtener datos de formularios tradicionales
      const formDataCollection = await getCollection('patient_form_data');
      const forms = await formDataCollection.find({ patientId }).toArray();
      const formDataMap: Record<string, Record<string, unknown>> = {};
      
      forms.forEach((form: any) => {
        formDataMap[form.formType] = form.formData;
      });

      // Obtener datos del chatbot desde las colecciones estructuradas
      const chatbotData: {
        patientInfo?: Record<string, unknown>;
        surgeryInterest?: Record<string, unknown>;
        medicalHistory?: Record<string, unknown>;
        familyHistory?: Record<string, unknown>;
      } = {};

      // Obtener medicalRecordId
      const medicalRecords = await db.collection('medical_records')
        .find({ recordNumber: patientId })
        .limit(1)
        .toArray();

      if (medicalRecords && medicalRecords.length > 0) {
        const medicalRecordId = medicalRecords[0]._id;

        // Obtener datos de las colecciones dinámicas
        const collections = ['patient_info', 'surgery_interest', 'medical_history', 'family_history'];
        const dataKeys = ['patientInfo', 'surgeryInterest', 'medicalHistory', 'familyHistory'];
        
        for (let i = 0; i < collections.length; i++) {
          try {
            const collection = await getCollection(collections[i]);
            const data = await collection.findOne({ medicalRecordId });
            if (data) {
              const { _id, medicalRecordId: _, createdAt, updatedAt, ...cleanData } = data as any;
              (chatbotData as any)[dataKeys[i]] = cleanData;
            }
          } catch (error) {
            console.warn(`Error al obtener ${collections[i]}:`, error);
          }
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
   * Crear índices de asignaciones (equivalente a createTable)
   */
  static async createAssignmentsTable(): Promise<void> {
    const collection = await getCollection('patient_assignments');
    await collection.createIndex({ patientId: 1 });
    await collection.createIndex({ doctorId: 1 });
    await collection.createIndex({ interestArea: 1 });
    console.log('✅ Índices de patient_assignments verificados/creados');
  }

  /**
   * Obtener historial de asignaciones
   */
  static async getAssignmentsHistory(): Promise<AssignmentRecord[]> {
    try {
      await this.createAssignmentsTable();
      const db = await getDatabase();
      
      const assignments = await db.collection('patient_assignments').aggregate([
        {
          $lookup: {
            from: 'patient_records',
            localField: 'patientId',
            foreignField: 'patientId',
            as: 'patientRecord'
          }
        },
        { $unwind: '$patientRecord' },
        {
          $lookup: {
            from: 'users',
            localField: 'patientRecord.userId',
            foreignField: '_id',
            as: 'patientUser'
          }
        },
        { $unwind: '$patientUser' },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctorId',
            foreignField: '_id',
            as: 'doctor'
          }
        },
        { $unwind: '$doctor' },
        {
          $lookup: {
            from: 'users',
            localField: 'doctor.userId',
            foreignField: '_id',
            as: 'doctorUser'
          }
        },
        { $unwind: '$doctorUser' },
        {
          $project: {
            id: { 
              $ifNull: [
                { 
                  $toInt: { 
                    $substr: [
                      { $toString: '$_id' }, 
                      { $subtract: [{ $strLenCP: { $toString: '$_id' } }, 8] }, 
                      8
                    ] 
                  } 
                }, 
                0
              ] 
            },
            patientId: 1,
            interestArea: 1,
            assignedAt: 1,
            status: 1,
            notes: 1,
            patientFirstName: '$patientUser.firstName',
            patientLastName: '$patientUser.lastName',
            patientEmail: '$patientUser.email',
            doctorUserId: '$doctor.userId',
            doctorFirstName: '$doctorUser.firstName',
            doctorLastName: '$doctorUser.lastName',
            doctorEmail: '$doctorUser.email'
          }
        },
        { $sort: { assignedAt: -1 } }
      ]).toArray();
      
      return assignments as AssignmentRecord[];
    } catch (error) {
      console.error('Error al obtener historial de asignaciones:', error);
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
    const collection = await getCollection('patient_assignments');
    
    try {
      await this.createAssignmentsTable();
      
      // Convertir doctorId numérico a ObjectId
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
      
      const doctorIdValue = doctor._id;
      const existing = await collection.findOne({ patientId });
      
      if (existing) {
        await collection.updateOne(
          { patientId },
          {
            $set: {
              doctorId: doctorIdValue,
              interestArea,
              status: 'assigned',
              assignedAt: new Date()
            }
          }
        );
      } else {
        await collection.insertOne({
          patientId,
          doctorId: doctorIdValue,
          interestArea,
          status: 'assigned',
          assignedAt: new Date(),
          notes: null
        });
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
    try {
      const db = await getDatabase();
      
      const doctors = await db.collection('doctors').aggregate([
        {
          $match: {
            isApproved: true,
            isActive: true,
            $or: [
              { specialties: { $regex: specialty, $options: 'i' } },
              { specialties: { $elemMatch: { $regex: specialty, $options: 'i' } } }
            ]
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 1,
            id: { 
              $ifNull: [
                { 
                  $toInt: { 
                    $substr: [
                      { $toString: '$_id' }, 
                      { $subtract: [{ $strLenCP: { $toString: '$_id' } }, 8] }, 
                      8
                    ] 
                  } 
                }, 
                0
              ] 
            },
            userId: 1,
            licenseNumber: 1,
            specialties: 1,
            isActive: 1,
            isApproved: 1,
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            email: '$user.email'
          }
        }
      ]).toArray();
      
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
    try {
      const db = await getDatabase();
      
      let matchStage: any = {
        role: 'user',
        isActive: true
      };

      if (searchType === 'expediente') {
        // Buscar por número de expediente - necesitamos buscar en patient_records primero
        const patientRecords = await db.collection('patient_records')
          .find({ patientId: { $regex: searchValue, $options: 'i' } })
          .toArray();
        
        if (patientRecords.length === 0) return [];
        
        const userIds = patientRecords.map(pr => pr.userId);
        matchStage._id = { $in: userIds };
      } else if (searchType === 'nombre') {
        // Buscar por nombre
        matchStage.$or = [
          { firstName: { $regex: searchValue, $options: 'i' } },
          { lastName: { $regex: searchValue, $options: 'i' } }
        ];
      } else if (searchType === 'procedimiento') {
        // Buscar pacientes con expediente (todos los que tienen patient_records)
        const patientRecords = await db.collection('patient_records').find({}).toArray();
        if (patientRecords.length === 0) return [];
        const userIds = patientRecords.map(pr => pr.userId);
        matchStage._id = { $in: userIds };
      } else {
        return [];
      }

      const results = await db.collection('users').aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: 'patient_records',
            localField: '_id',
            foreignField: 'userId',
            as: 'patientRecord'
          }
        },
        {
          $project: {
            id: { 
              $ifNull: [
                { 
                  $toInt: { 
                    $substr: [
                      { $toString: '$_id' }, 
                      { $subtract: [{ $strLenCP: { $toString: '$_id' } }, 8] }, 
                      8
                    ] 
                  } 
                }, 
                0
              ] 
            },
            patientId: { $ifNull: [{ $arrayElemAt: ['$patientRecord.patientId', 0] }, 'Sin ID'] },
            firstName: 1,
            lastName: 1,
            email: 1,
            createdAt: 1,
            interestArea: 'No especificado'
          }
        },
        { $sort: { createdAt: -1 } }
      ]).toArray();
      
      return results as SearchResult[];
    } catch (error) {
      console.error('Error al buscar pacientes:', error);
      throw error;
    }
  }
}
