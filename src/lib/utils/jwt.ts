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
        const expiredError = new Error('Token expirado') as Error & { code: string; expiredAt: Date };
        expiredError.code = 'TOKEN_EXPIRED';
        expiredError.expiredAt = error.expiredAt;
        throw expiredError;
      } else if (error instanceof jwt.JsonWebTokenError) {
        const invalidError = new Error('Token inválido') as Error & { code: string };
        invalidError.code = 'TOKEN_INVALID';
        throw invalidError;
      } else {
        throw new Error('Error al verificar token');
      }
    }
  }

  /**
   * Extraer token del header Authorization
   */
  static extractTokenFromHeader(authHeader: string | null | undefined): string | undefined {
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
