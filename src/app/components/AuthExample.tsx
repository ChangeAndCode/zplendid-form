'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function AuthExample() {
  const { user, isLoading, isAuthenticated, login, register, logout } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user' as 'admin' | 'user' | 'doctor'
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      let response;
      
      if (isLoginMode) {
        response = await login(formData.email, formData.password);
      } else {
        response = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role
        });
      }

      setMessage(response.message);
      
      if (response.success) {
        setFormData({
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          role: 'user'
        });
      }
    } catch (error) {
      console.error('Error en registro:', error);
      setMessage('Error inesperado');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Cargando...</div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Bienvenido, {user.firstName}!</h2>
        
        <div className="space-y-2 mb-6">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Rol:</strong> {user.role}</p>
          <p><strong>Estado:</strong> {user.isActive ? 'Activo' : 'Inactivo'}</p>
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLoginMode && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required={!isLoginMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Apellido</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required={!isLoginMode}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">Usuario</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          {isLoginMode ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setMessage('');
            setFormData({
              email: '',
              password: '',
              firstName: '',
              lastName: '',
              role: 'user'
            });
          }}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {isLoginMode ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded ${
          message.includes('exitoso') || message.includes('exitosamente') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
