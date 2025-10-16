import { SelectHTMLAttributes, ReactNode } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

export default function Select({ className = '', children, ...props }: SelectProps) {
  const baseClasses = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#212e5c] focus:ring-2 focus:ring-[#212e5c] focus:ring-opacity-20 transition-colors";
  
  return (
    <select
      className={`${baseClasses} ${className}`}
      suppressHydrationWarning={true}
      {...props}
    >
      {children}
    </select>
  );
}

