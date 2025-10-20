import { NextRequest, NextResponse } from 'next/server';
import { PatientRecordModel } from '../../../../lib/models/PatientRecord';
import { getConnection } from '../../../../lib/config/database';
import { JWTUtils } from '../../../../lib/utils/jwt';
import { AutoSchema } from '../../../../lib/utils/autoSchema';

interface PatientInfoData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: string;
  gender: string;
  addressLine: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
  phoneNumber: string;
  email: string;
  preferredContact: string;
  occupation: string;
  employer: string;
  education: string;
  emergencyFirstName: string;
  emergencyLastName: string;
  emergencyRelationship: string;
  emergencyPhone: string;
  // BMI
  measurementSystem: 'standard' | 'metric';
  heightFeet: string;
  heightInches: string;
  heightCm: string;
  weightLbs: string;
  weightKg: string;
  bmi: string;
  // How did you hear about us
  hearAboutUs: string;
  hearAboutUsOther: string;
  // Insurance
  hasInsurance: string;
  insuranceProvider: string;
  policyNumber: string;
  groupNumber: string;
  // Additional info
  additionalInfo: string;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = JWTUtils.extractTokenFromHeader(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    const decoded = JWTUtils.verifyToken(token);
    
    // Obtener el expediente del paciente
    const patientRecord = await PatientRecordModel.findByUserId(decoded.userId);
    if (!patientRecord) {
      return NextResponse.json(
        { success: false, message: 'No se encontró expediente del paciente' },
        { status: 404 }
      );
    }

    // Buscar registro médico
    const connection = await getConnection();
    const [medicalRecords] = await connection.execute(
      'SELECT id FROM medical_records WHERE userId = ? LIMIT 1',
      [decoded.userId]
    );
    
    if (!Array.isArray(medicalRecords) || medicalRecords.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos guardados'
      });
    }

    const medicalRecordId = (medicalRecords[0] as { id: number }).id;

    // Obtener datos del formulario desde patient_info
    const [patientData] = await connection.execute(
      'SELECT * FROM patient_info WHERE medicalRecordId = ?',
      [medicalRecordId]
    );

    if (!Array.isArray(patientData) || patientData.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos de información del paciente guardados'
      });
    }

    // Tipo para los datos de la base de datos (incluye todos los campos posibles)
    type PatientInfoDBData = Record<string, string | null | undefined>;
    const data = patientData[0] as PatientInfoDBData;

    // Función para mapear valores de la base de datos al formulario
    const mapFormValue = (value: string | null | undefined): string => {
      if (!value || value === 'unknown') return '';
      return value;
    };

    // Mapear DINÁMICAMENTE todos los campos de la base de datos al formato del formulario
    const formData: PatientInfoData = {
      firstName: mapFormValue(data.firstName),
      lastName: mapFormValue(data.lastName),
      dateOfBirth: mapFormValue(data.dateOfBirth),
      age: mapFormValue(data.age),
      gender: mapFormValue(data.gender),
      addressLine: mapFormValue(data.addressLine),
      city: mapFormValue(data.city),
      country: mapFormValue(data.country),
      state: mapFormValue(data.state),
      zipcode: mapFormValue(data.zipcode),
      phoneNumber: mapFormValue(data.phoneNumber),
      email: mapFormValue(data.email),
      preferredContact: mapFormValue(data.preferredContact),
      occupation: mapFormValue(data.occupation),
      employer: mapFormValue(data.employer),
      education: mapFormValue(data.education),
      emergencyFirstName: mapFormValue(data.emergencyFirstName),
      emergencyLastName: mapFormValue(data.emergencyLastName),
      emergencyRelationship: mapFormValue(data.emergencyRelationship),
      emergencyPhone: mapFormValue(data.emergencyPhone),
      measurementSystem: (data.measurementSystem as 'standard' | 'metric') || 'standard',
      heightFeet: mapFormValue(data.heightFeet),
      heightInches: mapFormValue(data.heightInches),
      heightCm: mapFormValue(data.heightCm),
      weightLbs: mapFormValue(data.weightLbs),
      weightKg: mapFormValue(data.weightKg),
      bmi: mapFormValue(data.bmi),
      hearAboutUs: mapFormValue(data.hearAboutUs),
      hearAboutUsOther: mapFormValue(data.hearAboutUsOther),
      hasInsurance: mapFormValue(data.hasInsurance),
      insuranceProvider: mapFormValue(data.insuranceProvider),
      policyNumber: mapFormValue(data.policyNumber),
      groupNumber: mapFormValue(data.groupNumber),
      additionalInfo: mapFormValue(data.additionalInfo)
    };

    return NextResponse.json({
      success: true,
      data: formData,
      message: 'Datos cargados correctamente'
    });

  } catch (error) {
    console.error('Error al cargar datos del paciente:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Asegurar que todas las columnas necesarias existan (comportamiento tipo Excel)
    await AutoSchema.ensurePatientInfoColumns();
    
    const authHeader = request.headers.get('authorization');
    const token = JWTUtils.extractTokenFromHeader(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    const decoded = JWTUtils.verifyToken(token);
    const body = await request.json();
    const formData: PatientInfoData = body;

    // Obtener el expediente del paciente
    let patientRecord = await PatientRecordModel.findByUserId(decoded.userId);
    if (!patientRecord) {
      // Si no existe, crear uno nuevo
      patientRecord = await PatientRecordModel.create(decoded.userId);
    }

    // Buscar o crear registro médico
    const connection = await getConnection();
    const [medicalRecords] = await connection.execute(
      'SELECT id FROM medical_records WHERE userId = ? LIMIT 1',
      [decoded.userId]
    );
    
    let medicalRecordId: number;
    if (Array.isArray(medicalRecords) && medicalRecords.length > 0) {
      medicalRecordId = (medicalRecords[0] as { id: number }).id;
    } else {
      // Crear registro médico
      const [result] = await connection.execute(
        `INSERT INTO medical_records 
         (userId, recordNumber, formType, formData, isCompleted, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [decoded.userId, patientRecord.patientId, 'patient_info', '{}', 0]
      );
      const insertResult = result as { insertId: number };
      medicalRecordId = insertResult.insertId;
    }

    // Guardar los datos del formulario en la tabla específica
    // Función para asegurar que todos los valores sean strings
    const mapStringValue = (value: string): string => {
      // Si está vacío, undefined, null, o no es string, devolver string vacío
      if (!value || value === '' || value === 'undefined' || value === 'null') {
        return '';
      }
      // Devolver el valor como string
      return String(value);
    };

    // Mapear DINÁMICAMENTE todos los campos del formulario
    const mappedData: Record<string, string> = {};
    
    // Mapear todos los campos del formulario automáticamente
    Object.keys(formData).forEach(key => {
      mappedData[key] = mapStringValue(formData[key as keyof PatientInfoData]);
    });
    
    // Verificar si ya existe un registro para este paciente
    const [existing] = await connection.execute(
      'SELECT id FROM patient_info WHERE medicalRecordId = ?',
      [medicalRecordId]
    );

    // Crear consultas SQL dinámicamente
    const fields = Object.keys(mappedData);
    const placeholders = fields.map(() => '?').join(', ');
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const values = fields.map(field => mappedData[field]);

    if (Array.isArray(existing) && existing.length > 0) {
      // Actualizar registro existente
      await connection.execute(
        `UPDATE patient_info SET ${setClause}, updatedAt = NOW() WHERE medicalRecordId = ?`,
        [...values, medicalRecordId]
      );
    } else {
      // Crear nuevo registro
      await connection.execute(
        `INSERT INTO patient_info (medicalRecordId, ${fields.join(', ')}) VALUES (?, ${placeholders})`,
        [medicalRecordId, ...values]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Datos del formulario guardados correctamente',
      patientId: patientRecord.patientId
    }, { status: 200 });

  } catch (error) {
    console.error('Error al guardar formulario de paciente:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
