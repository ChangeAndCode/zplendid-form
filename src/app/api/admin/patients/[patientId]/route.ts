import { NextRequest, NextResponse } from 'next/server';
import { AdminModel } from '../../../../../lib/models/Admin';
import { JWTUtils } from '../../../../../lib/utils/jwt';

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
    
    // Verificar que sea administrador
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Acceso denegado. Se requiere rol de administrador.' },
        { status: 403 }
      );
    }

    const { patientId } = params;

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

    return NextResponse.json({
      success: true,
      data: patientDetails
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener detalles del paciente:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

