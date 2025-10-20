import { NextRequest, NextResponse } from 'next/server';
import { PatientRecordModel } from '../../../../lib/models/PatientRecord';
import { getConnection } from '../../../../lib/config/database';
import { JWTUtils } from '../../../../lib/utils/jwt';
import { AutoSchema } from '../../../../lib/utils/autoSchema';

interface MedicalHistoryData {
  // Past Medical History
  sleepApnea: string;
  useCpap: string;
  cpapDetails: string;
  diabetes: string;
  useInsulin: string;
  
  // Other Conditions
  otherMedicalConditions: string;
  
  // Heart Problems
  highBloodPressure: string;
  heartProblems: string;
  
  // Respiratory
  respiratoryProblems: string;
  respiratoryProblemsDetails: string;
  
  // Other Systems
  urinaryConditions: string;
  urinaryConditionsDetails: string;
  muscularConditions: string;
  muscularConditionsDetails: string;
  neurologicalConditions: string;
  neurologicalConditionsDetails: string;
  bloodDisorders: string;
  bloodDisordersDetails: string;
  endocrineCondition: string;
  endocrineConditionDetails: string;
  gastrointestinalConditions: string;
  headNeckConditions: string;
  skinConditions: string;
  constitutionalSymptoms: string;
  
  // Infectious Diseases
  hepatitis: string;
  hiv: string;
  refuseBlood: string;
  
  // Psychiatric
  psychiatricHospital: string;
  attemptedSuicide: string;
  depression: string;
  anxiety: string;
  eatingDisorders: string;
  psychiatricMedications: string;
  psychiatricTherapy: string;
  psychiatricHospitalization: string;
  
  // Social History
  tobacco: string;
  tobaccoDetails: string;
  alcohol: string;
  alcoholDetails: string;
  drugs: string;
  drugsDetails: string;
  caffeine: string;
  diet: string;
  otherSubstances: string;
  
  // Medications & Allergies
  medications: string;
  allergies: string;
  
  // Past Surgical History
  previousSurgeries: string;
  surgicalComplications: string;
  
  // Diet Program
  dietProgram: string;
  
  // Only for Women
  pregnancy: string;
  pregnancyDetails: string;
  
  // Referral
  referral: string;
  referralDetails: string;
  
  // Other
  otherConditions: string;
  hospitalizations: string;
  hospitalizationsDetails: string;
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

    // Obtener datos del historial médico
    const [medicalData] = await connection.execute(
      'SELECT * FROM medical_history WHERE medicalRecordId = ?',
      [medicalRecordId]
    );

