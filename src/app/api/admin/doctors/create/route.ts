import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '../../../../../lib/config/database';
import { ObjectId } from 'mongodb';
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

    const usersCollection = await getCollection('users');
    const doctorsCollection = await getCollection('doctors');

    // Verificar si el email ya existe
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'El email ya está registrado en el sistema' },
        { status: 400 }
      );
    }

    // 1. Crear usuario
    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();
    
    const newUser = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'doctor',
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    const userResult = await usersCollection.insertOne(newUser);
    const userId = userResult.insertedId;

    // 2. Crear registro en la tabla doctors
    // Convertir specialties a array si es string
    let specialtiesArray = specialties;
    if (typeof specialties === 'string') {
      specialtiesArray = [specialties];
    }

    await doctorsCollection.insertOne({
      userId,
      licenseNumber,
      specialties: specialtiesArray,
      isActive: false,
      isApproved: false,
      createdAt: now,
      updatedAt: now
    });

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

