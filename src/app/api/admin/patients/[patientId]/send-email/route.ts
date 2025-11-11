import { NextRequest, NextResponse } from 'next/server';
import { AdminModel } from '../../../../../../../lib/models/Admin';
import { JWTUtils } from '../../../../../../../lib/utils/jwt';
import { generatePatientPDF } from '../../../../../../../lib/utils/patientPdfGenerator';
import { EmailService } from '../../../../../../../lib/utils/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
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
    
    // Verificar que sea administrador o doctor
    if (decoded.role !== 'admin' && decoded.role !== 'doctor') {
      return NextResponse.json(
        { success: false, message: 'Acceso denegado. Se requiere rol de administrador o doctor.' },
        { status: 403 }
      );
    }

    const { patientId } = params;
    const searchParams = request.nextUrl.searchParams;
    const language = (searchParams.get('language') || 'es') as 'es' | 'en';

    if (!patientId) {
      return NextResponse.json(
        { success: false, message: 'patientId es requerido' },
        { status: 400 }
      );
    }

    // Obtener detalles del paciente
    const patientDetails = await AdminModel.getPatientDetails(patientId);

    if (!patientDetails) {
      return NextResponse.json(
        { success: false, message: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    // Obtener email del paciente
    const patientInfo = patientDetails.chatbotData?.patientInfo || {};
    const patientEmail = patientDetails.email || (patientInfo.email as string) || '';

    if (!patientEmail) {
      return NextResponse.json(
        { success: false, message: 'El paciente no tiene un email registrado' },
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

