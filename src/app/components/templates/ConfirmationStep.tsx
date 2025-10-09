import { ChangeEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import FormStep from '../organisms/FormStep';
import TextareaField from '../molecules/TextareaField';
import { FormData } from '../../hooks/useHealthForm';

interface ConfirmationStepProps {
  formData: FormData;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onPrevious: () => void;
}

export default function ConfirmationStep({ formData, onInputChange, onPrevious }: ConfirmationStepProps) {
  const { t } = useLanguage();

  return (
    <FormStep
      title={t('step.confirmation')}
      onPrevious={onPrevious}
      showPrevious={true}
      showSubmit={true}
    >
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

