import { NextRequest, NextResponse } from 'next/server';
import { AdminModel } from '../../../../../lib/models/Admin';
import { JWTUtils } from '../../../../../lib/utils/jwt';

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
    
    // Verificar que sea administrador
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Acceso denegado. Se requiere rol de administrador.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { patientId, doctorId, interestArea } = body;

    if (!patientId || !doctorId || !interestArea) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Asignar paciente a doctor
    await AdminModel.assignPatientToDoctor(patientId, doctorId, interestArea);

    return NextResponse.json({
      success: true,
      message: 'Asignación realizada exitosamente'
    }, { status: 200 });

  } catch (error) {
    console.error('Error al crear asignación:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor', error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

