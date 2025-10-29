import { NextRequest, NextResponse } from 'next/server';
import { AdminModel } from '../../../../lib/models/Admin';
import { JWTUtils } from '../../../../lib/utils/jwt';

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
    
    // Verificar que sea administrador
    if (decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Acceso denegado. Se requiere rol de administrador.' },
        { status: 403 }
      );
    }

    // Obtener lista de pacientes
    const patients = await AdminModel.getPatientsList();

    return NextResponse.json({
      success: true,
      data: patients
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener lista de pacientes:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
