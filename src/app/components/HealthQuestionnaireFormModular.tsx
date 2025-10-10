'use client';

import { useLanguage } from '../context/LanguageContext';
import { useHealthForm, type HealthFormData } from '../hooks/useHealthForm';
import LanguageSwitcher from './organisms/LanguageSwitcher';
import ProgressBar from './organisms/ProgressBar';
import PersonalInfoStep from './templates/PersonalInfoStep';
import MedicalHistoryStep from './templates/MedicalHistoryStep';
import SurgeryInterestStep from './templates/SurgeryInterestStep';
import WeightHistoryStep from './templates/WeightHistoryStep';
import ConfirmationStep from './templates/ConfirmationStep';

export default function HealthQuestionnaireFormModular() {
  const { t, language } = useLanguage();
  const {
    currentStep,
    formData,
    handleInputChange,
    handleNext,
    handlePrevious,
    handleSubmit,
    isBariatricSurgery,
    isPlasticSurgery,
    totalSteps,
    setFormData,
  } = useHealthForm();

  const handleFormDataUpdate = (fieldName: string, value: string) => {
    setFormData((prev: HealthFormData) => ({
      ...prev,
      [fieldName]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <LanguageSwitcher />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#212e5c] mb-2">{t('header.title')}</h1>
          <p className="text-gray-600">{t('header.subtitle')}</p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <form onSubmit={(e) => handleSubmit(e, language)} className="space-y-6">
          {/* Paso 1: Información Personal */}
          {currentStep === 1 && (
            <PersonalInfoStep
              formData={formData}
              onInputChange={handleInputChange}
              onNext={handleNext}
            />
          )}

          {/* Paso 2: Historial Médico */}
          {currentStep === 2 && (
            <MedicalHistoryStep
              formData={formData}
              onInputChange={handleInputChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onFormDataUpdate={handleFormDataUpdate}
            />
          )}

          {/* Paso 3: Interés Quirúrgico */}
          {currentStep === 3 && (
            <SurgeryInterestStep
              formData={formData}
              onInputChange={handleInputChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              isBariatricSurgery={isBariatricSurgery}
              isPlasticSurgery={isPlasticSurgery}
            />
          )}

          {/* Paso 4: Historial de Peso (solo cirugía bariátrica) */}
          {currentStep === 4 && isBariatricSurgery && (
            <WeightHistoryStep
              formData={formData}
              onInputChange={handleInputChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}

          {/* Paso Final: Confirmación */}
          {currentStep === totalSteps && (
            <ConfirmationStep
              formData={formData}
              onInputChange={handleInputChange}
              onPrevious={handlePrevious}
            />
          )}
        </form>
      </div>
    </div>
  );
}

