import { NextRequest, NextResponse } from 'next/server';
import { JWTUtils } from '../utils/jwt';
import { UserModel } from '../models/User';
import { JWTPayload } from '../types/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

/**
 * Middleware para verificar autenticación
 */
export async function authMiddleware(request: NextRequest): Promise<NextResponse | null> {
  try {
    const authHeader = request.headers.get('authorization') || undefined;
    const token = JWTUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token de acceso requerido' },
        { status: 401 }
      );
    }

    // Verificar el token
    const payload: JWTPayload = JWTUtils.verifyToken(token);

    // Verificar que el usuario existe y está activo
    const user = await UserModel.findById(payload.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado o inactivo' },
        { status: 401 }
      );
    }

    // Agregar información del usuario al request
    (request as AuthenticatedRequest).user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return null; // Continuar con la siguiente función
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return NextResponse.json(
      { success: false, message: 'Token inválido o expirado' },
      { status: 401 }
    );
  }
}

/**
 * Middleware para verificar roles específicos
 */
export function requireRole(allowedRoles: string[]) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const authResponse = await authMiddleware(request);
    if (authResponse) {
      return authResponse;
    }

    const user = (request as AuthenticatedRequest).user;
    if (!user || !allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Acceso denegado. Rol insuficiente' },
        { status: 403 }
      );
    }

    return null;
  };
}

/**
 * Middleware para verificar que el usuario sea admin
 */
export const requireAdmin = requireRole(['admin']);

/**
 * Middleware para verificar que el usuario sea admin o doctor
 */
export const requireAdminOrDoctor = requireRole(['admin', 'doctor']);

/**
 * Función helper para obtener el usuario autenticado
 */
export function getAuthenticatedUser(request: NextRequest): { id: number; email: string; role: string } | null {
  return (request as AuthenticatedRequest).user || null;
}
