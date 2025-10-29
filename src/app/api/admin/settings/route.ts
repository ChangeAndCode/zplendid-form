import { NextRequest, NextResponse } from 'next/server';
import { SystemSettingsModel } from '../../../../lib/models/SystemSettings';
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

    // Obtener todas las configuraciones
    const settings = await SystemSettingsModel.getAllSettings();

    return NextResponse.json({
      success: true,
      data: settings
    }, { status: 200 });

  } catch (error) {
    console.error('Error al obtener configuraciones:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
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
    const { type, config } = body;

    if (type === 'email') {
      // Guardar configuración de email
      await SystemSettingsModel.setEmailConfig({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password
      });

      return NextResponse.json({
        success: true,
        message: 'Configuración de email guardada correctamente'
      }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: 'Tipo de configuración no válido' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error al guardar configuración:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

