'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { formatPatientId } from '../utils/patientId';
import LanguageSwitcher from './organisms/LanguageSwitcher';
import GlobalProgress from './organisms/GlobalProgress';
import StepNumber from './atoms/StepNumber';

interface FormModule {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  route: string;
  estimatedTime: string;
  estimatedTimeEn: string;
}

const formModules: FormModule[] = [
  {
    id: 'patient-info',
    title: 'Información del Paciente',
    titleEn: 'Patient Information',
    description: 'Datos personales, contacto y emergencia',
    descriptionEn: 'Personal data, contact and emergency information',
    icon: '👤',
    route: '/form/patient-info',
    estimatedTime: '3-5 min',
    estimatedTimeEn: '3-5 min'
  },
  {
    id: 'surgery-interest',
    title: 'Tratamiento de Interés',
    titleEn: 'Treatment Interest',
    description: 'Procedimiento deseado y objetivos de salud',
    descriptionEn: 'Desired procedure and health goals',
    icon: '⚕️',
    route: '/form/surgery-interest',
    estimatedTime: '10-15 min',
    estimatedTimeEn: '10-15 min'
  },
  {
    id: 'medical-history',
    title: 'Historial Clínico',
    titleEn: 'Medical History',
    description: 'Condiciones médicas, medicamentos y alergias',
    descriptionEn: 'Medical conditions, medications and allergies',
    icon: '🏥',
    route: '/form/medical-history',
    estimatedTime: '8-12 min',
    estimatedTimeEn: '8-12 min'
  },
  {
    id: 'family-info',
    title: 'Información de la Familia',
    titleEn: 'Family Information',
    description: 'Historial familiar y contactos de emergencia',
    descriptionEn: 'Family history and emergency contacts',
    icon: '👨‍👩‍👧‍👦',
    route: '/form/family-info',
    estimatedTime: '2-3 min',
    estimatedTimeEn: '2-3 min'
  }
];

