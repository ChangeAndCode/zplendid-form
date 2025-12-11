import { NextRequest, NextResponse } from 'next/server';
import { PatientRecordModel } from '../../../../lib/models/PatientRecord';
import { getCollection } from '../../../../lib/config/database';
import { ObjectId } from 'mongodb';
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

    // Obtener datos del historial familiar
    const familyHistoryCollection = await getCollection('family_history');
    const familyData = await familyHistoryCollection.findOne({ medicalRecordId });

    if (!familyData) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos de historial familiar guardados'
      });
    }

    // Tipo para los datos de la base de datos (incluye todos los campos posibles)
    type FamilyHistoryDBData = Record<string, string | null | undefined>;
    const data = familyData as any;

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
            formType: 'family_history',
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
      mappedData[key] = mapStringValue(formData[key as keyof FamilyHistoryData]);
    });
    
    // Verificar si ya existe un registro para este paciente
    const familyHistoryCollection = await getCollection('family_history');
    const medicalRecordIdValue = typeof medicalRecordId === 'string' && ObjectId.isValid(medicalRecordId)
      ? new ObjectId(medicalRecordId)
      : medicalRecordId;
    
    const existing = await familyHistoryCollection.findOne({ medicalRecordId: medicalRecordIdValue });
    const now = new Date();

    if (existing) {
      // Actualizar registro existente
      await familyHistoryCollection.updateOne(
        { medicalRecordId: medicalRecordIdValue },
        {
          $set: { ...mappedData, updatedAt: now }
        }
      );
    } else {
      // Crear nuevo registro
      await familyHistoryCollection.insertOne({
        medicalRecordId: medicalRecordIdValue,
        ...mappedData,
        createdAt: now,
        updatedAt: now
      });
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
