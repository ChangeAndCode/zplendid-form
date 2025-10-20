interface StepNumberProps {
  stepNumber: number;
  totalSteps: number;
  isActive?: boolean;
  isCompleted?: boolean;
  className?: string;
}

export default function StepNumber({ 
  stepNumber, 
  totalSteps, 
  isActive = false, 
  isCompleted = false,
  className = ''
}: StepNumberProps) {
  const getStepStyles = () => {
    if (isCompleted) {
      return 'bg-green-500 text-white';
    }
    if (isActive) {
      return 'bg-[#212e5c] text-white';
    }
    return 'bg-gray-200 text-gray-600';
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Número grande prominente */}
      <div className={`
        w-16 h-16 sm:w-20 sm:h-20 
        rounded-xl sm:rounded-2xl
        flex items-center justify-center
        font-bold text-2xl sm:text-3xl
        transition-all duration-300
        shadow-lg
        ${getStepStyles()}
      `}>
        {stepNumber}
      </div>
      
      {/* Indicador graduado */}
      <div className="flex items-center gap-1 mt-2">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`
              w-2 h-2 rounded-full
              transition-all duration-300
              ${index < stepNumber 
                ? 'bg-[#212e5c]' 
                : index === stepNumber - 1 
                  ? 'bg-[#212e5c]' 
                  : 'bg-gray-300'
              }
            `}
          />
        ))}
      </div>
    </div>
  );
}
