'use client';

import { useLanguage } from '../../../context/LanguageContext';
import SelectField from '../../../components/molecules/SelectField';
import FormField from '../../../components/molecules/FormField';
import TextareaField from '../../../components/molecules/TextareaField';
import IntelligentMedicalAssistant from '../../../components/atoms/IntelligentMedicalAssistant';
import Button from '../../../components/atoms/Button';

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

interface MedicalHistoryStepsProps {
  formData: MedicalHistoryData;
  onFormDataChange: (field: keyof MedicalHistoryData, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export default function MedicalHistorySteps({
  formData,
  onFormDataChange,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}: MedicalHistoryStepsProps) {
  const { language } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log('🔍 Campo cambiado en medical-history:', name, 'Valor:', value);
    onFormDataChange(name as keyof MedicalHistoryData, value);
  };

  const handleAssistantSuggestion = (field: keyof MedicalHistoryData, value: string) => {
    onFormDataChange(field, value);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Historial Médico Previo' : 'Past Medical History'}
            </h3>
            
            <SelectField
              label={language === 'es' ? 'Apnea del Sueño' : 'Sleep Apnea'}
              name="sleepApnea"
              value={formData.sleepApnea}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
            </SelectField>

            {formData.sleepApnea === 'yes' && (
              <>
                <SelectField
                  label={language === 'es' ? '¿Usa CPAP?' : 'Do you use C-PAP?'}
                  name="useCpap"
                  value={formData.useCpap}
                  onChange={handleChange}
                >
                  <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                  <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                  <option value="cpap">C-PAP</option>
                  <option value="bipap">Bi-PAP</option>
                </SelectField>

                {formData.useCpap !== 'no' && (
                  <FormField
                    label={language === 'es' ? 'Detalles (horas por noche)' : 'Details (hours per night)'}
                    name="cpapDetails"
                    value={formData.cpapDetails}
                    onChange={handleChange}
                    placeholder={language === 'es' ? 'Ej: 8 horas' : 'Ex: 8 hours'}
                  />
                )}
              </>
            )}

            <SelectField
              label={language === 'es' ? 'Diabetes' : 'Diabetes'}
              name="diabetes"
              value={formData.diabetes}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
            </SelectField>

            {formData.diabetes === 'yes' && (
              <SelectField
                label={language === 'es' ? '¿Usa insulina?' : 'Do you use insulin?'}
                name="useInsulin"
                value={formData.useInsulin}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
              </SelectField>
            )}

            <SelectField
              label={language === 'es' ? 'Presión Arterial Alta' : 'High Blood Pressure'}
              name="highBloodPressure"
              value={formData.highBloodPressure}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
            </SelectField>

            <TextareaField
              label={language === 'es' ? 'Otras Condiciones Médicas' : 'Other Medical Conditions'}
              name="otherMedicalConditions"
              value={formData.otherMedicalConditions}
              onChange={handleChange}
              rows={3}
              placeholder={language === 'es' ? 'Describa cualquier otra condición médica...' : 'Describe any other medical conditions...'}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Condiciones por Sistema' : 'Conditions by System'}
            </h3>
            
            <SelectField
              label={language === 'es' ? 'Problemas Respiratorios' : 'Respiratory Problems'}
              name="respiratoryProblems"
              value={formData.respiratoryProblems}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="asthma">{language === 'es' ? 'Asma' : 'Asthma'}</option>
              <option value="copd">{language === 'es' ? 'EPOC' : 'COPD'}</option>
              <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Condiciones Urinarias' : 'Urinary Conditions'}
              name="urinaryConditions"
              value={formData.urinaryConditions}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="uti">{language === 'es' ? 'Infecciones urinarias frecuentes' : 'Frequent UTIs'}</option>
              <option value="incontinence">{language === 'es' ? 'Incontinencia' : 'Incontinence'}</option>
              <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Condiciones Musculares' : 'Muscular Conditions'}
              name="muscularConditions"
              value={formData.muscularConditions}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="arthritis">{language === 'es' ? 'Artritis' : 'Arthritis'}</option>
              <option value="fibromyalgia">{language === 'es' ? 'Fibromialgia' : 'Fibromyalgia'}</option>
              <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Condiciones Neurológicas' : 'Neurological Conditions'}
              name="neurologicalConditions"
              value={formData.neurologicalConditions}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="migraine">{language === 'es' ? 'Migrañas' : 'Migraines'}</option>
              <option value="epilepsy">{language === 'es' ? 'Epilepsia' : 'Epilepsy'}</option>
              <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Trastornos Sanguíneos' : 'Blood Disorders'}
              name="bloodDisorders"
              value={formData.bloodDisorders}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="anemia">{language === 'es' ? 'Anemia' : 'Anemia'}</option>
              <option value="clotting">{language === 'es' ? 'Problemas de coagulación' : 'Clotting problems'}</option>
              <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Condición Endocrina' : 'Endocrine Condition'}
              name="endocrineCondition"
              value={formData.endocrineCondition}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="thyroid">{language === 'es' ? 'Problemas de tiroides' : 'Thyroid problems'}</option>
              <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
            </SelectField>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Historia Social y Medicamentos' : 'Social History and Medications'}
            </h3>
            
            <SelectField
              label={language === 'es' ? 'Tabaco' : 'Tobacco'}
              name="tobacco"
              value={formData.tobacco}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
              <option value="never">{language === 'es' ? 'Nunca' : 'Never'}</option>
              <option value="former">{language === 'es' ? 'Ex-fumador' : 'Former smoker'}</option>
              <option value="current">{language === 'es' ? 'Fumador actual' : 'Current smoker'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Alcohol' : 'Alcohol'}
              name="alcohol"
              value={formData.alcohol}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
              <option value="never">{language === 'es' ? 'Nunca' : 'Never'}</option>
              <option value="occasional">{language === 'es' ? 'Ocasional' : 'Occasional'}</option>
              <option value="regular">{language === 'es' ? 'Regular' : 'Regular'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Drogas' : 'Drugs'}
              name="drugs"
              value={formData.drugs}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
              <option value="never">{language === 'es' ? 'Nunca' : 'Never'}</option>
              <option value="former">{language === 'es' ? 'Uso previo' : 'Previous use'}</option>
              <option value="current">{language === 'es' ? 'Uso actual' : 'Current use'}</option>
            </SelectField>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'es' ? 'Medicamentos Actuales' : 'Current Medications'}
                </label>
                <IntelligentMedicalAssistant
                  fieldType="medications"
                  currentValue={formData.medications}
                  onSuggestionSelect={(value) => handleAssistantSuggestion('medications', value)}
                  context={`Paciente con: ${formData.sleepApnea === 'yes' ? 'Apnea del sueño' : ''} ${formData.diabetes === 'yes' ? 'Diabetes' : ''} ${formData.highBloodPressure === 'yes' ? 'Presión arterial alta' : ''}`}
                />
              </div>
              <TextareaField
                label=""
                name="medications"
                value={formData.medications}
                onChange={handleChange}
                rows={4}
                placeholder={language === 'es' ? 'Liste todos los medicamentos que toma actualmente...' : 'List all medications you currently take...'}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  {language === 'es' ? 'Alergias' : 'Allergies'}
                </label>
                <IntelligentMedicalAssistant
                  fieldType="allergies"
                  currentValue={formData.allergies}
                  onSuggestionSelect={(value) => handleAssistantSuggestion('allergies', value)}
                  context={`Medicamentos actuales: ${formData.medications}`}
                />
              </div>
              <TextareaField
                label=""
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                rows={3}
                placeholder={language === 'es' ? 'Describa cualquier alergia conocida...' : 'Describe any known allergies...'}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Información Adicional' : 'Additional Information'}
            </h3>
            
            <TextareaField
              label={language === 'es' ? 'Cirugías Previas' : 'Previous Surgeries'}
              name="previousSurgeries"
              value={formData.previousSurgeries}
              onChange={handleChange}
              rows={3}
              placeholder={language === 'es' ? 'Describa cualquier cirugía previa...' : 'Describe any previous surgeries...'}
            />

            <TextareaField
              label={language === 'es' ? 'Otras Condiciones' : 'Other Conditions'}
              name="otherConditions"
              value={formData.otherConditions}
              onChange={handleChange}
              rows={3}
              placeholder={language === 'es' ? 'Cualquier otra información relevante...' : 'Any other relevant information...'}
            />

            <SelectField
              label={language === 'es' ? 'Hospitalizaciones' : 'Hospitalizations'}
              name="hospitalizations"
              value={formData.hospitalizations}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
            </SelectField>

            {formData.hospitalizations === 'yes' && (
              <TextareaField
                label={language === 'es' ? 'Detalles de Hospitalizaciones' : 'Hospitalization Details'}
                name="hospitalizationsDetails"
                value={formData.hospitalizationsDetails}
                onChange={handleChange}
                rows={3}
                placeholder={language === 'es' ? 'Describa las hospitalizaciones...' : 'Describe the hospitalizations...'}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {language === 'es' ? 'Paso' : 'Step'} {currentStep} {language === 'es' ? 'de' : 'of'} {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#212e5c] h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          type="button"
          onClick={onPrevious}
          variant="secondary"
          className="px-6 py-3"
        >
          {currentStep === 1 
            ? (language === 'es' ? 'Guardar y Volver' : 'Save and Return')
            : (language === 'es' ? 'Anterior' : 'Previous')
          }
        </Button>
        
        <Button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-[#212e5c] text-white hover:bg-[#1a2347]"
        >
          {currentStep === totalSteps 
            ? (language === 'es' ? 'Finalizar' : 'Finish')
            : (language === 'es' ? 'Siguiente' : 'Next')
          }
        </Button>
      </div>
    </div>
  );
}
