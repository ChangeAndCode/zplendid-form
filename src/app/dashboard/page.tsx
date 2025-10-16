'use client';

import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#212e5c] mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'es' ? 'Cargando...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#212e5c] tracking-tight">zplendid</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              {language === 'es' ? 'Hola,' : 'Hello,'} {user.firstName}
            </span>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              {language === 'es' ? 'Cerrar Sesión' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#212e5c] mb-4">
            {language === 'es' ? 'Panel de Control' : 'Dashboard'}
          </h2>
          <p className="text-gray-600">
            {language === 'es' 
              ? 'Bienvenido a tu panel de control personalizado.'
              : 'Welcome to your personalized dashboard.'
            }
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#212e5c] mb-4">
            {language === 'es' ? 'Información del Usuario' : 'User Information'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {language === 'es' ? 'Nombre Completo' : 'Full Name'}
              </label>
              <p className="text-gray-900">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {language === 'es' ? 'Correo Electrónico' : 'Email'}
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {language === 'es' ? 'Tipo de Usuario' : 'User Type'}
              </label>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                {language === 'es' ? 'Estado' : 'Status'}
              </label>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {user.isActive 
                  ? (language === 'es' ? 'Activo' : 'Active')
                  : (language === 'es' ? 'Inactivo' : 'Inactive')
                }
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#212e5c] ml-3">
                {language === 'es' ? 'Perfil' : 'Profile'}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {language === 'es' 
                ? 'Actualiza tu información personal y configuración.'
                : 'Update your personal information and settings.'
              }
            </p>
            <button className="text-[#212e5c] hover:text-[#1a2347] font-medium">
              {language === 'es' ? 'Editar Perfil' : 'Edit Profile'} →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#212e5c] ml-3">
                {language === 'es' ? 'Expediente Médico' : 'Medical Record'}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {language === 'es' 
                ? 'Accede a tu expediente médico completo.'
                : 'Access your complete medical record.'
              }
            </p>
            <button className="text-[#212e5c] hover:text-[#1a2347] font-medium">
              {language === 'es' ? 'Ver Expediente' : 'View Record'} →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#212e5c] ml-3">
                {language === 'es' ? 'Citas' : 'Appointments'}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {language === 'es' 
                ? 'Gestiona tus citas médicas.'
                : 'Manage your medical appointments.'
              }
            </p>
            <button className="text-[#212e5c] hover:text-[#1a2347] font-medium">
              {language === 'es' ? 'Ver Citas' : 'View Appointments'} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
