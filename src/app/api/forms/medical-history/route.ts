import { NextRequest, NextResponse } from 'next/server';
import { PatientRecordModel } from '../../../../lib/models/PatientRecord';
import { getCollection } from '../../../../lib/config/database';
import { ObjectId } from 'mongodb';
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
    const medicalRecordsCollection = await getCollection('medical_records');
    const { getUserIdAsObjectId } = await import('../../../../lib/utils/mongoIdHelper');
    const userIdValue = await getUserIdAsObjectId(decoded.userId);
    
    if (!userIdValue) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos guardados'
      });
    }
    
    const medicalRecord = await medicalRecordsCollection.findOne({ userId: userIdValue });
    
    if (!medicalRecord) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos guardados'
      });
    }

    const medicalRecordId = medicalRecord._id;

    // Obtener datos del historial médico
    const medicalHistoryCollection = await getCollection('medical_history');
    const medicalData = await medicalHistoryCollection.findOne({ medicalRecordId });

    if (!medicalData) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos de historial médico guardados'
      });
    }

    // Tipo para los datos de la base de datos (incluye todos los campos posibles)
    type MedicalHistoryDBData = Record<string, string | null | undefined>;
    const data = medicalData as any;
    
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
    const medicalRecordsCollection = await getCollection('medical_records');
    const { getUserIdAsObjectId } = await import('../../../../lib/utils/mongoIdHelper');
    const userIdValue = await getUserIdAsObjectId(decoded.userId);
    
    if (!userIdValue) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    let medicalRecord = await medicalRecordsCollection.findOne({ userId: userIdValue });
    let medicalRecordId: any;
    
    if (medicalRecord) {
      medicalRecordId = medicalRecord._id;
    } else {
      // Crear registro médico
      const now = new Date();
      const newRecord = {
        userId: userIdValue,
        recordNumber: patientRecord.patientId,
        formType: 'medical_history',
        formData: {},
        isCompleted: false,
        createdAt: now,
        updatedAt: now
      };
      const result = await medicalRecordsCollection.insertOne(newRecord);
      medicalRecordId = result.insertedId;
    }

    // Guardar los datos del formulario en la tabla específica
    // Función para asegurar que todos los valores sean strings
    const mapStringValue = (value: any): string => {
      // Si está vacío, undefined, null, o no es string, devolver string vacío
      if (value === null || value === undefined || value === '' || value === 'undefined' || value === 'null') {
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
    const medicalHistoryCollection = await getCollection('medical_history');
    const medicalRecordIdValue = typeof medicalRecordId === 'string' && ObjectId.isValid(medicalRecordId)
      ? new ObjectId(medicalRecordId)
      : medicalRecordId;
    
    const existing = await medicalHistoryCollection.findOne({ medicalRecordId: medicalRecordIdValue });
    const now = new Date();

    if (existing) {
      // Actualizar registro existente
      await medicalHistoryCollection.updateOne(
        { medicalRecordId: medicalRecordIdValue },
        {
          $set: { ...mappedData, updatedAt: now }
        }
      );
    } else {
      // Crear nuevo registro
      await medicalHistoryCollection.insertOne({
        medicalRecordId: medicalRecordIdValue,
        ...mappedData,
        createdAt: now,
        updatedAt: now
      });
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
