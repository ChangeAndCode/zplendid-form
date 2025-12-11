import { getCollection } from '../config/database';
import { User, UserCreate, UserResponse } from '../types/auth';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { getUserIdAsObjectId } from '../utils/mongoIdHelper';

export class UserModel {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Crear un nuevo usuario
   */
  static async create(userData: UserCreate): Promise<UserResponse> {
    const collection = await getCollection<User>('users');
    
    // Verificar si el usuario ya existe
    const existing = await collection.findOne({ email: userData.email });
    if (existing) {
      throw new Error('El usuario con este email ya existe');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

    // Crear nuevo usuario
    const now = new Date();
    const newUser: Omit<User, 'id'> & { _id?: ObjectId } = {
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user',
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    const result = await collection.insertOne(newUser as any);
    const user = await collection.findOne({ _id: result.insertedId });
    
    if (!user) throw new Error('Error al crear usuario');
    
    return this.mapToUserResponse(user);
  }

  /**
   * Buscar usuario por email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const collection = await getCollection<User>('users');
    const user = await collection.findOne({ email, isActive: true });
    return user ? this.mapFromMongo(user) : null;
  }

  /**
   * Buscar usuario por ID
   */
  static async findById(id: number): Promise<UserResponse | null> {
    const collection = await getCollection<User>('users');
    
    const userIdObjectId = await getUserIdAsObjectId(id);
    if (!userIdObjectId) {
      return null;
    }
    
    const user = await collection.findOne({ _id: userIdObjectId, isActive: true });
    return user ? this.mapToUserResponse(user) : null;
  }

  /**
   * Verificar contraseña
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Actualizar último acceso
   */
  static async updateLastAccess(id: number): Promise<void> {
    const collection = await getCollection<User>('users');
    const userIdObjectId = await getUserIdAsObjectId(id);
    
    if (userIdObjectId) {
      await collection.updateOne(
        { _id: userIdObjectId },
        { $set: { updatedAt: new Date() } }
      );
    }
  }

  /**
   * Desactivar usuario
   */
  static async deactivate(id: number): Promise<void> {
    const collection = await getCollection<User>('users');
    const userIdObjectId = await getUserIdAsObjectId(id);
    
    if (userIdObjectId) {
      await collection.updateOne(
        { _id: userIdObjectId },
        { $set: { isActive: false, updatedAt: new Date() } }
      );
    }
  }

  /**
   * Mapear User a UserResponse (sin password)
   * Convierte ObjectId a number para mantener compatibilidad
   */
  private static mapToUserResponse(user: any): UserResponse {
    // Convertir ObjectId a number para compatibilidad con código existente
    const id = user._id 
      ? parseInt(user._id.toString().slice(-8), 16) 
      : (user.id || 0);
    
    return {
      id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Mapear desde MongoDB a User (mantener compatibilidad)
   */
  private static mapFromMongo(user: any): User {
    return {
      id: user._id ? parseInt(user._id.toString().slice(-8), 16) : user.id,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Crear índices (equivalente a createTable)
   */
  static async createTable(): Promise<void> {
    const collection = await getCollection<User>('users');
    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ role: 1 });
    await collection.createIndex({ isActive: 1 });
  }
}
