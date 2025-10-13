import { TextareaHTMLAttributes } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function Textarea({ className = '', value = '', ...props }: TextareaProps) {
  const baseClasses = "w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-[#212e5c] focus:ring-2 focus:ring-[#212e5c] focus:ring-opacity-20 transition-colors resize-none";
  
  return (
    <textarea
      className={`${baseClasses} ${className}`}
      value={value}
      {...props}
    />
  );
}

