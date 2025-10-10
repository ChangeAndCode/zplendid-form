'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import { getPatientId, formatPatientId, hasExistingPatientId, getFormStorageKey } from '../utils/patientId';
import LanguageSwitcher from './organisms/LanguageSwitcher';
import GlobalProgress from './organisms/GlobalProgress';

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
    id: 'family-info',
    title: 'Información de la Familia',
    titleEn: 'Family Information',
    description: 'Historial familiar y contactos de emergencia',
    descriptionEn: 'Family history and emergency contacts',
    icon: '👨‍👩‍👧‍👦',
    route: '/form/family-info',
    estimatedTime: '2-3 min',
    estimatedTimeEn: '2-3 min'
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
    id: 'surgery-interest',
    title: 'Tratamiento de Interés',
    titleEn: 'Treatment Interest',
    description: 'Procedimiento deseado y objetivos de salud',
    descriptionEn: 'Desired procedure and health goals',
    icon: '⚕️',
    route: '/form/surgery-interest',
    estimatedTime: '10-15 min',
    estimatedTimeEn: '10-15 min'
  }
];

export default function LandingPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const [patientId, setPatientId] = useState<string>('');
  const [isReturning, setIsReturning] = useState(false);
  const [completedForms, setCompletedForms] = useState<string[]>([]);

  useEffect(() => {
    const id = getPatientId();
    setPatientId(id);
    setIsReturning(hasExistingPatientId());

    // Verificar qué formularios tienen datos guardados
    const completed: string[] = [];
    const formKeys = ['patient_info', 'family_history', 'medical_history', 'surgery_interest'];
    
    formKeys.forEach((formKey, index) => {
      try {
        const storageKey = getFormStorageKey(formKey, id);
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const data = JSON.parse(saved);
          let isCompleted = false;
          
          // Lógica específica para cada formulario
          switch (formKey) {
            case 'patient_info':
              // Requiere al menos nombre, apellido y email
              isCompleted = !!(data.firstName && data.lastName && data.email);
              break;
            case 'family_history':
              // Requiere al menos 2 campos de historial familiar completados
              const familyFields = Object.entries(data).filter(([key, value]) => 
                key !== 'patientId' && value && value !== 'no' && value !== ''
              );
              isCompleted = familyFields.length >= 2;
              break;
            case 'medical_history':
              // Requiere al menos medicamentos o alergias o alguna condición médica
              isCompleted = !!(data.medications || data.allergies || 
                (data.sleepApnea === 'yes') || (data.diabetes === 'yes') || 
                (data.highBloodPressure === 'yes') || data.otherMedicalConditions);
              break;
            case 'surgery_interest':
              // Requiere al menos el tipo de procedimiento de interés
              isCompleted = !!data.surgeryInterest;
              break;
          }
          
          if (isCompleted) {
            completed.push(`form-${index + 1}`);
          }
        }
      } catch (error) {
        console.error(`Error verificando formulario ${formKey}:`, error);
      }
    });
    
    setCompletedForms(completed);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header minimalista */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#212e5c] tracking-tight">zplendid</h1>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-5xl md:text-5xl font-bold text-[#212e5c] mb-6 leading-tight tracking-tight">
            {language === 'es' 
              ? 'Construyamos tu expediente juntos' 
              : 'Let\'s build your medical record together'}
          </h2>
          
          <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
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
              {isReturning && (
                <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-medium">
                  {language === 'es' ? 'Guardado' : 'Saved'}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Global Progress Indicator */}
        {isReturning && completedForms.length > 0 && (
          <GlobalProgress completedForms={completedForms} totalForms={4} />
        )}

        {/* Form Modules - minimalista */}
        <div className="space-y-4 mb-20">
          {formModules.map((module, index) => (
            <a
              key={module.id}
              href={module.route}
              className="group block w-full bg-white rounded-lg border border-gray-200 hover:border-[#212e5c] transition-all duration-200 text-left cursor-pointer"
            >
              <div className="p-8 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-3xl">{module.icon}</span>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                        {index + 1} {language === 'es' ? 'de' : 'of'} 4
                      </div>
                      <h4 className="text-2xl font-semibold text-[#212e5c] group-hover:text-[#1a2347] transition-colors">
                        {language === 'es' ? module.title : module.titleEn}
                      </h4>
                    </div>
                  </div>
                  <p className="text-gray-600 ml-16">
                    {language === 'es' ? module.description : module.descriptionEn}
                  </p>
                </div>
                
                <div className="flex items-center gap-6 ml-8">
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {language === 'es' ? module.estimatedTime : module.estimatedTimeEn}
                  </span>
                  <svg 
                    className="w-6 h-6 text-gray-400 group-hover:text-[#212e5c] group-hover:translate-x-1 transition-all" 
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
        <div className="bg-[#212e5c] rounded-lg p-12 text-white text-center mb-16">
          <h3 className="text-2xl font-semibold mb-8">
            {language === 'es' ? '¿Necesitas asistencia?' : 'Need assistance?'}
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="tel:+16194716097" 
              className="text-white hover:text-gray-200 transition-colors font-medium"
            >
              +1 (619) 471-6097
            </a>
            <span className="hidden sm:block text-white/30">|</span>
            <a 
              href="mailto:info@zplendid.com" 
              className="text-white hover:text-gray-200 transition-colors font-medium"
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

