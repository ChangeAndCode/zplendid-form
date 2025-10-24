import { getConnection } from '../config/database';
import { User, UserCreate, UserResponse } from '../types/auth';
import bcrypt from 'bcryptjs';
import sql from 'mssql';

export class UserModel {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Crear un nuevo usuario
   */
  static async create(userData: UserCreate): Promise<UserResponse> {
    const pool = await getConnection();
    
    // Verificar si el usuario ya existe
    const existingUsersResult = await pool.request()
      .input('email', sql.VarChar(255), userData.email)
      .query('SELECT id FROM users WHERE email = @email');

    if (existingUsersResult.recordset.length > 0) {
      throw new Error('El usuario con este email ya existe');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

    // Insertar el nuevo usuario
    const insertResult = await pool.request()
      .input('email', sql.VarChar(255), userData.email)
      .input('password', sql.VarChar(255), hashedPassword)
      .input('firstName', sql.VarChar(100), userData.firstName)
      .input('lastName', sql.VarChar(100), userData.lastName)
      .input('role', sql.VarChar(20), userData.role || 'user')
      .input('isActive', sql.Bit, true)
      .query(`
        INSERT INTO users (email, password, firstName, lastName, role, isActive, createdAt, updatedAt) 
        OUTPUT INSERTED.id
        VALUES (@email, @password, @firstName, @lastName, @role, @isActive, GETDATE(), GETDATE())
      `);

    const userId = insertResult.recordset[0].id;

    // Obtener el usuario creado
    const userResult = await pool.request()
      .input('id', sql.Int, userId)
      .query('SELECT id, email, firstName, lastName, role, isActive, createdAt, updatedAt FROM users WHERE id = @id');

    const user = userResult.recordset[0] as User;
    return this.mapToUserResponse(user);
  }

  /**
   * Buscar usuario por email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('email', sql.VarChar(255), email)
      .query('SELECT * FROM users WHERE email = @email AND isActive = 1');

    return result.recordset.length > 0 ? result.recordset[0] as User : null;
  }

  /**
   * Buscar usuario por ID
   */
  static async findById(id: number): Promise<UserResponse | null> {
    const pool = await getConnection();
    
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT id, email, firstName, lastName, role, isActive, createdAt, updatedAt FROM users WHERE id = @id AND isActive = 1');

    return result.recordset.length > 0 ? this.mapToUserResponse(result.recordset[0] as User) : null;
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
    const pool = await getConnection();
    
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE users SET updatedAt = GETDATE() WHERE id = @id');
  }

  /**
   * Desactivar usuario
   */
  static async deactivate(id: number): Promise<void> {
    const pool = await getConnection();
    
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE users SET isActive = 0, updatedAt = GETDATE() WHERE id = @id');
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
    const pool = await getConnection();
    
    const createTableQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
      CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        email NVARCHAR(255) UNIQUE NOT NULL,
        password NVARCHAR(255) NOT NULL,
        firstName NVARCHAR(100) NOT NULL,
        lastName NVARCHAR(100) NOT NULL,
        role NVARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user', 'doctor')),
        isActive BIT DEFAULT 1,
        createdAt DATETIME2 DEFAULT GETDATE(),
        updatedAt DATETIME2 DEFAULT GETDATE()
      );
      
      -- Crear índices si no existen
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_email' AND object_id = OBJECT_ID('users'))
      CREATE INDEX idx_email ON users (email);
      
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_role' AND object_id = OBJECT_ID('users'))
      CREATE INDEX idx_role ON users (role);
      
      IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_isActive' AND object_id = OBJECT_ID('users'))
      CREATE INDEX idx_isActive ON users (isActive);
    `;

    await pool.request().query(createTableQuery);
  }
}
