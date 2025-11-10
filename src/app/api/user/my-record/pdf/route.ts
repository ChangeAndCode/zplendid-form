import { NextRequest, NextResponse } from 'next/server';
import { AdminModel } from '../../../../../lib/models/Admin';
import { JWTUtils } from '../../../../../lib/utils/jwt';
import { generatePatientPDF } from '../../../../../lib/utils/patientPdfGenerator';
import { PatientRecordModel } from '../../../../../lib/models/PatientRecord';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization');
    const token = JWTUtils.extractTokenFromHeader(authHeader || undefined);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    const decoded = JWTUtils.verifyToken(token);
    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Usuario no identificado' },
        { status: 401 }
      );
    }

    // Obtener el patientId del usuario
    const patientRecord = await PatientRecordModel.findByUserId(userId);
    
    if (!patientRecord) {
      return NextResponse.json(
        { success: false, message: 'No se encontró expediente médico para este usuario' },
        { status: 404 }
      );
    }

    const patientId = patientRecord.patientId;
    const searchParams = request.nextUrl.searchParams;
    const language = (searchParams.get('language') || 'es') as 'es' | 'en';

    // Obtener detalles del paciente usando AdminModel (reutiliza la lógica existente)
    const patientDetails = await AdminModel.getPatientDetails(patientId);

    if (!patientDetails) {
      return NextResponse.json(
        { success: false, message: 'No se encontraron datos del expediente' },
        { status: 404 }
      );
    }

    // Preparar datos para el PDF
    const patientInfo = patientDetails.chatbotData?.patientInfo || {};
    const patientDataForPDF = {
      firstName: patientDetails.firstName || (patientInfo.firstName as string) || '',
      lastName: patientDetails.lastName || (patientInfo.lastName as string) || '',
      dateOfBirth: (patientInfo.dateOfBirth as string) || undefined,
      age: (patientInfo.age as string) || undefined,
      gender: (patientInfo.gender as string) || undefined,
      email: patientDetails.email || (patientInfo.email as string) || '',
      phoneNumber: (patientInfo.phoneNumber as string) || undefined,
      patientId: patientDetails.patientId || patientId,
      chatbotData: patientDetails.chatbotData,
      formData: patientDetails.forms
    };

    // Log de depuración para ver qué datos se están cargando
    console.log('📊 Datos cargados para PDF:');
    console.log('- patientInfo:', Object.keys(patientDetails.chatbotData?.patientInfo || {}).length, 'campos');
    console.log('- surgeryInterest:', Object.keys(patientDetails.chatbotData?.surgeryInterest || {}).length, 'campos');
    console.log('- medicalHistory:', Object.keys(patientDetails.chatbotData?.medicalHistory || {}).length, 'campos');
    console.log('- familyHistory:', Object.keys(patientDetails.chatbotData?.familyHistory || {}).length, 'campos');
    console.log('- Total campos patientInfo:', JSON.stringify(Object.keys(patientDetails.chatbotData?.patientInfo || {})));
    if (patientDetails.chatbotData?.surgeryInterest) {
      console.log('- Campos surgeryInterest:', Object.keys(patientDetails.chatbotData.surgeryInterest).filter(k => patientDetails.chatbotData?.surgeryInterest?.[k]));
    }
    if (patientDetails.chatbotData?.medicalHistory) {
      console.log('- Campos medicalHistory con datos:', Object.keys(patientDetails.chatbotData.medicalHistory).filter(k => patientDetails.chatbotData?.medicalHistory?.[k]));
    }
    if (patientDetails.chatbotData?.familyHistory) {
      console.log('- Campos familyHistory con datos:', Object.keys(patientDetails.chatbotData.familyHistory).filter(k => patientDetails.chatbotData?.familyHistory?.[k]));
    }

    // Generar PDF
    const pdf = generatePatientPDF(patientDataForPDF, language);
    
    // jsPDF 3.0.3 usa output('arraybuffer') o output('uint8array')
    // Convertir a Buffer para NextResponse
    const pdfArrayBuffer = pdf.output('arraybuffer');
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // Retornar PDF como respuesta
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="expediente_${patientId}_${patientDetails.firstName || ''}_${patientDetails.lastName || ''}.pdf"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Error al generar PDF del expediente del usuario:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor al generar PDF' },
      { status: 500 }
    );
  }
}

