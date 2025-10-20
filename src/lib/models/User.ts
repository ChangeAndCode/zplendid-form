import { getConnection } from '../config/database';
import { User, UserCreate, UserResponse } from '../types/auth';
import bcrypt from 'bcryptjs';

export class UserModel {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Crear un nuevo usuario
   */
  static async create(userData: UserCreate): Promise<UserResponse> {
    const connection = await getConnection();
    
    // Verificar si el usuario ya existe
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [userData.email]
    );

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      throw new Error('El usuario con este email ya existe');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

    // Insertar el nuevo usuario
    const [result] = await connection.execute(
      `INSERT INTO users (email, password, firstName, lastName, role, isActive, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userData.email,
        hashedPassword,
        userData.firstName,
        userData.lastName,
        userData.role || 'user',
        true
      ]
    );

    const insertResult = result as { insertId: number };
    const userId = insertResult.insertId;

    // Obtener el usuario creado
    const [users] = await connection.execute(
      'SELECT id, email, firstName, lastName, role, isActive, createdAt, updatedAt FROM users WHERE id = ?',
      [userId]
    );

    const user = (users as User[])[0];
    return this.mapToUserResponse(user);
  }

  /**
   * Buscar usuario por email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const connection = await getConnection();
    
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE email = ? AND isActive = true',
      [email]
    );

    const userArray = users as User[];
    return userArray.length > 0 ? userArray[0] : null;
  }

  /**
   * Buscar usuario por ID
   */
  static async findById(id: number): Promise<UserResponse | null> {
    const connection = await getConnection();
    
    const [users] = await connection.execute(
      'SELECT id, email, firstName, lastName, role, isActive, createdAt, updatedAt FROM users WHERE id = ? AND isActive = true',
      [id]
    );

    const userArray = users as User[];
    return userArray.length > 0 ? this.mapToUserResponse(userArray[0]) : null;
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
    const connection = await getConnection();
    
    await connection.execute(
      'UPDATE users SET updatedAt = NOW() WHERE id = ?',
      [id]
    );
  }

  /**
   * Desactivar usuario
   */
  static async deactivate(id: number): Promise<void> {
    const connection = await getConnection();
    
    await connection.execute(
      'UPDATE users SET isActive = false, updatedAt = NOW() WHERE id = ?',
      [id]
    );
  }

  /**
   * Mapear User a UserResponse (sin password)
   */
  private static mapToUserResponse(user: User): UserResponse {
    return {
      id: user.id,
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
   * Crear tabla de usuarios si no existe
   */
  static async createTable(): Promise<void> {
    const connection = await getConnection();
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        role ENUM('admin', 'user', 'doctor') DEFAULT 'user',
        isActive BOOLEAN DEFAULT true,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_isActive (isActive)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createTableQuery);
  }
}
