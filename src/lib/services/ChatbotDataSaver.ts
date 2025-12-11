/**
 * Servicio para guardar datos del chatbot en MongoDB
 * Reutiliza la misma estructura de colecciones que el formulario tradicional
 */

import { getCollection } from '../config/database';
import { ObjectId } from 'mongodb';
import { PatientRecordModel } from '../models/PatientRecord';
import { AutoSchema } from '../utils/autoSchema';
import {
  ChatbotDataMapper,
  MappedPatientInfo,
  MappedSurgeryInterest,
  MappedMedicalHistory,
  MappedFamilyHistory,
  ChatbotExtractedData
} from './ChatbotDataMapper';

export interface SaveChatbotDataResult {
  success: boolean;
  message: string;
  patientId?: string;
  medicalRecordId?: number;
  savedTables?: string[];
}

export class ChatbotDataSaver {
  // Whitelist de tablas permitidas para seguridad
  private static readonly ALLOWED_TABLES = [
    'patient_info',
    'surgery_interest',
    'medical_history',
    'family_history'
  ];

  /**
   * Valida que un nombre de tabla esté en la whitelist
   */
  private static validateTableName(tableName: string): boolean {
    return this.ALLOWED_TABLES.includes(tableName);
  }

  /**
   * Valida que un nombre de campo sea seguro (solo letras, números y guiones bajos)
   */
  private static validateFieldName(fieldName: string): boolean {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(fieldName);
  }

  /**
   * Función auxiliar para normalizar valores a string
   * MongoDB manejará automáticamente los límites de longitud de los campos
   */
  private static mapStringValue(value: string | undefined): string {
    if (!value || value === '' || value === 'undefined' || value === 'null') {
      return '';
    }
    const str = String(value);
    // MongoDB no tiene límites de longitud predefinidos
    // No truncamos manualmente para no perder información
    return str;
  }

  /**
   * Guarda datos en una tabla específica
   */
  private static async saveToTable(
    tableName: string,
    medicalRecordId: number,
    data: Record<string, any>,
    ensureColumnsFn?: () => Promise<void>
  ): Promise<boolean> {
    try {
      // Validar nombre de tabla
      if (!this.validateTableName(tableName)) {
        console.error(`Nombre de tabla no permitido: ${tableName}`);
        return false;
      }

      // Asegurar que la colección exista si hay función de ensure
      if (ensureColumnsFn) {
        await ensureColumnsFn();
      }

      const collection = await getCollection(tableName);

      // Normalizar y limpiar datos
      const mappedData: Record<string, any> = {};
      Object.keys(data).forEach(key => {
        if (this.validateFieldName(key)) {
          const value = data[key];
          if (value !== undefined && value !== null) {
            mappedData[key] = this.mapStringValue(value);
          }
        }
      });

      if (Object.keys(mappedData).length === 0) {
        console.warn(`No hay campos válidos para guardar en ${tableName}`);
        return false;
      }

      // Convertir medicalRecordId a ObjectId si es necesario
      const medicalRecordIdValue = typeof medicalRecordId === 'string' && ObjectId.isValid(medicalRecordId)
        ? new ObjectId(medicalRecordId)
        : medicalRecordId;

      // Verificar si ya existe un registro
      const existing = await collection.findOne({ medicalRecordId: medicalRecordIdValue });

      const now = new Date();
      if (existing) {
        // Actualizar registro existente
        await collection.updateOne(
          { medicalRecordId: medicalRecordIdValue },
          {
            $set: { ...mappedData, updatedAt: now }
          }
        );
        console.log(`   ✅ UPDATE ejecutado exitosamente en ${tableName}`);
        return true;
      } else {
        // Crear nuevo registro
        await collection.insertOne({
          medicalRecordId: medicalRecordIdValue,
          ...mappedData,
          createdAt: now,
          updatedAt: now
        });
        console.log(`   ✅ INSERT ejecutado exitosamente en ${tableName}`);
        return true;
      }
    } catch (error) {
      console.error(`Error al guardar en ${tableName}:`, error);
      return false;
    }
  }

