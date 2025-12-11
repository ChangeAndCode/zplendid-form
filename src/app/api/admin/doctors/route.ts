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

    // Obtener lista de doctores
    const doctors = await AdminModel.getDoctorsList();

    return NextResponse.json({
      success: true,
      data: doctors
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error al obtener lista de doctores:', error);
    const errorMessage = error?.message || 'Error interno del servidor';
    const errorCode = error?.code || 'UNKNOWN_ERROR';
    
    // Log detallado del error para debugging
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
    const { action, doctorId } = body;

    if (!action || !doctorId) {
      return NextResponse.json(
        { success: false, message: 'Acción y ID de doctor requeridos' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      await AdminModel.approveDoctor(doctorId);
      return NextResponse.json({
        success: true,
        message: 'Doctor aprobado correctamente'
      }, { status: 200 });
    } else if (action === 'reject') {
      await AdminModel.rejectDoctor(doctorId);
      return NextResponse.json({
        success: true,
        message: 'Doctor rechazado correctamente'
      }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: 'Acción no válida' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error al procesar acción del doctor:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
