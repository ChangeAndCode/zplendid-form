import { ReactNode } from 'react';

interface SubSectionProps {
  title: string;
  children: ReactNode;
}

export default function SubSection({ title, children }: SubSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[#212e5c] mb-4">{title}</h3>
      {children}
    </div>
  );
}

