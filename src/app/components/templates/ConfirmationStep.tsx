import { ChangeEvent, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import FormStep from '../organisms/FormStep';
import TextareaField from '../molecules/TextareaField';
import type { HealthFormData } from '../../hooks/useHealthForm';
import { generatePDF } from '../../utils/pdfGenerator';
import { getPatientId } from '../../utils/patientId';

interface ConfirmationStepProps {
  formData: HealthFormData;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onPrevious: () => void;
}

interface FieldSummary {
  label: string;
  value: string;
  section: string;
}

export default function ConfirmationStep({ formData, onInputChange, onPrevious }: ConfirmationStepProps) {
  const { t, language } = useLanguage();
  const [showPreview, setShowPreview] = useState(false);
  const [patientId, setPatientId] = useState('');

  useEffect(() => {
    setPatientId(getPatientId());
  }, []);

  const handleDownloadPDF = () => {
    try {
      const pdf = generatePDF(formData, language, patientId);
      const fileName = `zplendid_${patientId}_${formData.firstName}_${formData.lastName}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert(language === 'es' 
        ? 'Error al generar el PDF. Por favor, intenta de nuevo.'
        : 'Error generating PDF. Please try again.');
    }
  };

  // Generar resumen de datos completados
  const getFilledFieldsSummary = (): FieldSummary[] => {
    const summary: FieldSummary[] = [];
    
    const addField = (section: string, label: string, value: string) => {
      if (value && value !== '' && value !== 'no' && value !== '0') {
        summary.push({ section, label, value });
      }
    };

    // Información Personal
    const personalSection = language === 'es' ? 'Información Personal' : 'Personal Information';
    addField(personalSection, t('field.firstName'), formData.firstName);
    addField(personalSection, t('field.lastName'), formData.lastName);
    addField(personalSection, t('field.email'), formData.email);
    addField(personalSection, t('field.phone'), formData.phoneNumber);
    
    // Interés Quirúrgico
    if (formData.surgeryInterest) {
      const surgerySection = language === 'es' ? 'Interés Quirúrgico' : 'Surgery Interest';
      addField(surgerySection, t('field.surgeryType'), formData.surgeryInterest);
    }

    // Información Física
    if (formData.bmi) {
      const physicalSection = language === 'es' ? 'Información Física' : 'Physical Information';
      addField(physicalSection, t('bmi.calculated'), formData.bmi);
    }

    // Medicamentos y Alergias
    const medSection = language === 'es' ? 'Medicamentos y Alergias' : 'Medications and Allergies';
    addField(medSection, t('field.medications'), formData.medications);
    addField(medSection, t('field.allergies'), formData.allergies);

    // Condiciones Médicas (solo las que respondieron "yes")
    if (formData.diabetes === 'yes' || formData.highBloodPressure === 'yes' || 
        formData.sleepApnea === 'yes' || formData.previousWeightLossSurgery === 'yes') {
      const condSection = language === 'es' ? 'Condiciones Médicas' : 'Medical Conditions';
      if (formData.diabetes === 'yes') addField(condSection, t('field.diabetes'), t('common.yes'));
      if (formData.highBloodPressure === 'yes') addField(condSection, t('field.highBloodPressure'), t('common.yes'));
      if (formData.sleepApnea === 'yes') addField(condSection, t('field.sleepApnea'), t('common.yes'));
    }

    return summary;
  };

  const filledFields = getFilledFieldsSummary();
  const totalFields = filledFields.length;

  return (
    <FormStep
      title={t('step.confirmation')}
      onPrevious={onPrevious}
      showPrevious={true}
      showSubmit={true}
    >
      {/* Resumen de datos completados */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-[#212e5c]">
              {language === 'es' ? 'Resumen de tu información' : 'Summary of your information'}
            </h3>
          </div>
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {totalFields} {language === 'es' ? 'campos completados' : 'fields completed'}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">
          {language === 'es' 
            ? 'Hemos recopilado tu información. Puedes descargar una copia en PDF antes de enviar.'
            : 'We have collected your information. You can download a PDF copy before submitting.'}
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-white hover:bg-[#212e5c] hover:text-white text-[#212e5c] font-medium py-2 px-4 rounded-lg border-2 border-[#212e5c] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {language === 'es' ? 'Descargar PDF' : 'Download PDF'}
          </button>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPreview ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
            </svg>
            {showPreview 
              ? (language === 'es' ? 'Ocultar vista previa' : 'Hide preview')
              : (language === 'es' ? 'Ver vista previa' : 'View preview')}
          </button>
        </div>

        {/* Vista previa de datos */}
        {showPreview && (
          <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
            {filledFields.length > 0 ? (
              <div className="space-y-3">
                {(() => {
                  const sections = [...new Set(filledFields.map(f => f.section))];
                  return sections.map(section => (
                    <div key={section}>
                      <h4 className="font-semibold text-sm text-[#212e5c] mb-2">{section}</h4>
                      <div className="space-y-1 ml-2">
                        {filledFields
                          .filter(f => f.section === section)
                          .map((field, idx) => (
                            <div key={idx} className="text-sm">
                              <span className="text-gray-600">{field.label}:</span>{' '}
                              <span className="text-gray-900 font-medium">{field.value}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-4">
                {language === 'es' ? 'No hay datos para mostrar' : 'No data to display'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Comentarios adicionales */}
      <TextareaField
        label={t('section.comments')}
        name="additionalComments"
        value={formData.additionalComments}
        onChange={onInputChange}
        rows={4}
        placeholder={t('field.comments')}
        optional
        optionalText={t('field.optional')}
      />

      {/* Términos y condiciones */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-[#212e5c] mb-4">{t('section.terms')}</h3>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
          <p className="text-sm text-gray-600 mb-4">
            {t('terms.text1')}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {t('terms.text2')}
          </p>
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-1 mr-3 accent-[#212e5c]"
            />
            <span className="text-sm text-gray-700">
              {t('terms.accept')}
            </span>
          </label>
        </div>
      </div>
    </FormStep>
  );
}

