import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../../lib/config/database';
import { JWTUtils } from '../../../../../lib/utils/jwt';
import { EmailService } from '../../../../../lib/utils/email';
import bcrypt from 'bcryptjs';

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
    const { email, password, firstName, lastName, licenseNumber, specialties } = body;

    if (!email || !password || !firstName || !lastName || !licenseNumber || !specialties) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    const connection = await getConnection();

    // Verificar si el email ya existe
    const [existingUser] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        { success: false, message: 'El email ya está registrado en el sistema' },
        { status: 400 }
      );
    }

    // 1. Crear usuario en la tabla users
    const hashedPassword = await bcrypt.hash(password, 12);

    const [userResult] = await connection.execute(
      `INSERT INTO users (email, password, firstName, lastName, role, isActive, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, 'doctor', true, NOW(), NOW())`,
      [email, hashedPassword, firstName, lastName]
    );

    interface InsertResult {
      insertId: number;
    }
    const userId = (userResult as InsertResult).insertId;

    // 2. Crear registro en la tabla doctors
    // Convertir specialties a JSON si no lo es
    let specialtiesJson = specialties;
    if (typeof specialties === 'string') {
      specialtiesJson = JSON.stringify([specialties]);
    }

    await connection.execute(
      `INSERT INTO doctors (userId, licenseNumber, specialties, isActive, isApproved, createdAt, updatedAt) 
       VALUES (?, ?, ?, false, false, NOW(), NOW())`,
      [userId, licenseNumber, specialtiesJson]
    );

    // Enviar email de bienvenida al doctor
    const emailSent = await EmailService.sendWelcomeEmailToDoctor(
      email,
      firstName,
      password,
      'es' // TODO: Detectar el idioma del doctor
    );

    if (!emailSent) {
      console.warn('⚠️ El doctor fue creado pero no se pudo enviar el email de bienvenida');
    }

    return NextResponse.json({
      success: true,
      message: emailSent 
        ? 'Doctor creado exitosamente. Se envió un email de bienvenida con las credenciales.' 
        : 'Doctor creado exitosamente. Hubo un problema al enviar el email de bienvenida.'
    }, { status: 200 });

  } catch (error) {
    console.error('Error al crear doctor:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { success: false, message: 'El email o número de licencia ya está registrado' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

