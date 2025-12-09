'use client';

import { useLanguage } from '../../../context/LanguageContext';
import SelectField from '../../../components/molecules/SelectField';
import FormField from '../../../components/molecules/FormField';
import Button from '../../../components/atoms/Button';

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
  gerdEndoscopyDate: string;
  gerdEndoscopyFindings: string;
  gerdPhStudy: string;
  gerdPhStudyDate: string;
  gerdPhStudyFindings: string;
  gerdManometry: string;
  gerdManometryDate: string;
  gerdManometryFindings: string;

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

interface TreatmentInterestStepsProps {
  formData: SurgeryInterestData;
  onFormDataChange: (field: keyof SurgeryInterestData, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

export default function TreatmentInterestSteps({
  formData,
  onFormDataChange,
  onNext,
  onPrevious,
  currentStep,
  totalSteps
}: TreatmentInterestStepsProps) {
  const { language } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormDataChange(name as keyof SurgeryInterestData, value);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Tratamientos Previos' : 'Previous Treatments'}
            </h3>

            <SelectField
              label={language === 'es' ? '¿Ha tenido cirugía de pérdida de peso anteriormente?' : 'Have you had weight loss surgery before?'}
              name="previousWeightLossSurgery"
              value={formData.previousWeightLossSurgery}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
            </SelectField>

            {formData.previousWeightLossSurgery === 'yes' && (
              <FormField
                label={language === 'es' ? 'Nombre del Cirujano' : 'Surgeon Name'}
                name="previousSurgeonName"
                value={formData.previousSurgeonName}
                onChange={handleChange}
                placeholder={language === 'es' ? 'Nombre del cirujano' : 'Surgeon name'}
              />
            )}

            <SelectField
              label={language === 'es' ? '¿Ha consultado sobre pérdida de peso anteriormente?' : 'Have you consulted about weight loss before?'}
              name="consultedAboutWeightLoss"
              value={formData.consultedAboutWeightLoss}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
              <option value="no">{language === 'es' ? 'No' : 'No'}</option>
              <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
            </SelectField>

            {formData.consultedAboutWeightLoss === 'yes' && (
              <>
                <SelectField
                  label={language === 'es' ? 'Tipo de Consulta' : 'Type of Consultation'}
                  name="consultationType"
                  value={formData.consultationType}
                  onChange={handleChange}
                >
                  <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
                  <option value="nutritionist">{language === 'es' ? 'Nutricionista' : 'Nutritionist'}</option>
                  <option value="endocrinologist">{language === 'es' ? 'Endocrinólogo' : 'Endocrinologist'}</option>
                  <option value="bariatric_surgeon">{language === 'es' ? 'Cirujano Bariátrico' : 'Bariatric Surgeon'}</option>
                  <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
                </SelectField>

                <FormField
                  label={language === 'es' ? 'Fecha de Consulta' : 'Consultation Date'}
                  name="consultationDate"
                  value={formData.consultationDate}
                  onChange={handleChange}
                  type="date"
                />
              </>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Interés en Tratamiento' : 'Treatment Interest'}
            </h3>

            <SelectField
              label={language === 'es' ? '¿Qué tipo de procedimiento le interesa?' : 'What type of procedure interests you?'}
              name="surgeryInterest"
              value={formData.surgeryInterest}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="first_time_bariatric">{language === 'es' ? 'Cirugía Bariátrica (Primera vez)' : 'Bariatric Surgery (First time)'}</option>
              <option value="revisional_bariatric">{language === 'es' ? 'Cirugía Bariátrica (Revisión)' : 'Bariatric Surgery (Revision)'}</option>
              <option value="primary_plastic">{language === 'es' ? 'Cirugía Plástica (Primaria)' : 'Plastic Surgery (Primary)'}</option>
              <option value="post_bariatric_plastic">{language === 'es' ? 'Cirugía Plástica (Post-Bariátrica)' : 'Plastic Surgery (Post-Bariatric)'}</option>
            </SelectField>

            {formData.surgeryInterest === 'first_time_bariatric' && (
              <SelectField
                label={language === 'es' ? 'Procedimiento Específico' : 'Specific Procedure'}
                name="firstTimeBariatricName"
                value={formData.firstTimeBariatricName}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
                <option value="gastric_sleeve">{language === 'es' ? 'Manga Gástrica (Gastric Sleeve)' : 'Gastric Sleeve'}</option>
                <option value="gastric_bypass">{language === 'es' ? 'Bypass Gástrico (Gastric Bypass)' : 'Gastric Bypass'}</option>
                <option value="sadi_sasi">SADI-S/SASI-S</option>
              </SelectField>
            )}

            {formData.surgeryInterest === 'revisional_bariatric' && (
              <SelectField
                label={language === 'es' ? 'Procedimiento de Revisión' : 'Revision Procedure'}
                name="revisionalBariatricName"
                value={formData.revisionalBariatricName}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
                <option value="band_to_sleeve">{language === 'es' ? 'Banda a Manga (Band to Sleeve)' : 'Band to Sleeve'}</option>
                <option value="band_to_bypass">{language === 'es' ? 'Banda a Bypass (Band to Bypass)' : 'Band to Bypass'}</option>
                <option value="sleeve_to_bypass">{language === 'es' ? 'Manga a Bypass (Sleeve to Bypass)' : 'Sleeve to Bypass'}</option>
                <option value="bypass_revision">{language === 'es' ? 'Revisión de Bypass (Bypass Revision)' : 'Bypass Revision'}</option>
              </SelectField>
            )}

            {formData.surgeryInterest === 'primary_plastic' && (
              <SelectField
                label={language === 'es' ? 'Procedimientos Plásticos' : 'Plastic Procedures'}
                name="primaryPlasticName"
                value={formData.primaryPlasticName}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
                <option value="lipo_bbl">{language === 'es' ? 'Lipo BBL' : 'Lipo BBL'}</option>
                <option value="abdominoplasty">{language === 'es' ? 'Abdominoplastia' : 'Abdominoplasty'}</option>
                <option value="breast_augmentation">{language === 'es' ? 'Aumento de Senos' : 'Breast Augmentation'}</option>
                <option value="brachioplasty">{language === 'es' ? 'Braquioplastia' : 'Brachioplasty'}</option>
                <option value="torsoplasty">{language === 'es' ? 'Torsoplastia' : 'Torsoplasty'}</option>
                <option value="thigh_lift">{language === 'es' ? 'Lifting de Muslos' : 'Thigh Lift'}</option>
                <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
              </SelectField>
            )}

            {formData.surgeryInterest === 'post_bariatric_plastic' && (
              <SelectField
                label={language === 'es' ? 'Procedimientos Post-Bariátricos' : 'Post-Bariatric Procedures'}
                name="postBariatricPlasticName"
                value={formData.postBariatricPlasticName}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
                <option value="lipo_bbl">{language === 'es' ? 'Lipo BBL' : 'Lipo BBL'}</option>
                <option value="abdominoplasty">{language === 'es' ? 'Abdominoplastia' : 'Abdominoplasty'}</option>
                <option value="breast_augmentation">{language === 'es' ? 'Aumento de Senos' : 'Breast Augmentation'}</option>
                <option value="brachioplasty">{language === 'es' ? 'Braquioplastia' : 'Brachioplasty'}</option>
                <option value="torsoplasty">{language === 'es' ? 'Torsoplastia' : 'Torsoplasty'}</option>
                <option value="thigh_lift">{language === 'es' ? 'Lifting de Muslos' : 'Thigh Lift'}</option>
                <option value="other">{language === 'es' ? 'Otro' : 'Other'}</option>
              </SelectField>
            )}

            <SelectField
              label={language === 'es' ? '¿Cuándo le gustaría tener el procedimiento?' : 'When would you like to have the procedure?'}
              name="estimatedSurgeryDate"
              value={formData.estimatedSurgeryDate}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="asap">{language === 'es' ? 'Lo antes posible' : 'As soon as possible'}</option>
              <option value="1-3_months">{language === 'es' ? '1-3 meses' : '1-3 months'}</option>
              <option value="3-6_months">{language === 'es' ? '3-6 meses' : '3-6 months'}</option>
              <option value="6-12_months">{language === 'es' ? '6-12 meses' : '6-12 months'}</option>
              <option value="more_than_year">{language === 'es' ? 'Más de un año' : 'More than a year'}</option>
            </SelectField>
          </div>
        );

      case 3:
        // Weight History - Conditional based on surgery type
        // Skip this step entirely for primary_plastic (handled in navigation)
        const isRevisionalOrPostBariatric =
          formData.surgeryInterest === 'revisional_bariatric' ||
          formData.surgeryInterest === 'post_bariatric_plastic';

        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Historial de Peso' : 'Weight History'}
            </h3>

            {/* Highest Weight - Always shown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={language === 'es' ? 'Peso Más Alto (kg)' : 'Highest Weight (kg)'}
                name="highestWeight"
                value={formData.highestWeight}
                onChange={handleChange}
                type="number"
                placeholder={language === 'es' ? 'Ej: 120' : 'Ex: 120'}
              />

              <FormField
                label={language === 'es' ? 'Fecha del Peso Más Alto' : 'Highest Weight Date'}
                name="highestWeightDate"
                value={formData.highestWeightDate}
                onChange={handleChange}
                type="date"
              />
            </div>

            {/* Surgery Weight - Only for Revisional/Post-Bariatric */}
            {isRevisionalOrPostBariatric && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <FormField
                  label={language === 'es' ? 'Peso al Momento de la Cirugía Previa (kg)' : 'Surgery Weight (kg) - Weight at time of previous surgery'}
                  name="surgeryWeight"
                  value={formData.surgeryWeight}
                  onChange={handleChange}
                  type="number"
                  placeholder={language === 'es' ? 'Peso durante cirugía anterior' : 'Weight during previous surgery'}
                />
              </div>
            )}

            {/* Lowest Weight - Always shown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={language === 'es' ? 'Peso Más Bajo (kg)' : 'Lowest Weight (kg)'}
                name="lowestWeight"
                value={formData.lowestWeight}
                onChange={handleChange}
                type="number"
                placeholder={language === 'es' ? 'Ej: 70' : 'Ex: 70'}
              />

              <FormField
                label={language === 'es' ? 'Fecha del Peso Más Bajo' : 'Lowest Weight Date'}
                name="lowestWeightDate"
                value={formData.lowestWeightDate}
                onChange={handleChange}
                type="date"
              />
            </div>

            {/* Current Weight - Always shown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={language === 'es' ? 'Peso Actual (kg)' : 'Current Weight (kg)'}
                name="currentWeight"
                value={formData.currentWeight}
                onChange={handleChange}
                type="number"
                placeholder={language === 'es' ? 'Ej: 90' : 'Ex: 90'}
              />

              <FormField
                label={language === 'es' ? '¿Por cuánto tiempo ha mantenido su peso actual?' : 'How long have you maintained your current weight?'}
                name="currentWeightDuration"
                value={formData.currentWeightDuration}
                onChange={handleChange}
                placeholder={language === 'es' ? 'Ej: 6 meses, 2 años' : 'Ex: 6 months, 2 years'}
              />
            </div>

            {/* Goal Weight - Always shown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label={language === 'es' ? 'Peso Meta (kg)' : 'Goal Weight (kg)'}
                name="goalWeight"
                value={formData.goalWeight}
                onChange={handleChange}
                type="number"
                placeholder={language === 'es' ? 'Ej: 70' : 'Ex: 70'}
              />

              {/* Goal Weight Date - Only for Revisional/Post-Bariatric */}
              {isRevisionalOrPostBariatric && (
                <FormField
                  label={language === 'es' ? '¿Cuándo espera alcanzar su peso meta?' : 'When do you aim to reach your goal weight?'}
                  name="goalWeightDate"
                  value={formData.goalWeightDate}
                  onChange={handleChange}
                  placeholder={language === 'es' ? 'Ej: En 6 meses, 1 año' : 'Ex: In 6 months, 1 year'}
                />
              )}
            </div>

            {/* Weight Regained - Only for Revisional/Post-Bariatric */}
            {isRevisionalOrPostBariatric && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-4">
                <h4 className="font-medium text-[#212e5c]">
                  {language === 'es' ? 'Recuperación de Peso' : 'Weight Regained'}
                </h4>

                <SelectField
                  label={language === 'es' ? '¿Ha recuperado peso después de su cirugía anterior?' : 'Have you regained weight after your previous surgery?'}
                  name="weightRegained"
                  value={formData.weightRegained}
                  onChange={handleChange}
                >
                  <option value="">{language === 'es' ? 'Seleccionar respuesta' : 'Select response'}</option>
                  <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                  <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
                </SelectField>

                {formData.weightRegained === 'yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      label={language === 'es' ? 'Cuánto peso recuperó (kg)' : 'How much weight did you regain (kg)'}
                      name="weightRegainedDate"
                      value={formData.weightRegainedDate}
                      onChange={handleChange}
                      type="number"
                      placeholder={language === 'es' ? 'Ej: 15' : 'Ex: 15'}
                    />

                    <SelectField
                      label={language === 'es' ? 'En cuánto tiempo recuperó el peso' : 'How long did it take to regain weight'}
                      name="weightRegainTime"
                      value={formData.weightRegainTime}
                      onChange={handleChange}
                    >
                      <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
                      <option value="less_than_6_months">{language === 'es' ? 'Menos de 6 meses' : 'Less than 6 months'}</option>
                      <option value="6-12_months">{language === 'es' ? '6-12 meses' : '6-12 months'}</option>
                      <option value="1-2_years">{language === 'es' ? '1-2 años' : '1-2 years'}</option>
                      <option value="more_than_2_years">{language === 'es' ? 'Más de 2 años' : 'More than 2 years'}</option>
                    </SelectField>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Información de GERD' : 'GERD Information'}
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              {language === 'es'
                ? 'Por favor indique con qué frecuencia experimenta los siguientes síntomas (0 = Nunca, 1 = Raramente, 2 = Algunas veces, 3 = Frecuentemente, 4 = Siempre)'
                : 'Please indicate how often you experience the following symptoms (0 = Never, 1 = Rarely, 2 = Sometimes, 3 = Frequently, 4 = Always)'
              }
            </p>

            <SelectField
              label={language === 'es' ? 'Acidez estomacal' : 'Heartburn'}
              name="gerdHeartburn"
              value={formData.gerdHeartburn}
              onChange={handleChange}
            >
              <option value="0">0 - {language === 'es' ? 'Nunca' : 'Never'}</option>
              <option value="1">1 - {language === 'es' ? 'Raramente' : 'Rarely'}</option>
              <option value="2">2 - {language === 'es' ? 'Algunas veces' : 'Sometimes'}</option>
              <option value="3">3 - {language === 'es' ? 'Frecuentemente' : 'Frequently'}</option>
              <option value="4">4 - {language === 'es' ? 'Siempre' : 'Always'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Regurgitación' : 'Regurgitation'}
              name="gerdRegurgitation"
              value={formData.gerdRegurgitation}
              onChange={handleChange}
            >
              <option value="0">0 - {language === 'es' ? 'Nunca' : 'Never'}</option>
              <option value="1">1 - {language === 'es' ? 'Raramente' : 'Rarely'}</option>
              <option value="2">2 - {language === 'es' ? 'Algunas veces' : 'Sometimes'}</option>
              <option value="3">3 - {language === 'es' ? 'Frecuentemente' : 'Frequently'}</option>
              <option value="4">4 - {language === 'es' ? 'Siempre' : 'Always'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Dolor en el pecho' : 'Chest pain'}
              name="gerdChestPain"
              value={formData.gerdChestPain}
              onChange={handleChange}
            >
              <option value="0">0 - {language === 'es' ? 'Nunca' : 'Never'}</option>
              <option value="1">1 - {language === 'es' ? 'Raramente' : 'Rarely'}</option>
              <option value="2">2 - {language === 'es' ? 'Algunas veces' : 'Sometimes'}</option>
              <option value="3">3 - {language === 'es' ? 'Frecuentemente' : 'Frequently'}</option>
              <option value="4">4 - {language === 'es' ? 'Siempre' : 'Always'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Dificultad para tragar' : 'Difficulty swallowing'}
              name="gerdDifficultySwallowing"
              value={formData.gerdDifficultySwallowing}
              onChange={handleChange}
            >
              <option value="0">0 - {language === 'es' ? 'Nunca' : 'Never'}</option>
              <option value="1">1 - {language === 'es' ? 'Raramente' : 'Rarely'}</option>
              <option value="2">2 - {language === 'es' ? 'Algunas veces' : 'Sometimes'}</option>
              <option value="3">3 - {language === 'es' ? 'Frecuentemente' : 'Frequently'}</option>
              <option value="4">4 - {language === 'es' ? 'Siempre' : 'Always'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Náuseas' : 'Nausea'}
              name="gerdNausea"
              value={formData.gerdNausea}
              onChange={handleChange}
            >
              <option value="0">0 - {language === 'es' ? 'Nunca' : 'Never'}</option>
              <option value="1">1 - {language === 'es' ? 'Raramente' : 'Rarely'}</option>
              <option value="2">2 - {language === 'es' ? 'Algunas veces' : 'Sometimes'}</option>
              <option value="3">3 - {language === 'es' ? 'Frecuentemente' : 'Frequently'}</option>
              <option value="4">4 - {language === 'es' ? 'Siempre' : 'Always'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? 'Alteración del sueño' : 'Sleep disturbance'}
              name="gerdSleepDisturbance"
              value={formData.gerdSleepDisturbance}
              onChange={handleChange}
            >
              <option value="0">0 - {language === 'es' ? 'Nunca' : 'Never'}</option>
              <option value="1">1 - {language === 'es' ? 'Raramente' : 'Rarely'}</option>
              <option value="2">2 - {language === 'es' ? 'Algunas veces' : 'Sometimes'}</option>
              <option value="3">3 - {language === 'es' ? 'Frecuentemente' : 'Frequently'}</option>
              <option value="4">4 - {language === 'es' ? 'Siempre' : 'Always'}</option>
            </SelectField>
            <div className="space-y-4 border-t pt-4 mt-4">
              <h4 className="font-medium text-[#212e5c]">{language === 'es' ? 'Pruebas Diagnósticas' : 'Diagnostic Tests'}</h4>

              <div className="bg-gray-50 p-4 rounded-lg">
                <SelectField
                  label={language === 'es' ? '¿Se ha realizado una Endoscopia GI Superior?' : 'Have you had an Upper GI Endoscopy?'}
                  name="gerdEndoscopy"
                  value={formData.gerdEndoscopy}
                  onChange={handleChange}
                >
                  <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                  <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                  <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
                </SelectField>
                {formData.gerdEndoscopy === 'yes' && (
                  <div className="mt-3 space-y-3 animate-slideDown pl-4 border-l-2 border-blue-200">
                    <FormField label={language === 'es' ? 'Fecha' : 'Date'} name="gerdEndoscopyDate" value={formData.gerdEndoscopyDate} onChange={handleChange} type="date" />
                    <FormField label={language === 'es' ? 'Hallazgos' : 'Findings'} name="gerdEndoscopyFindings" value={formData.gerdEndoscopyFindings} onChange={handleChange} placeholder={language === 'es' ? 'Describa los hallazgos...' : 'Describe findings...'} />
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <SelectField
                  label={language === 'es' ? '¿Se ha realizado un estudio de pH de 24 horas?' : 'Have you had a 24-hour pH Study?'}
                  name="gerdPhStudy"
                  value={formData.gerdPhStudy}
                  onChange={handleChange}
                >
                  <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                  <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                  <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
                </SelectField>
                {formData.gerdPhStudy === 'yes' && (
                  <div className="mt-3 space-y-3 animate-slideDown pl-4 border-l-2 border-blue-200">
                    <FormField label={language === 'es' ? 'Fecha' : 'Date'} name="gerdPhStudyDate" value={formData.gerdPhStudyDate} onChange={handleChange} type="date" />
                    <FormField label={language === 'es' ? 'Hallazgos' : 'Findings'} name="gerdPhStudyFindings" value={formData.gerdPhStudyFindings} onChange={handleChange} placeholder={language === 'es' ? 'Describa los hallazgos...' : 'Describe findings...'} />
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <SelectField
                  label={language === 'es' ? '¿Se ha realizado una Manometría Esofágica?' : 'Have you had an Esophageal Manometry?'}
                  name="gerdManometry"
                  value={formData.gerdManometry}
                  onChange={handleChange}
                >
                  <option value="">{language === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                  <option value="no">{language === 'es' ? 'No' : 'No'}</option>
                  <option value="yes">{language === 'es' ? 'Sí' : 'Yes'}</option>
                </SelectField>
                {formData.gerdManometry === 'yes' && (
                  <div className="mt-3 space-y-3 animate-slideDown pl-4 border-l-2 border-blue-200">
                    <FormField label={language === 'es' ? 'Fecha' : 'Date'} name="gerdManometryDate" value={formData.gerdManometryDate} onChange={handleChange} type="date" />
                    <FormField label={language === 'es' ? 'Hallazgos' : 'Findings'} name="gerdManometryFindings" value={formData.gerdManometryFindings} onChange={handleChange} placeholder={language === 'es' ? 'Describa los hallazgos...' : 'Describe findings...'} />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#212e5c] mb-4">
              {language === 'es' ? 'Cuestionario de Bienestar Psicológico' : 'Psychological General Well-Being Index'}
            </h3>

            <p className="text-sm text-gray-600 mb-4">
              {language === 'es'
                ? 'Durante las últimas 4 semanas, ¿cómo se ha sentido? (6 = Muy bien, 5 = Bien, 4 = Bastante bien, 3 = Bastante mal, 2 = Mal, 1 = Muy mal, 0 = No sé)'
                : 'During the past 4 weeks, how have you been feeling? (6 = Very well, 5 = Well, 4 = Fairly well, 3 = Fairly bad, 2 = Bad, 1 = Very bad, 0 = Don\'t know)'
              }
            </p>

            <SelectField
              label={language === 'es' ? '¿Se ha sentido ansioso, preocupado o inquieto?' : 'Have you been anxious, worried or upset?'}
              name="pgwbi1Anxious"
              value={formData.pgwbi1Anxious}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="6">6 - {language === 'es' ? 'Muy bien' : 'Very well'}</option>
              <option value="5">5 - {language === 'es' ? 'Bien' : 'Well'}</option>
              <option value="4">4 - {language === 'es' ? 'Bastante bien' : 'Fairly well'}</option>
              <option value="3">3 - {language === 'es' ? 'Bastante mal' : 'Fairly bad'}</option>
              <option value="2">2 - {language === 'es' ? 'Mal' : 'Bad'}</option>
              <option value="1">1 - {language === 'es' ? 'Muy mal' : 'Very bad'}</option>
              <option value="0">0 - {language === 'es' ? 'No sé' : 'Don\'t know'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? '¿Se ha sentido deprimido o triste?' : 'Have you been depressed or sad?'}
              name="pgwbi2Depressed"
              value={formData.pgwbi2Depressed}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="6">6 - {language === 'es' ? 'Muy bien' : 'Very well'}</option>
              <option value="5">5 - {language === 'es' ? 'Bien' : 'Well'}</option>
              <option value="4">4 - {language === 'es' ? 'Bastante bien' : 'Fairly well'}</option>
              <option value="3">3 - {language === 'es' ? 'Bastante mal' : 'Fairly bad'}</option>
              <option value="2">2 - {language === 'es' ? 'Mal' : 'Bad'}</option>
              <option value="1">1 - {language === 'es' ? 'Muy mal' : 'Very bad'}</option>
              <option value="0">0 - {language === 'es' ? 'No sé' : 'Don\'t know'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? '¿Ha tenido control sobre sus emociones?' : 'Have you had control over your emotions?'}
              name="pgwbi3SelfControl"
              value={formData.pgwbi3SelfControl}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="6">6 - {language === 'es' ? 'Muy bien' : 'Very well'}</option>
              <option value="5">5 - {language === 'es' ? 'Bien' : 'Well'}</option>
              <option value="4">4 - {language === 'es' ? 'Bastante bien' : 'Fairly well'}</option>
              <option value="3">3 - {language === 'es' ? 'Bastante mal' : 'Fairly bad'}</option>
              <option value="2">2 - {language === 'es' ? 'Mal' : 'Bad'}</option>
              <option value="1">1 - {language === 'es' ? 'Muy mal' : 'Very bad'}</option>
              <option value="0">0 - {language === 'es' ? 'No sé' : 'Don\'t know'}</option>
            </SelectField>

            <SelectField
              label={language === 'es' ? '¿Se ha sentido lleno de energía y vitalidad?' : 'Have you felt full of energy and vitality?'}
              name="pgwbi4Vitality"
              value={formData.pgwbi4Vitality}
              onChange={handleChange}
            >
              <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
              <option value="6">6 - {language === 'es' ? 'Muy bien' : 'Very well'}</option>
              <option value="5">5 - {language === 'es' ? 'Bien' : 'Well'}</option>
              <option value="4">4 - {language === 'es' ? 'Bastante bien' : 'Fairly well'}</option>
              <option value="3">3 - {language === 'es' ? 'Bastante mal' : 'Fairly bad'}</option>
              <option value="2">2 - {language === 'es' ? 'Mal' : 'Bad'}</option>
              <option value="1">1 - {language === 'es' ? 'Muy mal' : 'Very bad'}</option>
              <option value="0">0 - {language === 'es' ? 'No sé' : 'Don\'t know'}</option>
            </SelectField>

            {/* Questions 5-18 */}
            {[
              { key: 'pgwbi5Health', label: 'General Health' },
              { key: 'pgwbi6Spirits', label: 'Spirits' },
              { key: 'pgwbi7Worried', label: 'Worried' },
              { key: 'pgwbi8Energy', label: 'Energy' },
              { key: 'pgwbi9Mood', label: 'Mood' },
              { key: 'pgwbi10Tension', label: 'Tension' },
              { key: 'pgwbi11Happiness', label: 'Happiness' },
              { key: 'pgwbi12Interest', label: 'Interest in things' },
              { key: 'pgwbi13Calm', label: 'Calm' },
              { key: 'pgwbi14Sad', label: 'Sad' },
              { key: 'pgwbi15Active', label: 'Active' },
              { key: 'pgwbi16Cheerful', label: 'Cheerful' },
              { key: 'pgwbi17Tired', label: 'Tired' },
              { key: 'pgwbi18Pressure', label: 'Pressure' }
            ].map((item) => (
              <SelectField
                key={item.key}
                label={item.label}
                name={item.key}
                value={formData[item.key as keyof SurgeryInterestData]}
                onChange={handleChange}
              >
                <option value="">{language === 'es' ? 'Seleccione...' : 'Select...'}</option>
                <option value="6">6 - {language === 'es' ? 'Muy bien' : 'Very well'}</option>
                <option value="5">5 - {language === 'es' ? 'Bien' : 'Well'}</option>
                <option value="4">4 - {language === 'es' ? 'Bastante bien' : 'Fairly well'}</option>
                <option value="3">3 - {language === 'es' ? 'Bastante mal' : 'Fairly bad'}</option>
                <option value="2">2 - {language === 'es' ? 'Mal' : 'Bad'}</option>
                <option value="1">1 - {language === 'es' ? 'Muy mal' : 'Very bad'}</option>
                <option value="0">0 - {language === 'es' ? 'No sé' : 'Don\'t know'}</option>
              </SelectField>
            ))}
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
