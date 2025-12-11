import { getCollection } from '../config/database';

export interface SystemSettings {
  id: number;
  settingKey: string;
  settingValue: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SystemSettingsDoc {
  _id?: any;
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
    const collection = await getCollection<SystemSettingsDoc>('system_settings');
    
    try {
      const setting = await collection.findOne({ settingKey: key });
      return setting ? setting.settingValue : null;
    } catch (error) {
      console.error(`Error al obtener configuración ${key}:`, error);
      return null;
    }
  }

  /**
   * Guardar o actualizar valor de configuración
   */
  static async setSetting(key: string, value: string, description?: string): Promise<void> {
    const collection = await getCollection<SystemSettingsDoc>('system_settings');
    
    try {
      const now = new Date();
      await collection.updateOne(
        { settingKey: key },
        {
          $set: {
            settingKey: key,
            settingValue: value,
            description,
            updatedAt: now
          },
          $setOnInsert: {
            createdAt: now
          }
        },
        { upsert: true }
      );
    } catch (error) {
      console.error(`Error al guardar configuración ${key}:`, error);
      throw error;
    }
  }

  /**
   * Obtener todas las configuraciones
   */
  static async getAllSettings(): Promise<Record<string, string>> {
    const collection = await getCollection<SystemSettingsDoc>('system_settings');
    
    try {
      const settings = await collection.find({}).toArray();
      const result: Record<string, string> = {};
      
      settings.forEach(setting => {
        result[setting.settingKey] = setting.settingValue;
      });
      
      return result;
    } catch (error: any) {
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
   * Crear índices (equivalente a createTable)
   */
  static async createTable(): Promise<void> {
    const collection = await getCollection<SystemSettingsDoc>('system_settings');
    await collection.createIndex({ settingKey: 1 }, { unique: true });
  }
}

