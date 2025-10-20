import { useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user' | 'doctor';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  patientId: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'admin' | 'user' | 'doctor';
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  getProfile: () => Promise<AuthResponse>;
  verifyToken: () => Promise<boolean>;
  getPatientRecord: () => Promise<string | null>;
}

// Función utilitaria para limpiar todos los datos de formularios del localStorage
const clearFormDataFromStorage = (): void => {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (
      key.startsWith('zplendid_') || 
      key.startsWith('patient_') ||
      key.includes('form_data') ||
      key.includes('current_step') ||
      key.includes('last_saved')
    )) {
      keysToRemove.push(key);
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Eliminado: ${key}`);
  });
};

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay token en localStorage al cargar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Verificar si el token es válido y obtener el Patient ID
      verifyTokenWithToken(storedToken);
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAuthenticated = !!user && !!token;

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.token && data.user) {
        console.log('✅ Login exitoso, actualizando estado...');
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        
        // Obtener el Patient ID de la base de datos
        console.log('🔍 Login exitoso, obteniendo Patient ID...');
        const patientId = await getPatientRecord();
        console.log('🔍 Patient ID obtenido en login:', patientId);
        setPatientId(patientId);
        
        console.log('✅ Estado actualizado, usuario:', data.user, 'Patient ID:', patientId);
      }

      return data;
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error de conexión'
      };
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const register = useCallback(async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'admin' | 'user' | 'doctor';
  }): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        
        // Obtener el Patient ID de la base de datos
        const patientId = await getPatientRecord();
        setPatientId(patientId);
      }

      return data;
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error de conexión'
      };
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log('🚪 Cerrando sesión...');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      console.log('🧹 Limpiando estado local...');
      setUser(null);
      setToken(null);
      setPatientId(null);
      
      // Limpiar todos los datos de formularios del localStorage
      clearFormDataFromStorage();
      localStorage.removeItem('token');
      console.log('✅ Sesión cerrada completamente - Todos los datos de formularios eliminados');
    }
  }, [token]);

  const getProfile = useCallback(async (): Promise<AuthResponse> => {
    try {
      if (!token) {
        return {
          success: false,
          message: 'No hay token de autenticación'
        };
      }

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
      }

      return data;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return {
        success: false,
        message: 'Error de conexión'
      };
    }
  }, [token]);

  const verifyTokenWithToken = useCallback(async (tokenToVerify: string): Promise<boolean> => {
    try {
      if (!tokenToVerify) {
        setIsLoading(false);
        return false;
      }

      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenToVerify}`,
        },
      });

      const data: AuthResponse = await response.json();

      if (data.success && data.user) {
        setUser(data.user);
        // Obtener el Patient ID de la base de datos
        console.log('🔍 Usuario verificado, obteniendo Patient ID...');
        const patientId = await getPatientRecord();
        console.log('🔍 Patient ID obtenido en verifyTokenWithToken:', patientId);
        setPatientId(patientId);
        setIsLoading(false);
        return true;
      } else {
        // Token inválido, limpiar estado y datos de formularios
        setUser(null);
        setToken(null);
        setPatientId(null);
        clearFormDataFromStorage();
        localStorage.removeItem('token');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error al verificar token:', error);
      setUser(null);
      setToken(null);
      setPatientId(null);
      clearFormDataFromStorage();
      localStorage.removeItem('token');
      setIsLoading(false);
      return false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyToken = useCallback(async (): Promise<boolean> => {
    if (!token) {
      setIsLoading(false);
      return false;
    }
    return verifyTokenWithToken(token);
  }, [token, verifyTokenWithToken]);

  const getPatientRecord = useCallback(async (): Promise<string | null> => {
    try {
      if (!token) {
        console.log('🔍 No hay token para obtener Patient ID');
        return null;
      }

      console.log('🔍 Obteniendo Patient ID de la base de datos...');
      const response = await fetch('/api/patient-record', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('🔍 Respuesta del endpoint patient-record:', data);

      if (data.success && data.patientId) {
        console.log('✅ Patient ID obtenido:', data.patientId);
        setPatientId(data.patientId);
        return data.patientId;
      }

      console.log('❌ No se pudo obtener Patient ID');
      return null;
    } catch (error) {
      console.error('Error al obtener expediente:', error);
      return null;
    }
  }, [token]);

  return {
    user,
    token,
    patientId,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    getProfile,
    verifyToken,
    getPatientRecord
  };
};
