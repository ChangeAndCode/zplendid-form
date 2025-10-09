import { ChangeEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import FormStep from '../organisms/FormStep';
import SubSection from '../organisms/SubSection';
import SelectField from '../molecules/SelectField';
import TextareaField from '../molecules/TextareaField';
import { FormData } from '../../hooks/useHealthForm';

interface MedicalHistoryStepProps {
  formData: FormData;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function MedicalHistoryStep({ formData, onInputChange, onNext, onPrevious }: MedicalHistoryStepProps) {
  const { t } = useLanguage();

  return (
    <FormStep
      title={t('step.medical')}
      onNext={onNext}
      onPrevious={onPrevious}
      showNext={true}
      showPrevious={true}
    >
      <div className="space-y-6">
        <SubSection title={t('section.medicalConditions')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label={t('field.highBloodPressure')}
              name="highBloodPressure"
              value={formData.highBloodPressure}
              onChange={onInputChange}
            >
              <option value="no">{t('common.no')}</option>
              <option value="yes">{t('common.yes')}</option>
            </SelectField>

            <SelectField
              label={t('field.diabetes')}
              name="diabetes"
              value={formData.diabetes}
              onChange={onInputChange}
            >
              <option value="no">{t('common.no')}</option>
              <option value="yes">{t('common.yes')}</option>
            </SelectField>

            {formData.diabetes === 'yes' && (
              <SelectField
                label={t('field.useInsulin')}
                name="useInsulin"
                value={formData.useInsulin}
                onChange={onInputChange}
              >
                <option value="no">{t('common.no')}</option>
                <option value="yes">{t('common.yes')}</option>
              </SelectField>
            )}

            <SelectField
              label={t('field.sleepApnea')}
              name="sleepApnea"
              value={formData.sleepApnea}
              onChange={onInputChange}
            >
              <option value="no">{t('common.no')}</option>
              <option value="yes">{t('common.yes')}</option>
            </SelectField>

            {formData.sleepApnea === 'yes' && (
              <SelectField
                label={t('field.useCpap')}
                name="useCpap"
                value={formData.useCpap}
                onChange={onInputChange}
              >
                <option value="no">{t('common.no')}</option>
                <option value="yes">{t('common.yes')}</option>
              </SelectField>
            )}
          </div>
        </SubSection>

        <SubSection title={t('section.medications')}>
          <div className="space-y-4">
            <TextareaField
              label={t('field.medications')}
              name="medications"
              value={formData.medications}
              onChange={onInputChange}
              rows={3}
              placeholder={t('placeholder.medications')}
            />

            <TextareaField
              label={t('field.allergies')}
              name="allergies"
              value={formData.allergies}
              onChange={onInputChange}
              rows={2}
              placeholder={t('placeholder.allergies')}
            />
          </div>
        </SubSection>

        <SubSection title={t('section.socialHistory')}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label={t('field.smoking')}
              name="currentlySmoking"
              value={formData.currentlySmoking}
              onChange={onInputChange}
            >
              <option value="no">{t('common.no')}</option>
              <option value="yes">{t('common.yes')}</option>
            </SelectField>

            <SelectField
              label={t('field.alcohol')}
              name="alcoholConsumption"
              value={formData.alcoholConsumption}
              onChange={onInputChange}
            >
              <option value="no">{t('common.no')}</option>
              <option value="yes">{t('common.yes')}</option>
            </SelectField>
          </div>
        </SubSection>

        <SubSection title={t('section.previousSurgery')}>
          <SelectField
            label={t('field.previousWeightLossSurgery')}
            name="previousWeightLossSurgery"
            value={formData.previousWeightLossSurgery}
            onChange={onInputChange}
          >
            <option value="no">{t('common.no')}</option>
            <option value="yes">{t('common.yes')}</option>
          </SelectField>
        </SubSection>
      </div>
    </FormStep>
  );
}

