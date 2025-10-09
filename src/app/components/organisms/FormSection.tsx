import { ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="pt-6">
      <h3 className="text-xl font-semibold text-[#212e5c] mb-4">{title}</h3>
      {children}
    </div>
  );
}

