import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = "px-8 py-3 font-semibold rounded-lg transition-colors";
  
  const variantClasses = {
    primary: "bg-[#212e5c] text-white hover:bg-[#1a2347] shadow-md",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300"
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

