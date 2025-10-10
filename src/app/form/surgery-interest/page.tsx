'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useState, useEffect } from 'react';
import { getPatientId, formatPatientId, getFormStorageKey } from '../../utils/patientId';
import LanguageSwitcher from '../../components/organisms/LanguageSwitcher';
import TreatmentInterestSteps from './components/TreatmentInterestSteps';

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
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [patientId, setPatientId] = useState('');
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

  useEffect(() => {
    const id = getPatientId();
    setPatientId(id);

    try {
      const storageKey = getFormStorageKey('surgery_interest', id);
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
    
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!patientId) return;
    
    try {
      const storageKey = getFormStorageKey('surgery_interest', patientId);
      localStorage.setItem(storageKey, JSON.stringify(formData));
    } catch (error) {
      console.error('Error guardando datos:', error);
    }
  }, [formData, patientId]);

  const handleFormDataChange = (field: keyof SurgeryInterestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#212e5c] mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando formulario...</p>
        </div>
      </div>
    );
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
                {language === 'es' ? 'Tratamiento de Interés' : 'Treatment Interest'}
              </h1>
              <p className="text-gray-600">
                {language === 'es' ? 'Módulo 4 de 4' : 'Module 4 of 4'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                {language === 'es' ? 'Expediente' : 'Patient ID'}
              </div>
              <div className="text-lg font-bold text-[#212e5c] font-mono">
                {formatPatientId(patientId)}
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