  /**
   * Obtiene o crea el medical_record para un usuario
   */
  private static async getOrCreateMedicalRecord(userId: number, patientId: string): Promise<number> {
    try {
      // Validar userId
      if (!userId || (typeof userId !== 'number' && typeof userId !== 'string')) {
        throw new Error('userId inválido');
      }

      const collection = await getCollection('medical_records');
      
      // Convertir userId numérico a ObjectId
      const { getUserIdAsObjectId } = await import('../utils/mongoIdHelper');
      const userIdValue = await getUserIdAsObjectId(userId);
      
      if (!userIdValue) {
        throw new Error('Usuario no encontrado');
      }

      // Buscar registro médico existente
      const existing = await collection.findOne({ userId: userIdValue });

      if (existing) {
        // Retornar id numérico para compatibilidad
        return existing._id ? parseInt(existing._id.toString().slice(-8), 16) : (existing.id || 0);
      }

      // Crear nuevo registro médico
      const now = new Date();
      const newRecord = {
        userId: userIdValue,
        recordNumber: patientId,
        formType: 'chatbot',
        formData: {},
        isCompleted: false,
        createdAt: now,
        updatedAt: now
      };

      const result = await collection.insertOne(newRecord);
      
      if (!result.insertedId) {
        throw new Error('No se pudo obtener el ID del registro médico creado');
      }

      // Retornar id numérico para compatibilidad
      return parseInt(result.insertedId.toString().slice(-8), 16);
    } catch (error) {
      console.error('Error en getOrCreateMedicalRecord:', error);
      throw error;
    }
  }

