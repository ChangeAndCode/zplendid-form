import { NextRequest, NextResponse } from 'next/server';
import { PatientRecordModel } from '../../../../lib/models/PatientRecord';
import { getCollection } from '../../../../lib/config/database';
import { ObjectId } from 'mongodb';
import { JWTUtils } from '../../../../lib/utils/jwt';
import { AutoSchema } from '../../../../lib/utils/autoSchema';

interface SurgeryInterestData {
  // Previous Weight Loss Surgery
  previousWeightLossSurgery: string;
  previousSurgeonName: string;
  consultedAboutWeightLoss: string;
  consultationType: string;
  consultationDate: string;

  // Surgery Interest
  surgeryInterest: string;
  firstTimeBariatricName: string;
  revisionalBariatricName: string;
  primaryPlasticName: string;
  postBariatricPlasticName: string;

  // Weight History
  highestWeight: string;
  highestWeightDate: string;
  surgeryWeight: string;
  lowestWeight: string;
  lowestWeightDate: string;
  currentWeight: string;
  currentWeightDuration: string;
  goalWeight: string;
  goalWeightDate: string;
  weightRegained: string;
  weightRegainedDate: string;
  weightRegainTime: string;

  // Surgery Details
  surgeryReadiness: string;
  surgeonPreference: string;
  additionalProcedures: string;
  estimatedSurgeryDate: string;

  // GERD Information
  gerdHeartburn: string;
  gerdRegurgitation: string;
  gerdChestPain: string;
  gerdDifficultySwallowing: string;
  gerdNausea: string;
  gerdSleepDisturbance: string;
  gerdEndoscopy: string;
  gerdEndoscopyDate: string;
  gerdEndoscopyFindings: string;
  gerdPhStudy: string;
  gerdPhStudyDate: string;
  gerdPhStudyFindings: string;
  gerdManometry: string;
  gerdManometryDate: string;
  gerdManometryFindings: string;

  // PGWBI Questions (1-18)
  pgwbi1Anxious: string;
  pgwbi2Depressed: string;
  pgwbi3SelfControl: string;
  pgwbi4Vitality: string;
  pgwbi5Health: string;
  pgwbi6Spirits: string;
  pgwbi7Worried: string;
  pgwbi8Energy: string;
  pgwbi9Mood: string;
  pgwbi10Tension: string;
  pgwbi11Happiness: string;
  pgwbi12Interest: string;
  pgwbi13Calm: string;
  pgwbi14Sad: string;
  pgwbi15Active: string;
  pgwbi16Cheerful: string;
  pgwbi17Tired: string;
  pgwbi18Pressure: string;
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

    // Obtener datos del interés quirúrgico
    const surgeryInterestCollection = await getCollection('surgery_interest');
    const surgeryData = await surgeryInterestCollection.findOne({ medicalRecordId });

