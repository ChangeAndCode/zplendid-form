import { InputHTMLAttributes, useEffect, useState } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className = '', value, ...props }: InputProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const baseClasses = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#212e5c] focus:ring-2 focus:ring-[#212e5c] focus:ring-opacity-20 transition-colors";
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  return (
    <input
      className={`${baseClasses} ${className}`}
      value={isHydrated ? (value || '') : ''}
      {...props}
    />
  );
}

