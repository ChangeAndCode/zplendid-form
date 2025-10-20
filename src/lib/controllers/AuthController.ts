import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '../models/User';
import { JWTUtils } from '../utils/jwt';
import { UserCreate, UserLogin, AuthResponse } from '../types/auth';
import { PatientRecordModel } from '../models/PatientRecord';

export class AuthController {
  /**
   * Registrar nuevo usuario
   */
  static async register(request: NextRequest): Promise<NextResponse<AuthResponse>> {
    try {
      const body = await request.json();
      const userData: UserCreate = body;

      // Validaciones básicas
      if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
        return NextResponse.json(
          { success: false, message: 'Todos los campos son obligatorios' },
          { status: 400 }
        );
      }

      // Verificar si el usuario ya existe
      const existingUser = await UserModel.findByEmail(userData.email);
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'El email ya está registrado' },
          { status: 400 }
        );
      }

      // Crear usuario
      const newUser = await UserModel.create(userData);
      
      // Generar y crear expediente de paciente automáticamente
      const patientId = await PatientRecordModel.generateUniquePatientId();
      await PatientRecordModel.create(newUser.id, patientId);

      // Generar token
      const token = JWTUtils.generateToken({ 
        userId: newUser.id, 
        email: newUser.email, 
        role: newUser.role 
      });

      const userResponse = { 
        id: newUser.id, 
        email: newUser.email, 
        firstName: newUser.firstName, 
        lastName: newUser.lastName, 
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt
      };

      return NextResponse.json(
        { 
          success: true, 
          message: 'Usuario registrado exitosamente', 
          user: userResponse, 
          token,
          patientId // Incluir el ID del expediente en la respuesta
        }, 
        { status: 201 }
      );
    } catch (error) {
      console.error('Error en registro:', error);
      return NextResponse.json(
        { success: false, message: 'Error interno del servidor' },
        { status: 500 }
      );
    }
  }

  /**
   * Iniciar sesión
   */
  static async login(request: NextRequest): Promise<NextResponse<AuthResponse>> {
    try {
      const body = await request.json();
      const { email, password }: UserLogin = body;

      if (!email || !password) {
        return NextResponse.json(
          { success: false, message: 'Email y contraseña son obligatorios' },
          { status: 400 }
        );
      }

      const user = await UserModel.findByEmail(email);

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Credenciales inválidas' },
          { status: 401 }
        );
      }
      const isValidPassword = await UserModel.verifyPassword(password, user.password);

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, message: 'Credenciales inválidas' },
          { status: 401 }
        );
      }

      await UserModel.updateLastAccess(user.id);
      const token = JWTUtils.generateToken({ userId: user.id, email: user.email, role: user.role });

      // Obtener o crear expediente del paciente
      let patientRecord = await PatientRecordModel.findByUserId(user.id);
      if (!patientRecord) {
        // Si no existe, crear uno nuevo
        const patientId = await PatientRecordModel.generateUniquePatientId();
        patientRecord = await PatientRecordModel.create(user.id, patientId);
      }

      const userResponse = { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      
      return NextResponse.json({ 
        success: true, 
        message: 'Login exitoso', 
        user: userResponse, 
        token,
        patientId: patientRecord.patientId // Incluir el ID del expediente
      }, { status: 200 });
    } catch (error) {
      console.error('Error en login:', error);
      return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  static async getProfile(request: NextRequest): Promise<NextResponse<AuthResponse>> {
    try {
      const authHeader = request.headers.get('authorization');
      const token = JWTUtils.extractTokenFromHeader(authHeader);

      if (!token) {
        return NextResponse.json(
          { success: false, message: 'Token de acceso requerido' },
          { status: 401 }
        );
      }

      const decoded = JWTUtils.verifyToken(token);
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      const userResponse = { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      return NextResponse.json({ 
        success: true, 
        message: 'Perfil obtenido exitosamente',
        user: userResponse 
      }, { status: 200 });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
    }
  }

  /**
   * Verificar token JWT
   */
  static async verifyToken(request: NextRequest): Promise<NextResponse<AuthResponse>> {
    try {
      const authHeader = request.headers.get('authorization');
      const token = JWTUtils.extractTokenFromHeader(authHeader);

      if (!token) {
        return NextResponse.json(
          { success: false, message: 'Token de acceso requerido' },
          { status: 401 }
        );
      }

      const decoded = JWTUtils.verifyToken(token);
      const user = await UserModel.findById(decoded.userId);

      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Usuario no encontrado' },
          { status: 404 }
        );
      }

      const userResponse = { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName, 
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      return NextResponse.json({ 
        success: true, 
        message: 'Token verificado exitosamente',
        user: userResponse 
      }, { status: 200 });
    } catch (error) {
      console.error('Error al verificar token:', error);
      return NextResponse.json({ success: false, message: 'Token inválido' }, { status: 401 });
    }
  }

  /**
   * Cerrar sesión
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async logout(_request: NextRequest): Promise<NextResponse<AuthResponse>> {
    try {
      // En un sistema JWT stateless, el logout se maneja principalmente en el frontend
      // Aquí podríamos implementar una blacklist de tokens si fuera necesario
      
      return NextResponse.json({ 
        success: true, 
        message: 'Sesión cerrada exitosamente' 
      }, { status: 200 });
    } catch (error) {
      console.error('Error en logout:', error);
      return NextResponse.json({ success: false, message: 'Error interno del servidor' }, { status: 500 });
    }
  }
}