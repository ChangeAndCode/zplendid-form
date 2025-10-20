import { useLanguage } from '../../context/LanguageContext';
import StepNumber from '../atoms/StepNumber';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const { t } = useLanguage();
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-8 mb-6">
        <StepNumber 
          stepNumber={currentStep}
          totalSteps={totalSteps}
          isActive={true}
        />
        <div className="text-center">
          <div className="text-lg font-semibold text-[#212e5c]">
            {t('progress.step')} {currentStep} {t('progress.of')} {totalSteps}
          </div>
          <div className="text-sm text-gray-600">
            {percentage}% {t('progress.complete')}
          </div>
        </div>
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#212e5c] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

