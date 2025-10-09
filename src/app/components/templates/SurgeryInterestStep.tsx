import { ChangeEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import FormStep from '../organisms/FormStep';
import FormSection from '../organisms/FormSection';
import FormField from '../molecules/FormField';
import SelectField from '../molecules/SelectField';
import Label from '../atoms/Label';
import { FormData } from '../../hooks/useHealthForm';

interface SurgeryInterestStepProps {
  formData: FormData;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isBariatricSurgery: boolean;
  isPlasticSurgery: boolean;
}

export default function SurgeryInterestStep({ 
  formData, 
  onInputChange, 
  onNext, 
  onPrevious,
  isBariatricSurgery,
  isPlasticSurgery
}: SurgeryInterestStepProps) {
  const { t, language } = useLanguage();

  return (
    <FormStep
      title={t('step.surgery')}
      onNext={onNext}
      onPrevious={onPrevious}
      showNext={true}
      showPrevious={true}
      nextDisabled={!formData.surgeryInterest}
    >
      <SelectField
        label={t('field.surgeryType')}
        name="surgeryInterest"
        value={formData.surgeryInterest}
        onChange={onInputChange}
        required
      >
        <option value="">{t('common.select')}</option>
        <option value="first-time-bariatric">{t('surgery.firstTimeBariatric')}</option>
        <option value="revisional-bariatric">{t('surgery.revisionalBariatric')}</option>
        <option value="primary-plastic">{t('surgery.primaryPlastic')}</option>
        <option value="post-bariatric-plastic">{t('surgery.postBariatricPlastic')}</option>
        <option value="metabolic-rehab">{t('surgery.metabolicRehab')}</option>
      </SelectField>

      {formData.surgeryInterest && (
        <>
          {isBariatricSurgery && (
            <SelectField
              label={t('field.specificProcedure')}
              name="specificProcedure"
              value={formData.specificProcedure}
              onChange={onInputChange}
              required
            >
              <option value="">{t('common.select')}</option>
              {formData.surgeryInterest === 'first-time-bariatric' ? (
                <>
                  <option value="gastric-sleeve">{language === 'es' ? 'Manga Gástrica (VSG)' : 'Gastric Sleeve (VSG)'}</option>
                  <option value="gastric-bypass">{language === 'es' ? 'Bypass Gástrico (RNY o Mini)' : 'Gastric Bypass (RNY or Mini)'}</option>
                  <option value="sadi-s">SADI-S / SASI-S</option>
                </>
              ) : (
                <>
                  <option value="band-to-sleeve">{language === 'es' ? 'Banda Gástrica a Manga' : 'Gastric Band to Sleeve'}</option>
                  <option value="band-to-bypass">{language === 'es' ? 'Banda Gástrica a Bypass' : 'Gastric Band to Bypass'}</option>
                  <option value="sleeve-to-bypass">{language === 'es' ? 'Manga a Bypass' : 'Sleeve to Bypass'}</option>
                  <option value="bypass-revision">{language === 'es' ? 'Revisión de Bypass' : 'Bypass Revision'}</option>
                </>
              )}
            </SelectField>
          )}

          {isPlasticSurgery && (
            <SelectField
              label={t('field.specificProcedure')}
              name="specificProcedure"
              value={formData.specificProcedure}
              onChange={onInputChange}
              required
            >
              <option value="">{t('common.select')}</option>
              <option value="lipo-bbl">Lipo + BBL</option>
              <option value="abdominoplasty">{language === 'es' ? 'Abdominoplastia' : 'Abdominoplasty'}</option>
              <option value="lipo-bbl-abdominoplasty">Lipo + BBL + {language === 'es' ? 'Abdominoplastia' : 'Abdominoplasty'}</option>
              <option value="breast-augmentation">{language === 'es' ? 'Aumento de Senos' : 'Breast Augmentation'}</option>
              <option value="brachioplasty">{language === 'es' ? 'Braquioplastia' : 'Arm Lift'}</option>
              <option value="torsoplasty">{language === 'es' ? 'Torsoplastia' : 'Torsoplasty'}</option>
            </SelectField>
          )}

          <SelectField
            label={t('field.surgeryReadiness')}
            name="surgeryReadiness"
            value={formData.surgeryReadiness}
            onChange={onInputChange}
            optional
            optionalText={t('field.optional')}
          >
            <option value="">{t('common.select')}</option>
            <option value="ready">{language === 'es' ? 'Listo para programar' : 'Ready to schedule'}</option>
            <option value="questions">{language === 'es' ? 'Tengo preguntas' : 'I have questions'}</option>
            <option value="researching">{language === 'es' ? 'Investigando opciones' : 'Researching options'}</option>
            <option value="looking">{language === 'es' ? 'Buscando cirujano' : 'Looking for surgeon'}</option>
          </SelectField>

          <FormSection title={t('section.bmi')}>
            <div className="mb-4">
              <Label>{t('field.measurementSystem')}</Label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="measurementSystem"
                    value="standard"
                    checked={formData.measurementSystem === 'standard'}
                    onChange={onInputChange}
                    className="mr-2 accent-[#212e5c]"
                  />
                  <span className="text-gray-900">{t('measurement.standard')}</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="measurementSystem"
                    value="metric"
                    checked={formData.measurementSystem === 'metric'}
                    onChange={onInputChange}
                    className="mr-2 accent-[#212e5c]"
                  />
                  <span className="text-gray-900">{t('measurement.metric')}</span>
                </label>
              </div>
            </div>

            {formData.measurementSystem === 'standard' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  label={t('field.heightFeet')}
                  type="number"
                  name="heightFeet"
                  value={formData.heightFeet}
                  onChange={onInputChange}
                  placeholder={t('placeholder.height')}
                />
                <FormField
                  label={t('field.heightInches')}
                  type="number"
                  name="heightInches"
                  value={formData.heightInches}
                  onChange={onInputChange}
                  placeholder={t('placeholder.heightInches')}
                />
                <FormField
                  label={t('field.weightLbs')}
                  type="number"
                  name="weightLbs"
                  value={formData.weightLbs}
                  onChange={onInputChange}
                  placeholder={t('placeholder.weight')}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={t('field.heightCm')}
                  type="number"
                  name="heightCm"
                  value={formData.heightCm}
                  onChange={onInputChange}
                  placeholder={t('placeholder.heightCm')}
                />
                <FormField
                  label={t('field.weightKg')}
                  type="number"
                  name="weightKg"
                  value={formData.weightKg}
                  onChange={onInputChange}
                  placeholder={t('placeholder.weightKg')}
                />
              </div>
            )}

            {formData.bmi && (
              <div className="mt-4 p-4 bg-blue-50 border border-[#212e5c] rounded-lg">
                <p className="text-gray-900">
                  <span className="font-semibold">{t('bmi.calculated')}</span>{' '}
                  <span className="text-[#212e5c] text-xl font-bold">{formData.bmi}</span>
                </p>
              </div>
            )}
          </FormSection>
        </>
      )}
    </FormStep>
  );
}