export default function LandingPage() {
  const { language } = useLanguage();
  const { isAuthenticated, isLoading, logout, patientId, getPatientRecord } = useAuth();
  const router = useRouter();
  const [completedForms, setCompletedForms] = useState<string[]>([]);

  // Redirigir al login si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Obtener expediente del paciente cuando esté autenticado
  useEffect(() => {
    if (isAuthenticated && !patientId) {
      getPatientRecord();
    }
  }, [isAuthenticated, patientId, getPatientRecord]);

  // Verificar formularios completados desde la base de datos
  useEffect(() => {
    const checkCompletedForms = async () => {
      if (!isAuthenticated || !patientId) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const completed: string[] = [];
        
        // Verificar cada formulario
        const formChecks = [
          { id: 'patient-info', url: '/api/forms/patient-info' },
          { id: 'family-info', url: '/api/forms/family-info' },
          { id: 'medical-history', url: '/api/forms/medical-history' },
          { id: 'surgery-interest', url: '/api/forms/surgery-interest' }
        ];

        for (let i = 0; i < formChecks.length; i++) {
          const form = formChecks[i];
          try {
            const response = await fetch(form.url, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });

            if (response.ok) {
              const result = await response.json();
              if (result.success && result.data) {
                // Verificar si tiene datos válidos según el tipo de formulario
                let isCompleted = false;
                
                switch (form.id) {
                  case 'patient-info':
                    isCompleted = !!(result.data.firstName && result.data.lastName && result.data.email);
                    break;
                  case 'family-info':
                    // Verificar que al menos 2 campos no estén vacíos o en 'unknown'
                    const familyFields = Object.entries(result.data).filter(([key, value]) => 
                      key !== 'patientId' && value && value !== 'unknown' && value !== ''
                    );
                    isCompleted = familyFields.length >= 2;
                    break;
                  case 'medical-history':
                    isCompleted = !!(result.data.medications || result.data.allergies || 
                      result.data.sleepApnea === 'yes' || result.data.diabetes === 'yes' || 
                      result.data.highBloodPressure === 'yes' || result.data.otherMedicalConditions);
                    break;
                  case 'surgery-interest':
                    // Verificar que al menos algunos campos importantes no estén vacíos
                    const surgeryFields = Object.entries(result.data).filter(([key, value]) => 
                      value && value !== 'unknown' && value !== '' && 
                      (key === 'surgeryInterest' || key === 'previousWeightLossSurgery' || 
                       key === 'consultedAboutWeightLoss' || key === 'surgeryReadiness')
                    );
                    isCompleted = surgeryFields.length >= 1;
                    break;
                }
                
                if (isCompleted) {
                  completed.push(form.id);
                }
              }
            }
          } catch (error) {
            console.error(`Error verificando formulario ${form.id}:`, error);
          }
        }

        setCompletedForms(completed);
      } catch (error) {
        console.error('Error verificando formularios completados:', error);
      }
    };

    checkCompletedForms();
  }, [isAuthenticated, patientId]);


  // Mostrar carga mientras verifica autenticación
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

  // Si no está autenticado, no mostrar nada (se redirigirá)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header minimalista */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#212e5c] tracking-tight">zplendid</h1>
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
          >
            {language === 'es' ? 'Cerrar Sesión' : 'Logout'}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#212e5c] mb-6 leading-tight tracking-tight">
            {language === 'es' 
              ? 'Construyamos tu expediente juntos' 
              : 'Let\'s build your medical record together'}
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
            {language === 'es'
              ? 'Para brindarte la mejor consulta posible, ayúdanos a conocerte mejor. Tu información es confidencial y nos permite cuidarte de forma personalizada.'
              : 'To provide you with the best possible consultation, help us get to know you better. Your information is confidential and allows us to care for you in a personalized way.'}
          </p>

          {/* Patient ID Badge - minimalista */}
          {patientId && (
            <div className="inline-flex items-center gap-4 bg-white px-6 py-4 rounded-lg border border-gray-200 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {language === 'es' ? 'Expediente' : 'Patient ID'}
                </span>
              </div>
              <span className="text-xl font-mono font-bold text-[#212e5c]">
                {formatPatientId(patientId)}
              </span>
              <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">
                {language === 'es' ? 'Guardado' : 'Saved'}
              </span>
            </div>
          )}
        </div>

        {/* Global Progress Indicator */}
        {completedForms.length > 0 && (
          <GlobalProgress completedForms={completedForms} totalForms={4} />
        )}

        {/* Chat Assistant Button */}
        <div className="mb-8">
          <a
            href="/chat"
            className="group block w-full bg-gradient-to-r from-[#212e5c] to-[#1a2347] rounded-lg border border-[#212e5c] hover:from-[#1a2347] hover:to-[#0f1420] transition-all duration-200 text-left cursor-pointer shadow-lg hover:shadow-xl"
          >
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 sm:gap-6 mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center text-2xl sm:text-3xl">
                    🤖
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-gray-100 transition-colors mb-2">
                      {language === 'es' ? 'Asistente Conversacional' : 'Conversational Assistant'}
                    </h3>
                    <p className="text-sm sm:text-base text-blue-100 group-hover:text-white transition-colors">
                      {language === 'es' 
                        ? 'Completa tu cuestionario médico de forma natural y conversacional'
                        : 'Complete your medical questionnaire in a natural and conversational way'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 sm:ml-8">
                <span className="text-xs sm:text-sm text-blue-200 whitespace-nowrap">
                  {language === 'es' ? '15-20 min' : '15-20 min'}
                </span>
                <svg 
                  className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:text-gray-100 group-hover:translate-x-1 transition-all" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* Form Modules - minimalista */}
        <div className="space-y-4 mb-20">
          {formModules.map((module, index) => (
            <a
              key={module.id}
              href={module.route}
              className="group block w-full bg-white rounded-lg border border-gray-200 hover:border-[#212e5c] transition-all duration-200 text-left cursor-pointer"
            >
              <div className="p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 sm:gap-6 mb-3">
                    <StepNumber 
                      stepNumber={index + 1}
                      totalSteps={4}
                      isActive={completedForms.includes(module.id)}
                      className="flex-shrink-0"
                    />
                    <div className="flex-1">
                      <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#212e5c] group-hover:text-[#1a2347] transition-colors mb-2">
                        {language === 'es' ? module.title : module.titleEn}
                      </h4>
                      <p className="text-sm sm:text-base text-gray-600">
                        {language === 'es' ? module.description : module.descriptionEn}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 sm:ml-8">
                  <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                    {language === 'es' ? module.estimatedTime : module.estimatedTimeEn}
                  </span>
                  <svg 
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-[#212e5c] group-hover:translate-x-1 transition-all" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Contact Section - minimalista */}
        <div className="bg-[#212e5c] rounded-lg p-6 sm:p-8 lg:p-12 text-white text-center mb-16">
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
        <div className="text-center py-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            © 2025 <span className="font-semibold text-[#212e5c]">zplendid</span>. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </div>
  );
}