    if (!surgeryData) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No hay datos de interés quirúrgico guardados'
      });
    }

    // Tipo para los datos de la base de datos (incluye todos los campos posibles)
    type SurgeryInterestDBData = Record<string, string | null | undefined>;
    const data = surgeryData as any;

    // Función para mapear valores de la base de datos al formulario
    const mapFormValue = (value: string | null | undefined): string => {
      if (!value || value === '' || value === 'unknown' || value === 'EMPTY') return '';
      return value;
    };

    // Mapear DINÁMICAMENTE todos los campos de la base de datos al formato del formulario
    const formData: SurgeryInterestData = {
      // Previous Weight Loss Surgery
      previousWeightLossSurgery: mapFormValue(data.previousWeightLossSurgery),
      previousSurgeonName: mapFormValue(data.previousSurgeonName),
      consultedAboutWeightLoss: mapFormValue(data.consultedAboutWeightLoss),
      consultationType: mapFormValue(data.consultationType),
      consultationDate: mapFormValue(data.consultationDate),

      // Surgery Interest
      surgeryInterest: mapFormValue(data.surgeryInterest),
      firstTimeBariatricName: mapFormValue(data.firstTimeBariatricName),
      revisionalBariatricName: mapFormValue(data.revisionalBariatricName),
      primaryPlasticName: mapFormValue(data.primaryPlasticName),
      postBariatricPlasticName: mapFormValue(data.postBariatricPlasticName),

      // Weight History
      highestWeight: mapFormValue(data.highestWeight),
      highestWeightDate: mapFormValue(data.highestWeightDate),
      surgeryWeight: mapFormValue(data.surgeryWeight),
      lowestWeight: mapFormValue(data.lowestWeight),
      lowestWeightDate: mapFormValue(data.lowestWeightDate),
      currentWeight: mapFormValue(data.currentWeight),
      currentWeightDuration: mapFormValue(data.currentWeightDuration),
      goalWeight: mapFormValue(data.goalWeight),
      goalWeightDate: mapFormValue(data.goalWeightDate),
      weightRegained: mapFormValue(data.weightRegained),
      weightRegainedDate: mapFormValue(data.weightRegainedDate),
      weightRegainTime: mapFormValue(data.weightRegainTime),

      // Surgery Details
      surgeryReadiness: mapFormValue(data.surgeryReadiness),
      surgeonPreference: mapFormValue(data.surgeonPreference),
      additionalProcedures: mapFormValue(data.additionalProcedures),
      estimatedSurgeryDate: mapFormValue(data.estimatedSurgeryDate),

      // GERD Information
      gerdHeartburn: mapFormValue(data.gerdHeartburn),
      gerdRegurgitation: mapFormValue(data.gerdRegurgitation),
      gerdChestPain: mapFormValue(data.gerdChestPain),
      gerdDifficultySwallowing: mapFormValue(data.gerdDifficultySwallowing),
      gerdNausea: mapFormValue(data.gerdNausea),
      gerdSleepDisturbance: mapFormValue(data.gerdSleepDisturbance),
      gerdEndoscopy: mapFormValue(data.gerdEndoscopy),
      gerdEndoscopyDate: mapFormValue(data.gerdEndoscopyDate),
      gerdEndoscopyFindings: mapFormValue(data.gerdEndoscopyFindings),
      gerdPhStudy: mapFormValue(data.gerdPhStudy),
      gerdPhStudyDate: mapFormValue(data.gerdPhStudyDate),
      gerdPhStudyFindings: mapFormValue(data.gerdPhStudyFindings),
      gerdManometry: mapFormValue(data.gerdManometry),
      gerdManometryDate: mapFormValue(data.gerdManometryDate),
      gerdManometryFindings: mapFormValue(data.gerdManometryFindings),

      // PGWBI Questions (1-18)
      pgwbi1Anxious: mapFormValue(data.pgwbi1Anxious),
      pgwbi2Depressed: mapFormValue(data.pgwbi2Depressed),
      pgwbi3SelfControl: mapFormValue(data.pgwbi3SelfControl),
      pgwbi4Vitality: mapFormValue(data.pgwbi4Vitality),
      pgwbi5Health: mapFormValue(data.pgwbi5Health),
      pgwbi6Spirits: mapFormValue(data.pgwbi6Spirits),
      pgwbi7Worried: mapFormValue(data.pgwbi7Worried),
      pgwbi8Energy: mapFormValue(data.pgwbi8Energy),
      pgwbi9Mood: mapFormValue(data.pgwbi9Mood),
      pgwbi10Tension: mapFormValue(data.pgwbi10Tension),
      pgwbi11Happiness: mapFormValue(data.pgwbi11Happiness),
      pgwbi12Interest: mapFormValue(data.pgwbi12Interest),
      pgwbi13Calm: mapFormValue(data.pgwbi13Calm),
      pgwbi14Sad: mapFormValue(data.pgwbi14Sad),
      pgwbi15Active: mapFormValue(data.pgwbi15Active),
      pgwbi16Cheerful: mapFormValue(data.pgwbi16Cheerful),
      pgwbi17Tired: mapFormValue(data.pgwbi17Tired),
      pgwbi18Pressure: mapFormValue(data.pgwbi18Pressure)
    };

    return NextResponse.json({
      success: true,
      data: formData,
      message: 'Datos cargados correctamente'
    });

  } catch (error) {
    console.error('Error al cargar interés quirúrgico:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Asegurar que todas las columnas necesarias existan (comportamiento tipo Excel)
    await AutoSchema.ensureSurgeryInterestColumns();

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
    const formData: SurgeryInterestData = body;

    // Obtener el expediente del paciente
    let patientRecord = await PatientRecordModel.findByUserId(decoded.userId);
    if (!patientRecord) {
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
        formType: 'surgery_interest',
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
      mappedData[key] = mapStringValue(formData[key as keyof SurgeryInterestData]);
    });

    // Verificar si ya existe un registro para este paciente
    const surgeryInterestCollection = await getCollection('surgery_interest');
    const medicalRecordIdValue = typeof medicalRecordId === 'string' && ObjectId.isValid(medicalRecordId)
      ? new ObjectId(medicalRecordId)
      : medicalRecordId;
    
    const existing = await surgeryInterestCollection.findOne({ medicalRecordId: medicalRecordIdValue });
    const now = new Date();

    if (existing) {
      // Actualizar registro existente
      await surgeryInterestCollection.updateOne(
        { medicalRecordId: medicalRecordIdValue },
        {
          $set: { ...mappedData, updatedAt: now }
        }
      );
    } else {
      // Crear nuevo registro
      await surgeryInterestCollection.insertOne({
        medicalRecordId: medicalRecordIdValue,
        ...mappedData,
        createdAt: now,
        updatedAt: now
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Datos del interés quirúrgico guardados correctamente',
      patientId: patientRecord.patientId
    }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error al guardar formulario de interés quirúrgico:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}