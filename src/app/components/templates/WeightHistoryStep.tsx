import { ChangeEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import FormStep from '../organisms/FormStep';
import SubSection from '../organisms/SubSection';
import FormField from '../molecules/FormField';
import SelectField from '../molecules/SelectField';
import { FormData } from '../../hooks/useHealthForm';

interface WeightHistoryStepProps {
  formData: FormData;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function WeightHistoryStep({ formData, onInputChange, onNext, onPrevious }: WeightHistoryStepProps) {
  const { t } = useLanguage();

  return (
    <FormStep
      title={t('step.weight')}
      onNext={onNext}
      onPrevious={onPrevious}
      showNext={true}
      showPrevious={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label={t('field.highestWeight')}
          type="number"
          name="highestWeight"
          value={formData.highestWeight}
          onChange={onInputChange}
          placeholder={t('placeholder.weightHistory')}
        />

        <FormField
          label={t('field.when')}
          type="date"
          name="highestWeightDate"
          value={formData.highestWeightDate}
          onChange={onInputChange}
        />

        <FormField
          label={t('field.lowestWeight')}
          type="number"
          name="lowestWeight"
          value={formData.lowestWeight}
          onChange={onInputChange}
          placeholder={t('placeholder.weightHistory')}
        />

        <FormField
          label={t('field.when')}
          type="date"
          name="lowestWeightDate"
          value={formData.lowestWeightDate}
          onChange={onInputChange}
        />

        <FormField
          label={t('field.currentWeight')}
          type="number"
          name="currentWeight"
          value={formData.currentWeight}
          onChange={onInputChange}
          placeholder={t('placeholder.weight')}
        />

        <FormField
          label={t('field.goalWeight')}
          type="number"
          name="goalWeight"
          value={formData.goalWeight}
          onChange={onInputChange}
          placeholder={t('placeholder.weightHistory')}
        />
      </div>

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
    </FormStep>
  );
}

