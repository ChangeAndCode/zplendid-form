import { NextRequest, NextResponse } from 'next/server';
import { AdminModel } from '../../../../../../lib/models/Admin';
import { JWTUtils } from '../../../../../../lib/utils/jwt';
import { generatePatientPDF } from '../../../../../../lib/utils/patientPdfGenerator';

export async function GET(
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

    // Preparar datos para el PDF
    // Extraer información básica de chatbotData o forms
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
    console.error('Error al generar PDF del paciente:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor al generar PDF' },
      { status: 500 }
    );
  }
}

