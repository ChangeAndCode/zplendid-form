'use client';

import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading, logout, token } = useAuth();
  const { language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    } else if (!isLoading && user && user.role === 'admin') {
      router.push('/admin');
    } else if (!isLoading && user && user.role === 'doctor') {
      router.push('/doctor/dashboard');
    }
  }, [isAuthenticated, isLoading, user, router]);

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
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#212e5c] ml-3">
                {language === 'es' ? 'Agendar Cita' : 'Book Appointment'}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {language === 'es' 
                ? 'Agenda una nueva cita con un doctor disponible.'
                : 'Book a new appointment with an available doctor.'
              }
            </p>
            <button 
              onClick={() => router.push('/appointments/book')}
              className="text-[#212e5c] hover:text-[#1a2347] font-medium"
            >
              {language === 'es' ? 'Agendar Ahora' : 'Book Now'} →
            </button>
          </div>

          <MedicalRecordCard language={language} token={token || ''} />

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
            <button 
              onClick={() => router.push('/appointments/my-appointments')}
              className="text-[#212e5c] hover:text-[#1a2347] font-medium"
            >
              {language === 'es' ? 'Ver Citas' : 'View Appointments'} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para la tarjeta de Expediente Médico
function MedicalRecordCard({ language, token }: { language: string; token: string }) {
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [pdfViewUrl, setPdfViewUrl] = useState<string | null>(null);

  // Limpiar URL del blob cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (pdfViewUrl) {
        window.URL.revokeObjectURL(pdfViewUrl);
      }
    };
  }, [pdfViewUrl]);

  const handleGeneratePDF = async (action: 'download' | 'view' = 'download') => {
    if (!token) {
      alert(language === 'es' ? 'No hay token de autenticación' : 'No authentication token');
      return;
    }

    setGeneratingPDF(true);
    try {
      const response = await fetch(`/api/user/my-record/pdf?language=${language}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Obtener el blob del PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        if (action === 'view') {
          // Abrir en modal para visualizar
          setPdfViewUrl(url);
        } else {
          // Descargar
          const a = document.createElement('a');
          a.href = url;
          // Obtener el nombre del archivo del header Content-Disposition
          const contentDisposition = response.headers.get('Content-Disposition');
          let filename = 'expediente_medico.pdf';
          if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch) {
              filename = filenameMatch[1];
            }
          }
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
      } else {
        // Intentar obtener mensaje de error
        try {
          const errorData = await response.json();
          alert(errorData.message || (language === 'es' ? 'Error al generar PDF' : 'Error generating PDF'));
        } catch (jsonError) {
          const errorText = await response.text();
          alert(errorText || (language === 'es' ? 'Error al generar PDF' : 'Error generating PDF'));
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(language === 'es' ? 'Error al generar el PDF. Por favor, intenta de nuevo.' : 'Error generating PDF. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleSendEmail = async () => {
    if (!token) {
      alert(language === 'es' ? 'No hay token de autenticación' : 'No authentication token');
      return;
    }

    setSendingEmail(true);
    try {
      const response = await fetch(`/api/user/my-record/send-email?language=${language}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(language === 'es' ? 'Email enviado exitosamente' : 'Email sent successfully');
      } else {
        alert(data.message || (language === 'es' ? 'Error al enviar el email' : 'Error sending email'));
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert(language === 'es' ? 'Error al enviar el email. Por favor, intenta de nuevo.' : 'Error sending email. Please try again.');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <>
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
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleGeneratePDF('view')}
            disabled={generatingPDF}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {generatingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {language === 'es' ? 'Generando...' : 'Generating...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {language === 'es' ? 'Ver PDF' : 'View PDF'}
              </>
            )}
          </button>
          <button
            onClick={() => handleGeneratePDF('download')}
            disabled={generatingPDF}
            className="flex items-center gap-2 bg-[#212e5c] hover:bg-[#1a2347] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {generatingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {language === 'es' ? 'Generando...' : 'Generating...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {language === 'es' ? 'Descargar PDF' : 'Download PDF'}
              </>
            )}
          </button>
          <button
            onClick={handleSendEmail}
            disabled={sendingEmail || generatingPDF}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {sendingEmail ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {language === 'es' ? 'Enviando...' : 'Sending...'}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {language === 'es' ? 'Enviar Email' : 'Send Email'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal para visualizar PDF */}
      {pdfViewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-0">
          <div className="bg-white rounded-lg w-full h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-[#212e5c]">
                {language === 'es' ? 'Expediente Médico' : 'Medical Record'}
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={pdfViewUrl}
                  download="expediente_medico.pdf"
                  className="text-[#212e5c] hover:text-[#1a2347] px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {language === 'es' ? 'Descargar' : 'Download'}
                </a>
                <button
                  onClick={() => {
                    if (pdfViewUrl) {
                      window.URL.revokeObjectURL(pdfViewUrl);
                      setPdfViewUrl(null);
                    }
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden min-h-0">
              <iframe
                src={pdfViewUrl}
                className="w-full h-full border-0"
                title={language === 'es' ? 'Expediente Médico' : 'Medical Record'}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
