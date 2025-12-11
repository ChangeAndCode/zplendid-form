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

    // Obtener estadísticas del dashboard
    const stats = await AdminModel.getDashboardStats();

    return NextResponse.json({
      success: true,
      data: stats
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    const errorMessage = error?.message || 'Error interno del servidor';
    const errorCode = error?.code || 'UNKNOWN_ERROR';
    
    console.error('Detalles del error:', {
      message: errorMessage,
      code: errorCode,
      stack: error?.stack
    });
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        code: process.env.NODE_ENV === 'development' ? errorCode : undefined
      },
      { status: 500 }
    );
  }
}