    if (!Array.isArray(medicalData) || medicalData.length === 0) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos de historial médico guardados'
      });
    }

    // Tipo para los datos de la base de datos (incluye todos los campos posibles)
    type MedicalHistoryDBData = Record<string, string | null | undefined>;
    const data = medicalData[0] as MedicalHistoryDBData;
    
        // Función para mapear valores ENUM de la base de datos al formulario
        const mapFormValue = (value: string | null | undefined): string => {
          if (!value || value === 'unknown') return '';
          return value;
        };

        // Mapear DINÁMICAMENTE todos los campos de la base de datos al formato del formulario
        const formData: MedicalHistoryData = {
          // Past Medical History
          sleepApnea: mapFormValue(data.sleepApnea),
          useCpap: mapFormValue(data.useCpap),
          cpapDetails: data.cpapDetails || '',
          diabetes: mapFormValue(data.diabetes),
          useInsulin: mapFormValue(data.useInsulin),
          otherMedicalConditions: data.otherMedicalConditions || '',
          
          // Heart Problems
          highBloodPressure: mapFormValue(data.highBloodPressure),
          heartProblems: mapFormValue(data.heartProblems),

          // Respiratory
          respiratoryProblems: mapFormValue(data.respiratoryProblems),
          respiratoryProblemsDetails: data.respiratoryProblemsDetails || '',

          // Other Systems
          urinaryConditions: mapFormValue(data.urinaryConditions),
          urinaryConditionsDetails: data.urinaryConditionsDetails || '',
          muscularConditions: mapFormValue(data.muscularConditions),
          muscularConditionsDetails: data.muscularConditionsDetails || '',
          neurologicalConditions: mapFormValue(data.neurologicalConditions),
          neurologicalConditionsDetails: data.neurologicalConditionsDetails || '',
          bloodDisorders: mapFormValue(data.bloodDisorders),
          bloodDisordersDetails: data.bloodDisordersDetails || '',
          endocrineCondition: mapFormValue(data.endocrineCondition),
          endocrineConditionDetails: data.endocrineConditionDetails || '',
          gastrointestinalConditions: mapFormValue(data.gastrointestinalConditions),
          headNeckConditions: mapFormValue(data.headNeckConditions),
          skinConditions: mapFormValue(data.skinConditions),
          constitutionalSymptoms: mapFormValue(data.constitutionalSymptoms),

          // Infectious Diseases
          hepatitis: mapFormValue(data.hepatitis),
          hiv: mapFormValue(data.hiv),
          refuseBlood: mapFormValue(data.refuseBlood),

          // Psychiatric
          psychiatricHospital: mapFormValue(data.psychiatricHospital),
          attemptedSuicide: mapFormValue(data.attemptedSuicide),
          depression: mapFormValue(data.depression),
          anxiety: mapFormValue(data.anxiety),
          eatingDisorders: mapFormValue(data.eatingDisorders),
          psychiatricMedications: data.psychiatricMedications || '',
          psychiatricTherapy: mapFormValue(data.psychiatricTherapy),
          psychiatricHospitalization: mapFormValue(data.psychiatricHospitalization),

          // Social History
          tobacco: mapFormValue(data.tobacco),
          tobaccoDetails: data.tobaccoDetails || '',
          alcohol: mapFormValue(data.alcohol),
          alcoholDetails: data.alcoholDetails || '',
          drugs: mapFormValue(data.drugs),
          drugsDetails: data.drugsDetails || '',
          caffeine: mapFormValue(data.caffeine),
          diet: data.diet || '',
          otherSubstances: data.otherSubstances || '',

          // Medications & Allergies
          medications: data.medications || '',
          allergies: data.allergies || '',

          // Past Surgical History
          previousSurgeries: data.previousSurgeries || '',
          surgicalComplications: data.surgicalComplications || '',

          // Diet Program
          dietProgram: data.dietProgram || '',

          // Only for Women
          pregnancy: mapFormValue(data.pregnancy),
          pregnancyDetails: data.pregnancyDetails || '',

          // Referral
          referral: data.referral || '',
          referralDetails: data.referralDetails || '',

          // Other
          otherConditions: data.otherConditions || '',
          hospitalizations: mapFormValue(data.hospitalizations),
          hospitalizationsDetails: data.hospitalizationsDetails || ''
        };

    return NextResponse.json({
      success: true,
      data: formData,
      message: 'Datos cargados correctamente'
    });

  } catch (error) {
    console.error('Error al cargar historial médico:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Asegurar que todas las columnas necesarias existan (comportamiento tipo Excel)
    await AutoSchema.ensureMedicalHistoryColumns();
    
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
    const formData: MedicalHistoryData = body;

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
        [decoded.userId, patientRecord.patientId, 'medical_history', '{}', 0]
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
      mappedData[key] = mapStringValue(formData[key as keyof MedicalHistoryData]);
    });
    
    // Verificar si ya existe un registro para este paciente
    const [existing] = await connection.execute(
      'SELECT id FROM medical_history WHERE medicalRecordId = ?',
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
        `UPDATE medical_history SET ${setClause}, updatedAt = NOW() WHERE medicalRecordId = ?`,
        [...values, medicalRecordId]
      );
    } else {
      // Crear nuevo registro
      await connection.execute(
        `INSERT INTO medical_history (medicalRecordId, ${fields.join(', ')}) VALUES (?, ${placeholders})`,
        [medicalRecordId, ...values]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Datos del historial médico guardados correctamente',
      patientId: patientRecord.patientId
    }, { status: 200 });

  } catch (error) {
    console.error('Error al guardar formulario de historial médico:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
