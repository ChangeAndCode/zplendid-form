import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  optional?: boolean;
}

export default function Input({ label, optional, className = '', ...props }: InputProps) {
  const baseClasses = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#212e5c] focus:ring-2 focus:ring-[#212e5c] focus:ring-opacity-20 transition-colors";
  
  return (
    <input
      className={`${baseClasses} ${className}`}
      {...props}
    />
  );
}

