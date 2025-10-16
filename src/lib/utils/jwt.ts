import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'zplendid_secret_key_2024';

export class JWTUtils {
  /**
   * Generar token JWT
   */
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '24h',
      issuer: 'zplendid',
      audience: 'zplendid-users'
    });
  }

  /**
   * Verificar token JWT
   */
  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET, {
        issuer: 'zplendid',
        audience: 'zplendid-users'
      }) as JWTPayload;
      
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expirado');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Token inválido');
      } else {
        throw new Error('Error al verificar token');
      }
    }
  }

  /**
   * Extraer token del header Authorization
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | undefined {
    if (!authHeader) {
      return undefined;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return undefined;
    }

    return parts[1];
  }

  /**
   * Decodificar token sin verificar (para obtener información básica)
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }
}
