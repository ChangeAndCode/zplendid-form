import { NextRequest, NextResponse } from 'next/server';
import { AdminModel } from '../../../../../lib/models/Admin';
import { JWTUtils } from '../../../../../lib/utils/jwt';

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

    const { searchParams } = new URL(request.url);
    const searchType = searchParams.get('type'); // 'expediente', 'nombre', 'procedimiento'
    const searchValue = searchParams.get('query');

    if (!searchType || !searchValue) {
      return NextResponse.json(
        { success: false, message: 'Tipo de búsqueda y valor requeridos' },
        { status: 400 }
      );
    }

    const results = await AdminModel.searchPatients(searchType, searchValue);

    return NextResponse.json({
      success: true,
      data: results
    }, { status: 200 });

  } catch (error) {
    console.error('Error al buscar pacientes:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor', error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

