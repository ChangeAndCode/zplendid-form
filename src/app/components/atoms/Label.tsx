import { ReactNode } from 'react';

interface LabelProps {
  children: ReactNode;
  optional?: boolean;
  optionalText?: string;
}

export default function Label({ children, optional, optionalText }: LabelProps) {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {children}
      {optional && <span className="text-gray-500"> {optionalText}</span>}
    </label>
  );
}

