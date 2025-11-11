import { NextRequest, NextResponse } from 'next/server';
import { AdminModel } from '../../../../../lib/models/Admin';
import { JWTUtils } from '../../../../../lib/utils/jwt';
import { generatePatientPDF } from '../../../../../lib/utils/patientPdfGenerator';
import { EmailService } from '../../../../../lib/utils/email';
import { PatientRecordModel } from '../../../../../lib/models/PatientRecord';
import { UserModel } from '../../../../../lib/models/User';

export async function POST(request: NextRequest) {
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

    // Obtener detalles del paciente
    const patientDetails = await AdminModel.getPatientDetails(patientId);

    if (!patientDetails) {
      return NextResponse.json(
        { success: false, message: 'No se encontraron datos del expediente' },
        { status: 404 }
      );
    }

    // Obtener email del usuario desde la base de datos
    const user = await UserModel.findById(userId);
    const patientInfo = patientDetails.chatbotData?.patientInfo || {};
    const patientEmail = patientDetails.email || (patientInfo.email as string) || user?.email || '';

    if (!patientEmail) {
      return NextResponse.json(
        { success: false, message: 'No se encontró un email registrado para este usuario' },
        { status: 400 }
      );
    }

    // Preparar datos para el PDF
    const patientDataForPDF = {
      firstName: patientDetails.firstName || (patientInfo.firstName as string) || '',
      lastName: patientDetails.lastName || (patientInfo.lastName as string) || '',
      dateOfBirth: (patientInfo.dateOfBirth as string) || undefined,
      age: (patientInfo.age as string) || undefined,
      gender: (patientInfo.gender as string) || undefined,
      email: patientEmail,
      phoneNumber: (patientInfo.phoneNumber as string) || undefined,
      patientId: patientDetails.patientId || patientId,
      chatbotData: patientDetails.chatbotData,
      formData: patientDetails.forms
    };

    // Generar PDF
    const pdf = generatePatientPDF(patientDataForPDF, language);
    const pdfArrayBuffer = pdf.output('arraybuffer');
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    // Nombre del archivo PDF
    const pdfFileName = `expediente_${patientId}_${patientDetails.firstName || ''}_${patientDetails.lastName || ''}.pdf`;

    // Enviar email con PDF adjunto
    const emailSent = await EmailService.sendPatientPDFEmail(
      patientEmail,
      patientDataForPDF.firstName,
      patientDataForPDF.lastName,
      pdfBuffer,
      pdfFileName,
      language
    );

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: 'Error al enviar el email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: language === 'es' 
        ? 'Email enviado exitosamente' 
        : 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error al enviar email con PDF:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor al enviar email' },
      { status: 500 }
    );
  }
}

