import { useLanguage } from '../../context/LanguageContext';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const { t } = useLanguage();
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          {t('progress.step')} {currentStep} {t('progress.of')} {totalSteps}
        </span>
        <span className="text-sm text-gray-600">
          {percentage}% {t('progress.complete')}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#212e5c] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

