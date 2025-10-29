'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import LanguageSwitcher from './organisms/LanguageSwitcher';

export default function AuthLandingPage() {
  const { language } = useLanguage();
  const { user, isAuthenticated, isLoading, login, register } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'user' as 'admin' | 'user' | 'doctor'
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirigir según el rol del usuario
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'doctor') {
        router.push('/doctor/dashboard');
      } else {
        router.push('/landing');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

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
        // La redirección se maneja en el useEffect
      }
    } catch {
      setMessage('Error inesperado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setMessage('');
    setFormData({
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'user'
    });
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#212e5c] tracking-tight">zplendid</h1>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Hero Section - Solo mostrar en modo login */}
        {isLoginMode && (
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#212e5c] mb-6 leading-tight tracking-tight">
              {language === 'es' 
                ? 'Bienvenido a zplendid' 
                : 'Welcome to zplendid'}
            </h2>
            
            <p className="text-md sm:text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              {language === 'es'
                ? 'Accede a tu cuenta para continuar con tu expediente médico y recibir la mejor atención personalizada.'
                : 'Sign in to your account to continue with your medical record and receive the best personalized care.'}
            </p>
          </div>
        )}

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[#212e5c] mb-2">
                {isLoginMode 
                  ? (language === 'es' ? 'Iniciar Sesión' : 'Sign In')
                  : (language === 'es' ? 'Crear Cuenta' : 'Create Account')
                }
              </h3>
              <p className="text-gray-600">
                {isLoginMode 
                  ? (language === 'es' ? 'Accede a tu cuenta existente' : 'Access your existing account')
                  : (language === 'es' ? 'Crea una nueva cuenta' : 'Create a new account')
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLoginMode && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'es' ? 'Nombre' : 'First Name'}
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required={!isLoginMode}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212e5c] focus:border-transparent transition-colors"
                        placeholder={language === 'es' ? 'Tu nombre' : 'Your first name'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {language === 'es' ? 'Apellido' : 'Last Name'}
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required={!isLoginMode}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212e5c] focus:border-transparent transition-colors"
                        placeholder={language === 'es' ? 'Tu apellido' : 'Your last name'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'es' ? 'Tipo de Usuario' : 'User Type'}
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212e5c] focus:border-transparent transition-colors"
                    >
                      <option value="user">
                        {language === 'es' ? 'Paciente' : 'Patient'}
                      </option>
                      {/* El rol de doctor ahora solo se asigna desde el panel de administrador */}
                      {/* <option value="doctor">
                        {language === 'es' ? 'Doctor' : 'Doctor'}
                      </option> */}
                      <option value="admin">
                        {language === 'es' ? 'Administrador' : 'Administrator'}
                      </option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Correo Electrónico' : 'Email Address'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212e5c] focus:border-transparent transition-colors"
                  placeholder={language === 'es' ? 'tu@email.com' : 'your@email.com'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'es' ? 'Contraseña' : 'Password'}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#212e5c] focus:border-transparent transition-colors"
                  placeholder={language === 'es' ? 'Tu contraseña' : 'Your password'}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#212e5c] text-white py-3 px-4 rounded-lg hover:bg-[#1a2347] focus:outline-none focus:ring-2 focus:ring-[#212e5c] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {language === 'es' ? 'Procesando...' : 'Processing...'}
                  </div>
                ) : (
                  isLoginMode 
                    ? (language === 'es' ? 'Iniciar Sesión' : 'Sign In')
                    : (language === 'es' ? 'Crear Cuenta' : 'Create Account')
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-[#212e5c] hover:text-[#1a2347] font-medium transition-colors"
              >
                {isLoginMode 
                  ? (language === 'es' ? '¿No tienes cuenta? Regístrate' : 'Don\'t have an account? Sign up')
                  : (language === 'es' ? '¿Ya tienes cuenta? Inicia sesión' : 'Already have an account? Sign in')
                }
              </button>
            </div>

            {message && (
              <div className={`mt-6 p-4 rounded-lg ${
                message.includes('exitoso') || message.includes('exitosamente') || message.includes('success')
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {message.includes('exitoso') || message.includes('exitosamente') || message.includes('success') ? (
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-[#212e5c] rounded-lg p-6 sm:p-8 lg:p-12 text-white text-center">
          <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
            {language === 'es' ? '¿Necesitas asistencia?' : 'Need assistance?'}
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a 
              href="tel:+16194716097" 
              className="text-white hover:text-gray-200 transition-colors font-medium text-sm sm:text-base"
            >
              +1 (619) 471-6097
            </a>
            <span className="hidden sm:block text-white/30">|</span>
            <a 
              href="mailto:info@zplendid.com" 
              className="text-white hover:text-gray-200 transition-colors font-medium text-sm sm:text-base"
            >
              info@zplendid.com
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-200 mt-16">
          <p className="text-sm text-gray-500">
            © 2025 <span className="font-semibold text-[#212e5c]">zplendid</span>. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </div>
  );
}
