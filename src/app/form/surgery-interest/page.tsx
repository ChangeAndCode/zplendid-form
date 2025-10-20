'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import LanguageSwitcher from '../../components/organisms/LanguageSwitcher';
import TreatmentInterestSteps from './components/TreatmentInterestSteps';
import StepNumber from '../../components/atoms/StepNumber';

interface SurgeryInterestData {
  // Previous Weight Loss Surgery
  previousWeightLossSurgery: string;
  previousSurgeonName: string;
  consultedAboutWeightLoss: string;
  consultationType: string;
  consultationDate: string;
  
  // Surgery Interest
  surgeryInterest: string;
  firstTimeBariatricName: string;
  revisionalBariatricName: string;
  primaryPlasticName: string;
  postBariatricPlasticName: string;
  
  // Weight History
  highestWeight: string;
  highestWeightDate: string;
  surgeryWeight: string;
  lowestWeight: string;
  lowestWeightDate: string;
  currentWeight: string;
  currentWeightDuration: string;
  goalWeight: string;
  goalWeightDate: string;
  weightRegained: string;
  weightRegainedDate: string;
  weightRegainTime: string;
  
  // Surgery Details
  surgeryReadiness: string;
  surgeonPreference: string;
  additionalProcedures: string;
  estimatedSurgeryDate: string;
  
  // GERD Information
  gerdHeartburn: string;
  gerdRegurgitation: string;
  gerdChestPain: string;
  gerdDifficultySwallowing: string;
  gerdNausea: string;
  gerdSleepDisturbance: string;
  gerdEndoscopy: string;
  gerdPhStudy: string;
  gerdManometry: string;
  
  // PGWBI Questions
  pgwbi1Anxious: string;
  pgwbi2Depressed: string;
  pgwbi3SelfControl: string;
  pgwbi4Vitality: string;
  pgwbi5Health: string;
  pgwbi6Spirits: string;
  pgwbi7Worried: string;
  pgwbi8Energy: string;
  pgwbi9Mood: string;
  pgwbi10Tension: string;
  pgwbi11Happiness: string;
  pgwbi12Interest: string;
  pgwbi13Calm: string;
  pgwbi14Sad: string;
  pgwbi15Active: string;
  pgwbi16Cheerful: string;
  pgwbi17Tired: string;
  pgwbi18Pressure: string;
}

export default function SurgeryInterestForm() {
  const { language } = useLanguage();
  const { isAuthenticated, isLoading, patientId, getPatientRecord } = useAuth();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SurgeryInterestData>({
    previousWeightLossSurgery: '',
    previousSurgeonName: '',
    consultedAboutWeightLoss: '',
    consultationType: '',
    consultationDate: '',
    surgeryInterest: '',
    firstTimeBariatricName: '',
    revisionalBariatricName: '',
    primaryPlasticName: '',
    postBariatricPlasticName: '',
    highestWeight: '',
    highestWeightDate: '',
    surgeryWeight: '',
    lowestWeight: '',
    lowestWeightDate: '',
    currentWeight: '',
    currentWeightDuration: '',
    goalWeight: '',
    goalWeightDate: '',
    weightRegained: '',
    weightRegainedDate: '',
    weightRegainTime: '',
    surgeryReadiness: '',
    surgeonPreference: '',
    additionalProcedures: '',
    estimatedSurgeryDate: '',
    gerdHeartburn: '',
    gerdRegurgitation: '',
    gerdChestPain: '',
    gerdDifficultySwallowing: '',
    gerdNausea: '',
    gerdSleepDisturbance: '',
    gerdEndoscopy: '',
    gerdPhStudy: '',
    gerdManometry: '',
    pgwbi1Anxious: '',
    pgwbi2Depressed: '',
    pgwbi3SelfControl: '',
    pgwbi4Vitality: '',
    pgwbi5Health: '',
    pgwbi6Spirits: '',
    pgwbi7Worried: '',
    pgwbi8Energy: '',
    pgwbi9Mood: '',
    pgwbi10Tension: '',
    pgwbi11Happiness: '',
    pgwbi12Interest: '',
    pgwbi13Calm: '',
    pgwbi14Sad: '',
    pgwbi15Active: '',
    pgwbi16Cheerful: '',
    pgwbi17Tired: '',
    pgwbi18Pressure: '',
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

          const response = await fetch('/api/forms/surgery-interest', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
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


  const handleFormDataChange = (field: keyof SurgeryInterestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert(language === 'es' ? 'No estás autenticado' : 'You are not authenticated');
        router.push('/');
        return;
      }
      
      const response = await fetch('/api/forms/surgery-interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

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
    if (currentStep < 5) {
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
            <div className="flex items-center gap-6">
              <StepNumber 
                stepNumber={2}
                totalSteps={4}
                isActive={true}
                className="flex-shrink-0"
              />
              <div>
                <h1 className="text-3xl font-bold text-[#212e5c] mb-2">
                  {language === 'es' ? 'Tratamiento de Interés' : 'Treatment Interest'}
                </h1>
                <p className="text-gray-600">
                  {language === 'es' ? 'Módulo 2 de 4' : 'Module 2 of 4'}
                </p>
              </div>
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

        <TreatmentInterestSteps
          formData={formData}
          onFormDataChange={handleFormDataChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          currentStep={currentStep}
          totalSteps={5}
        />
      </div>
    </div>
  );
}