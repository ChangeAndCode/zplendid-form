import { NextRequest, NextResponse } from 'next/server';
import { PatientRecordModel } from '../../../../lib/models/PatientRecord';
import { getConnection } from '../../../../lib/config/database';
import { JWTUtils } from '../../../../lib/utils/jwt';
import { AutoSchema } from '../../../../lib/utils/autoSchema';

interface FamilyHistoryData {
  heartDisease: string;
  pulmonaryEdema: string;
  diabetesMellitus: string;
  highBloodPressure: string;
  alcoholism: string;
  liverProblems: string;
  lungProblems: string;
  bleedingDisorder: string;
  gallstones: string;
  mentalIllness: string;
  malignantHyperthermia: string;
  cancer: string;
  otherFamilyConditions: string;
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

    // Obtener datos del historial familiar
    const [familyData] = await connection.execute(
      'SELECT * FROM family_history WHERE medicalRecordId = ?',
      [medicalRecordId]
    );

    if (!Array.isArray(familyData) || familyData.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos de historial familiar guardados'
      });
    }

    // Tipo para los datos de la base de datos (incluye todos los campos posibles)
    type FamilyHistoryDBData = Record<string, string | null | undefined>;
    const data = familyData[0] as FamilyHistoryDBData;

    // Función para mapear valores de la base de datos al formulario
    const mapFormValue = (value: string | null | undefined): string => {
      if (!value || value === 'unknown') return '';
      return value;
    };

    // Mapear DINÁMICAMENTE todos los campos de la base de datos al formato del formulario
    const formData: FamilyHistoryData = {
      heartDisease: mapFormValue(data.heartDisease),
      pulmonaryEdema: mapFormValue(data.pulmonaryEdema),
      diabetesMellitus: mapFormValue(data.diabetesMellitus),
      highBloodPressure: mapFormValue(data.highBloodPressure),
      alcoholism: mapFormValue(data.alcoholism),
      liverProblems: mapFormValue(data.liverProblems),
      lungProblems: mapFormValue(data.lungProblems),
      bleedingDisorder: mapFormValue(data.bleedingDisorder),
      gallstones: mapFormValue(data.gallstones),
      mentalIllness: mapFormValue(data.mentalIllness),
      malignantHyperthermia: mapFormValue(data.malignantHyperthermia),
      cancer: mapFormValue(data.cancer),
      otherFamilyConditions: mapFormValue(data.otherFamilyConditions)
    };

    return NextResponse.json({
      success: true,
      data: formData,
      message: 'Datos cargados correctamente'
    });

  } catch (error) {
    console.error('Error al cargar historial familiar:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Asegurar que todas las columnas necesarias existan (comportamiento tipo Excel)
    await AutoSchema.ensureFamilyHistoryColumns();
    
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
    const formData: FamilyHistoryData = body;

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
            [decoded.userId, patientRecord.patientId, 'family_history', '{}', 0]
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
      mappedData[key] = mapStringValue(formData[key as keyof FamilyHistoryData]);
    });
    
    // Verificar si ya existe un registro para este paciente
    const [existing] = await connection.execute(
      'SELECT id FROM family_history WHERE medicalRecordId = ?',
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
        `UPDATE family_history SET ${setClause}, updatedAt = NOW() WHERE medicalRecordId = ?`,
        [...values, medicalRecordId]
      );
    } else {
      // Crear nuevo registro
      await connection.execute(
        `INSERT INTO family_history (medicalRecordId, ${fields.join(', ')}) VALUES (?, ${placeholders})`,
        [medicalRecordId, ...values]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Datos del historial familiar guardados correctamente',
      patientId: patientRecord.patientId
    }, { status: 200 });

  } catch (error) {
    console.error('Error al guardar formulario de historial familiar:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
