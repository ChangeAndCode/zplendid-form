import { ChangeEvent } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import FormStep from '../organisms/FormStep';
import FormSection from '../organisms/FormSection';
import FormField from '../molecules/FormField';
import SelectField from '../molecules/SelectField';
import { FormData } from '../../hooks/useHealthForm';

interface PersonalInfoStepProps {
  formData: FormData;
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
}

export default function PersonalInfoStep({ formData, onInputChange, onNext }: PersonalInfoStepProps) {
  const { t } = useLanguage();

  return (
    <FormStep
      title={t('step.personal')}
      onNext={onNext}
      showNext={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label={t('field.firstName')}
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={onInputChange}
          required
          placeholder={t('placeholder.firstName')}
        />

        <FormField
          label={t('field.lastName')}
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={onInputChange}
          required
          placeholder={t('placeholder.lastName')}
        />

        <FormField
          label={t('field.dateOfBirth')}
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={onInputChange}
          required
        />

        <FormField
          label={t('field.age')}
          type="text"
          name="age"
          value={formData.age}
          readOnly
          className="bg-gray-100 cursor-not-allowed text-gray-500"
          placeholder={t('placeholder.autoCalculated')}
        />

        <SelectField
          label={t('field.gender')}
          name="gender"
          value={formData.gender}
          onChange={onInputChange}
          required
        >
          <option value="">{t('common.select')}</option>
          <option value="male">{t('gender.male')}</option>
          <option value="female">{t('gender.female')}</option>
          <option value="other">{t('gender.other')}</option>
        </SelectField>

        <FormField
          label={t('field.phone')}
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={onInputChange}
          required
          placeholder={t('placeholder.phone')}
        />

        <FormField
          label={t('field.email')}
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          required
          placeholder={t('placeholder.email')}
        />

        <SelectField
          label={t('field.preferredContact')}
          name="preferredContact"
          value={formData.preferredContact}
          onChange={onInputChange}
          optional
          optionalText={t('field.optional')}
        >
          <option value="text">{t('contact.text')}</option>
          <option value="call">{t('contact.call')}</option>
          <option value="email">{t('contact.email')}</option>
        </SelectField>
      </div>

      <FormSection title={t('section.address')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField
              label={t('field.addressLine')}
              type="text"
              name="addressLine"
              value={formData.addressLine}
              onChange={onInputChange}
              placeholder={t('placeholder.address')}
            />
          </div>

          <FormField
            label={t('field.city')}
            type="text"
            name="city"
            value={formData.city}
            onChange={onInputChange}
            placeholder={t('placeholder.city')}
          />

          <FormField
            label={t('field.state')}
            type="text"
            name="state"
            value={formData.state}
            onChange={onInputChange}
            placeholder={t('placeholder.state')}
          />

          <FormField
            label={t('field.country')}
            type="text"
            name="country"
            value={formData.country}
            onChange={onInputChange}
            placeholder={t('placeholder.country')}
          />

          <FormField
            label={t('field.zipcode')}
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={onInputChange}
            placeholder={t('placeholder.zipcode')}
          />
        </div>
      </FormSection>

      <FormSection title={t('section.emergency')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label={t('field.emergencyFirstName')}
            type="text"
            name="emergencyFirstName"
            value={formData.emergencyFirstName}
            onChange={onInputChange}
            required
            placeholder={t('placeholder.emergencyName')}
          />

          <FormField
            label={t('field.emergencyLastName')}
            type="text"
            name="emergencyLastName"
            value={formData.emergencyLastName}
            onChange={onInputChange}
            required
            placeholder={t('placeholder.emergencyLastName')}
          />

          <FormField
            label={t('field.emergencyRelationship')}
            type="text"
            name="emergencyRelationship"
            value={formData.emergencyRelationship}
            onChange={onInputChange}
            required
            placeholder={t('placeholder.emergencyRelationship')}
          />

          <FormField
            label={t('field.emergencyPhone')}
            type="tel"
            name="emergencyPhone"
            value={formData.emergencyPhone}
            onChange={onInputChange}
            required
            placeholder={t('placeholder.phone')}
          />
        </div>
      </FormSection>
    </FormStep>
  );
}

