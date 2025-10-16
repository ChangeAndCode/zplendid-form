'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '../../components/organisms/LanguageSwitcher';
import MedicalHistorySteps from './components/MedicalHistorySteps';

interface MedicalHistoryData {
  // Past Medical History
  sleepApnea: string;
  useCpap: string;
  cpapDetails: string;
  diabetes: string;
  useInsulin: string;
  
  // Other Conditions
  otherMedicalConditions: string;
  
  // Heart Problems
  highBloodPressure: string;
  heartProblems: string;
  
  // Respiratory
  respiratoryProblems: string;
  
  // Other Systems
  urinaryConditions: string;
  muscularConditions: string;
  neurologicalConditions: string;
  bloodDisorders: string;
  endocrineCondition: string;
  gastrointestinalConditions: string;
  headNeckConditions: string;
  skinConditions: string;
  constitutionalSymptoms: string;
  
  // Infectious Diseases
  hepatitis: string;
  hiv: string;
  refuseBlood: string;
  
  // Psychiatric
  psychiatricHospital: string;
  attemptedSuicide: string;
  depression: string;
  anxiety: string;
  eatingDisorders: string;
  psychiatricMedications: string;
  psychiatricTherapy: string;
  psychiatricHospitalization: string;
  
  // Social History
  tobacco: string;
  tobaccoDetails: string;
  alcohol: string;
  alcoholDetails: string;
  drugs: string;
  drugsDetails: string;
  caffeine: string;
  diet: string;
  otherSubstances: string;
  
  // Medications & Allergies
  medications: string;
  allergies: string;
  
  // Past Surgical History
  previousSurgeries: string;
  surgicalComplications: string;
  
  // Diet Program
  dietProgram: string;
  
  // Only for Women
  pregnancy: string;
  pregnancyDetails: string;
  
  // Referral
  referral: string;
  referralDetails: string;
  
  // Other
  otherConditions: string;
  hospitalizations: string;
  hospitalizationsDetails: string;
}

export default function MedicalHistoryForm() {
  const { language } = useLanguage();
  const { isAuthenticated, isLoading, patientId, getPatientRecord } = useAuth();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MedicalHistoryData>({
    sleepApnea: '',
    useCpap: '',
    cpapDetails: '',
    diabetes: '',
    useInsulin: '',
    otherMedicalConditions: '',
    highBloodPressure: '',
    heartProblems: '',
    respiratoryProblems: '',
    urinaryConditions: '',
    muscularConditions: '',
    neurologicalConditions: '',
    bloodDisorders: '',
    endocrineCondition: '',
    gastrointestinalConditions: '',
    headNeckConditions: '',
    skinConditions: '',
    constitutionalSymptoms: '',
    hepatitis: '',
    hiv: '',
    refuseBlood: '',
    psychiatricHospital: '',
    attemptedSuicide: '',
    depression: '',
    anxiety: '',
    eatingDisorders: '',
    psychiatricMedications: '',
    psychiatricTherapy: '',
    psychiatricHospitalization: '',
    tobacco: '',
    tobaccoDetails: '',
    alcohol: '',
    alcoholDetails: '',
    drugs: '',
    drugsDetails: '',
    caffeine: '',
    diet: '',
    otherSubstances: '',
    medications: '',
    allergies: '',
    previousSurgeries: '',
    surgicalComplications: '',
    dietProgram: '',
    pregnancy: '',
    pregnancyDetails: '',
    referral: '',
    referralDetails: '',
    otherConditions: '',
    hospitalizations: '',
    hospitalizationsDetails: ''
  });

  // Verificar autenticación y obtener expediente
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

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Cargar datos existentes del formulario
  useEffect(() => {
    const loadExistingData = async () => {
      if (isAuthenticated && patientId) {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch('/api/forms/medical-history', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              console.log('🔍 Cargando datos existentes:', result.data);
              setFormData(result.data);
            }
          }
        } catch (error) {
          console.error('Error al cargar datos existentes:', error);
        }
      }
    };

    loadExistingData();
  }, [isAuthenticated, patientId]);


  const handleFormDataChange = (field: keyof MedicalHistoryData, value: string) => {
    console.log('🔍 Actualizando campo en medical-history:', field, 'con valor:', value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Token encontrado en localStorage:', token ? 'Sí' : 'No');
      
      if (!token) {
        alert(language === 'es' ? 'No estás autenticado' : 'You are not authenticated');
        router.push('/');
        return;
      }

      console.log('🔍 Enviando datos del formulario de historial médico...');
      console.log('🔍 Datos COMPLETOS del formulario ANTES de enviar:', formData);
      console.log('🔍 Campos específicos ANTES de enviar:', {
        sleepApnea: formData.sleepApnea,
        diabetes: formData.diabetes,
        highBloodPressure: formData.highBloodPressure,
        medications: formData.medications,
        allergies: formData.allergies,
        tobacco: formData.tobacco,
        alcohol: formData.alcohol
      });
      
      const response = await fetch('/api/forms/medical-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('🔍 Respuesta recibida:', response.status, response.statusText);
      const result = await response.json();
      console.log('🔍 Resultado:', result);

      if (result.success) {
        alert(language === 'es' ? 'Formulario guardado correctamente' : 'Form saved successfully');
        return true;
      } else {
        alert(language === 'es' ? 'Error al guardar el formulario' : 'Error saving form');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      alert(language === 'es' ? 'Error al guardar el formulario' : 'Error saving form');
      return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Envío final del formulario
      const saved = await handleSave();
      if (saved) {
        router.push('/landing');
      }
    }
  };

  const handlePrevious = async () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      // Si estamos en el paso 1, guardar y salir
      await handleSave();
      router.push('/');
    }
  };

  // Mostrar carga mientras verifica autenticación
  if (isLoading || !isHydrated) {
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <LanguageSwitcher />

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#212e5c] mb-2">
                {language === 'es' ? 'Historial Clínico' : 'Medical History'}
              </h1>
              <p className="text-gray-600">
                {language === 'es' ? 'Módulo 3 de 4' : 'Module 3 of 4'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                {language === 'es' ? 'Expediente' : 'Patient ID'}
              </div>
              <div className="text-lg font-bold text-[#212e5c] font-mono">
                {patientId || 'Cargando...'}
              </div>
            </div>
          </div>
        </div>

        <MedicalHistorySteps
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentStep={currentStep}
          totalSteps={4}
        />
      </div>
    </div>
  );
}