  /**
   * Guarda todos los datos del chatbot en las colecciones correspondientes
   */
  static async saveChatbotData(
    userId: number,
    extractedData: ChatbotExtractedData
  ): Promise<SaveChatbotDataResult> {
    try {
      // Validar userId
      if (!userId || typeof userId !== 'number' || isNaN(userId)) {
        return {
          success: false,
          message: 'userId inválido'
        };
      }

      // Validar que extractedData sea un objeto
      if (!extractedData || typeof extractedData !== 'object') {
        return {
          success: false,
          message: 'extractedData debe ser un objeto válido'
        };
      }

      // Obtener o crear expediente del paciente
      let patientRecord = await PatientRecordModel.findByUserId(userId);
      if (!patientRecord) {
        patientRecord = await PatientRecordModel.create(userId);
      }

      if (!patientRecord || !patientRecord.patientId) {
        return {
          success: false,
          message: 'No se pudo crear o obtener el expediente del paciente'
        };
      }

      // Obtener o crear registro médico
      const medicalRecordId = await this.getOrCreateMedicalRecord(userId, patientRecord.patientId);
      
      if (!medicalRecordId || isNaN(medicalRecordId)) {
        return {
          success: false,
          message: 'No se pudo crear o obtener el registro médico'
        };
      }

      const savedTables: string[] = [];

      // 1. Mapear y guardar información del paciente
      const patientInfo = ChatbotDataMapper.mapToPatientInfo(extractedData);
      const hasPatientInfo = Object.values(patientInfo).some(v => v && v !== '');
      console.log('🔍 Mapeo patientInfo:', Object.keys(patientInfo).length, 'campos mapeados,', Object.values(patientInfo).filter(v => v && v !== '').length, 'con datos');
      if (hasPatientInfo) {
        // Asegurar que las columnas existan ANTES de intentar guardar
        await AutoSchema.ensurePatientInfoColumns();
        console.log(`💾 Guardando en patient_info (medicalRecordId: ${medicalRecordId})...`);
        const saved = await this.saveToTable(
          'patient_info',
          medicalRecordId,
          patientInfo,
          () => AutoSchema.ensurePatientInfoColumns()
        );
        if (saved) savedTables.push('patient_info');
        console.log('   → patient_info:', saved ? '✅ guardado' : '❌ falló');
      } else {
        console.log('   → patientInfo: ⚠️ sin datos para guardar');
      }

      // 2. Mapear y guardar interés quirúrgico
      const surgeryInterest = ChatbotDataMapper.mapToSurgeryInterest(extractedData);
      const hasSurgeryInterest = Object.values(surgeryInterest).some(v => v && v !== '');
      console.log('🔍 Mapeo surgeryInterest:', Object.keys(surgeryInterest).length, 'campos mapeados,', Object.values(surgeryInterest).filter(v => v && v !== '').length, 'con datos');
      if (hasSurgeryInterest) {
        const surgeryData = surgeryInterest as Record<string, any>;
        console.log('   Campos con datos:', Object.keys(surgeryData).filter(k => surgeryData[k] && surgeryData[k] !== ''));
        // Asegurar que las columnas existan ANTES de intentar guardar
        await AutoSchema.ensureSurgeryInterestColumns();
        console.log(`💾 Guardando en surgery_interest (medicalRecordId: ${medicalRecordId})...`);
        const saved = await this.saveToTable(
          'surgery_interest',
          medicalRecordId,
          surgeryInterest,
          () => AutoSchema.ensureSurgeryInterestColumns()
        );
        if (saved) savedTables.push('surgery_interest');
        console.log('   → surgery_interest:', saved ? '✅ guardado' : '❌ falló');
      } else {
        console.log('   → surgeryInterest: ⚠️ sin datos para guardar');
      }

      // 3. Mapear y guardar historial médico
      const medicalHistory = ChatbotDataMapper.mapToMedicalHistory(extractedData);
      const hasMedicalHistory = Object.values(medicalHistory).some(v => v && v !== '');
      console.log('🔍 Mapeo medicalHistory:', Object.keys(medicalHistory).length, 'campos mapeados,', Object.values(medicalHistory).filter(v => v && v !== '').length, 'con datos');
      if (hasMedicalHistory) {
        const medicalData = medicalHistory as Record<string, any>;
        console.log('   Campos con datos:', Object.keys(medicalData).filter(k => medicalData[k] && medicalData[k] !== '').slice(0, 10));
        // Asegurar que las columnas existan ANTES de intentar guardar
        await AutoSchema.ensureMedicalHistoryColumns();
        console.log(`💾 Guardando en medical_history (medicalRecordId: ${medicalRecordId})...`);
        const saved = await this.saveToTable(
          'medical_history',
          medicalRecordId,
          medicalHistory,
          () => AutoSchema.ensureMedicalHistoryColumns()
        );
        if (saved) savedTables.push('medical_history');
        console.log('   → medical_history:', saved ? '✅ guardado' : '❌ falló');
      } else {
        console.log('   → medicalHistory: ⚠️ sin datos para guardar');
      }

      // 4. Mapear y guardar historial familiar
      const familyHistory = ChatbotDataMapper.mapToFamilyHistory(extractedData);
      const hasFamilyHistory = Object.values(familyHistory).some(v => v && v !== '');
      console.log('🔍 Mapeo familyHistory:', Object.keys(familyHistory).length, 'campos mapeados,', Object.values(familyHistory).filter(v => v && v !== '').length, 'con datos');
      if (hasFamilyHistory) {
        const familyData = familyHistory as Record<string, any>;
        console.log('   Campos con datos:', Object.keys(familyData).filter(k => familyData[k] && familyData[k] !== ''));
        // Asegurar que las columnas existan ANTES de intentar guardar
        await AutoSchema.ensureFamilyHistoryColumns();
        console.log(`💾 Guardando en family_history (medicalRecordId: ${medicalRecordId})...`);
        const saved = await this.saveToTable(
          'family_history',
          medicalRecordId,
          familyHistory,
          () => AutoSchema.ensureFamilyHistoryColumns()
        );
        if (saved) savedTables.push('family_history');
        console.log('   → family_history:', saved ? '✅ guardado' : '❌ falló');
      } else {
        console.log('   → familyHistory: ⚠️ sin datos para guardar');
      }

      return {
        success: true,
        message: 'Datos del chatbot guardados correctamente',
        patientId: patientRecord.patientId,
        medicalRecordId,
        savedTables
      };
    } catch (error) {
      console.error('Error al guardar datos del chatbot:', error);
      return {
        success: false,
        message: `Error al guardar datos: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }

  /**
   * Guarda datos del chatbot desde una sesión de chat
   */
  static async saveFromChatSession(
    userId: number,
    sessionId: string,
    chatSessionService: any
  ): Promise<SaveChatbotDataResult> {
    try {
      // Obtener sesión del chat
      const session = await chatSessionService.getSession(sessionId);
      if (!session) {
        return {
          success: false,
          message: 'Sesión de chat no encontrada'
        };
      }

      // Obtener datos extraídos
      const extractedData = session.extractedData || {};

      // Guardar usando el método principal
      return await this.saveChatbotData(userId, extractedData);
    } catch (error) {
      console.error('Error al guardar desde sesión de chat:', error);
      return {
        success: false,
        message: `Error al guardar desde sesión: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
}

