'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';
import { useState, useEffect } from 'react';
import { getPatientId, formatPatientId, getFormStorageKey } from '../../utils/patientId';
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
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [patientId, setPatientId] = useState('');
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

  useEffect(() => {
    const id = getPatientId();
    setPatientId(id);

    try {
      const storageKey = getFormStorageKey('medical_history', id);
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
      const storageKey = getFormStorageKey('medical_history', patientId);
      localStorage.setItem(storageKey, JSON.stringify(formData));
    } catch (error) {
      console.error('Error guardando datos:', error);
    }
  }, [formData, patientId]);

  const handleFormDataChange = (field: keyof MedicalHistoryData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      router.push('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      router.push('/');
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
                {formatPatientId(patientId)}
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