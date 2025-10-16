import { NextRequest, NextResponse } from 'next/server';
import { PatientRecordModel } from '../../../../lib/models/PatientRecord';
import { getConnection } from '../../../../lib/config/database';
import { JWTUtils } from '../../../../lib/utils/jwt';

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

    const data = familyData[0] as {
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
    };
    
    // Mapear los datos de la base de datos al formato del formulario
    const formData = {
      heartDisease: data.heartDisease || '',
      pulmonaryEdema: data.pulmonaryEdema || '',
      diabetesMellitus: data.diabetesMellitus || '',
      highBloodPressure: data.highBloodPressure || '',
      alcoholism: data.alcoholism || '',
      liverProblems: data.liverProblems || '',
      lungProblems: data.lungProblems || '',
      bleedingDisorder: data.bleedingDisorder || '',
      gallstones: data.gallstones || '',
      mentalIllness: data.mentalIllness || '',
      malignantHyperthermia: data.malignantHyperthermia || '',
      cancer: data.cancer || '',
      otherFamilyConditions: data.otherFamilyConditions || ''
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
    console.log('🔍 Recibiendo petición para guardar formulario de historial familiar...');
    
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
    console.log('🔍 Guardando datos de historial familiar...');
    
    // Los datos del formulario ya están en el formato correcto
    const formDataToSave = {
      heartDisease: formData.heartDisease || 'unknown',
      pulmonaryEdema: formData.pulmonaryEdema || 'unknown',
      diabetesMellitus: formData.diabetesMellitus || 'unknown',
      highBloodPressure: formData.highBloodPressure || 'unknown',
      alcoholism: formData.alcoholism || 'unknown',
      liverProblems: formData.liverProblems || 'unknown',
      lungProblems: formData.lungProblems || 'unknown',
      bleedingDisorder: formData.bleedingDisorder || 'unknown',
      gallstones: formData.gallstones || 'unknown',
      mentalIllness: formData.mentalIllness || 'unknown',
      malignantHyperthermia: formData.malignantHyperthermia || 'unknown',
      cancer: formData.cancer || 'unknown',
      otherFamilyConditions: formData.otherFamilyConditions || ''
    };
    
    // Verificar si ya existe un registro para este paciente
    const [existing] = await connection.execute(
      'SELECT id FROM family_history WHERE medicalRecordId = ?',
      [medicalRecordId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Actualizar registro existente
      await connection.execute(
        `UPDATE family_history SET 
         heartDisease = ?, pulmonaryEdema = ?, diabetesMellitus = ?, 
         highBloodPressure = ?, alcoholism = ?, liverProblems = ?, 
         lungProblems = ?, bleedingDisorder = ?, gallstones = ?, 
         mentalIllness = ?, malignantHyperthermia = ?, cancer = ?, 
         otherFamilyConditions = ?, updatedAt = NOW() 
         WHERE medicalRecordId = ?`,
        [
          formDataToSave.heartDisease, formDataToSave.pulmonaryEdema, formDataToSave.diabetesMellitus,
          formDataToSave.highBloodPressure, formDataToSave.alcoholism, formDataToSave.liverProblems,
          formDataToSave.lungProblems, formDataToSave.bleedingDisorder, formDataToSave.gallstones,
          formDataToSave.mentalIllness, formDataToSave.malignantHyperthermia, formDataToSave.cancer,
          formDataToSave.otherFamilyConditions, medicalRecordId
        ]
      );
      console.log(`✅ Datos de historial familiar actualizados para paciente ${patientRecord.patientId}`);
    } else {
      // Crear nuevo registro
      await connection.execute(
        `INSERT INTO family_history 
         (medicalRecordId, heartDisease, pulmonaryEdema, diabetesMellitus, 
          highBloodPressure, alcoholism, liverProblems, lungProblems, 
          bleedingDisorder, gallstones, mentalIllness, malignantHyperthermia, 
          cancer, otherFamilyConditions, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          medicalRecordId, formDataToSave.heartDisease, formDataToSave.pulmonaryEdema, formDataToSave.diabetesMellitus,
          formDataToSave.highBloodPressure, formDataToSave.alcoholism, formDataToSave.liverProblems,
          formDataToSave.lungProblems, formDataToSave.bleedingDisorder, formDataToSave.gallstones,
          formDataToSave.mentalIllness, formDataToSave.malignantHyperthermia, formDataToSave.cancer,
          formDataToSave.otherFamilyConditions
        ]
      );
      console.log(`✅ Datos de historial familiar guardados para paciente ${patientRecord.patientId}`);
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
