'use client';

import AuthExample from '../components/AuthExample';

export default function AuthTestPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🔐 Sistema de Autenticación - Zyron Studio
          </h1>
          <p className="text-lg text-gray-600">
            Prueba el sistema completo de login y registro
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <AuthExample />
        </div>
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">📋 Instrucciones de Uso</h2>
            
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-lg">1. Configuración Inicial</h3>
                <p>Antes de usar el sistema, asegúrate de haber ejecutado:</p>
                <div className="bg-gray-100 p-3 rounded mt-2 font-mono text-sm">
                  <div>npm run create-db  # Crear base de datos</div>
                  <div>npm run check-db   # Verificar conexión</div>
                  <div>npm run init-db    # Crear tablas</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">2. Variables de Entorno</h3>
                <p>Crea un archivo <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> en la raíz del proyecto con:</p>
                <div className="bg-gray-100 p-3 rounded mt-2 font-mono text-sm">
                  <div>DB_HOST=localhost</div>
                  <div>DB_USER=root</div>
                  <div>DB_PASSWORD=root</div>
                  <div>DB_NAME=db_zplendid</div>
                  <div>DB_PORT=3306</div>
                  <div>JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_2024</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">3. Funcionalidades</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Registro de nuevos usuarios con diferentes roles</li>
                  <li>Inicio de sesión con validación</li>
                  <li>Perfil de usuario autenticado</li>
                  <li>Tokens JWT seguros</li>
                  <li>Encriptación de contraseñas</li>
                  <li>Control de roles (admin, user, doctor)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg">4. API Endpoints</h3>
                <div className="bg-gray-100 p-3 rounded mt-2 font-mono text-sm space-y-1">
                  <div>POST /api/auth/register - Registrar usuario</div>
                  <div>POST /api/auth/login - Iniciar sesión</div>
                  <div>GET /api/auth/profile - Obtener perfil</div>
                  <div>POST /api/auth/logout - Cerrar sesión</div>
                  <div>POST /api/auth/verify - Verificar token</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
