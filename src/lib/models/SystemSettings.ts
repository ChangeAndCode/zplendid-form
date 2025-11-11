import { getConnection } from '../config/database';

export interface SystemSettings {
  id: number;
  settingKey: string;
  settingValue: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class SystemSettingsModel {
  /**
   * Obtener valor de configuración
   */
  static async getSetting(key: string): Promise<string | null> {
    const connection = await getConnection();
    
    try {
      const [settings] = await connection.execute(
        'SELECT settingValue FROM system_settings WHERE settingKey = ?',
        [key]
      );
      
      const settingsArray = settings as SystemSettings[];
      return settingsArray.length > 0 ? settingsArray[0].settingValue : null;
    } catch (error) {
      console.error(`Error al obtener configuración ${key}:`, error);
      return null;
    }
  }

  /**
   * Guardar o actualizar valor de configuración
   */
  static async setSetting(key: string, value: string, description?: string): Promise<void> {
    const connection = await getConnection();
    
    try {
      // Verificar si existe
      const [existing] = await connection.execute(
        'SELECT id FROM system_settings WHERE settingKey = ?',
        [key]
      );
      
      if (Array.isArray(existing) && existing.length > 0) {
        // Actualizar
        await connection.execute(
          'UPDATE system_settings SET settingValue = ?, updatedAt = NOW() WHERE settingKey = ?',
          [value, key]
        );
      } else {
        // Crear
        await connection.execute(
          'INSERT INTO system_settings (settingKey, settingValue, description, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
          [key, value, description]
        );
      }
    } catch (error) {
      console.error(`Error al guardar configuración ${key}:`, error);
      throw error;
    }
  }

  /**
   * Obtener todas las configuraciones
   */
  static async getAllSettings(): Promise<Record<string, string>> {
    const connection = await getConnection();
    
    try {
      const [settings] = await connection.execute(
        'SELECT settingKey, settingValue FROM system_settings'
      );
      
      const settingsArray = settings as SystemSettings[];
      const result: Record<string, string> = {};
      
      settingsArray.forEach(setting => {
        result[setting.settingKey] = setting.settingValue;
      });
      
      return result;
    } catch (error: any) {
      // Si la tabla no existe, simplemente retornar objeto vacío (se usará fallback de variables de entorno)
      if (error?.code === 'ER_NO_SUCH_TABLE') {
        return {};
      }
      // Para otros errores, loguear pero no fallar
      console.error('Error al obtener todas las configuraciones:', error);
      return {};
    }
  }

  /**
   * Obtener configuración de email
   */
  static async getEmailConfig(): Promise<{
    host: string;
    port: number;
    user: string;
    password: string;
    fromName: string;
    fromEmail: string;
  }> {
    const settings = await this.getAllSettings();
    
    // Usar variables de entorno como fallback si no hay configuración en BD
    return {
      host: settings.SMTP_HOST || process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(settings.SMTP_PORT || process.env.SMTP_PORT || '587'),
      user: settings.SMTP_USER || process.env.SMTP_USER || '',
      password: settings.SMTP_PASSWORD || process.env.SMTP_PASSWORD || '',
      fromName: 'Zplendid', // Nombre fijo del sistema
      fromEmail: settings.SMTP_USER || process.env.SMTP_USER || '' // Usa el mismo email del usuario SMTP
    };
  }

  /**
   * Guardar configuración de email
   */
  static async setEmailConfig(config: {
    host: string;
    port: string;
    user: string;
    password: string;
  }): Promise<void> {
    await this.setSetting('SMTP_HOST', config.host, 'Servidor SMTP');
    await this.setSetting('SMTP_PORT', config.port, 'Puerto SMTP');
    await this.setSetting('SMTP_USER', config.user, 'Usuario SMTP');
    await this.setSetting('SMTP_PASSWORD', config.password, 'Contraseña SMTP');
  }

  /**
   * Crear tabla de configuración del sistema
   */
  static async createTable(): Promise<void> {
    const connection = await getConnection();
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS system_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        settingKey VARCHAR(100) UNIQUE NOT NULL,
        settingValue TEXT NOT NULL,
        description VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_settingKey (settingKey)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createTableQuery);
  }
}

