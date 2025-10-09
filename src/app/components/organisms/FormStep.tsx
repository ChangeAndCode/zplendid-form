import { ReactNode } from 'react';
import Button from '../atoms/Button';
import { useLanguage } from '../../context/LanguageContext';

interface FormStepProps {
  title: string;
  children: ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
  showSubmit?: boolean;
  nextDisabled?: boolean;
}

export default function FormStep({ 
  title, 
  children, 
  onNext, 
  onPrevious, 
  showPrevious = false,
  showNext = false,
  showSubmit = false,
  nextDisabled = false
}: FormStepProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg p-8 space-y-6 border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-semibold text-[#212e5c] mb-6">{title}</h2>
      
      {children}

      <div className="flex justify-between pt-4">
        {showPrevious && onPrevious && (
          <Button variant="secondary" type="button" onClick={onPrevious}>
            {t('button.previous')}
          </Button>
        )}
        
        {!showPrevious && <div />}
        
        {showNext && onNext && (
          <Button 
            type="button" 
            onClick={onNext}
            disabled={nextDisabled}
            className={nextDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {t('button.next')}
          </Button>
        )}
        
        {showSubmit && (
          <Button type="submit">
            {t('button.submit')}
          </Button>
        )}
      </div>
    </div>
  );
}

