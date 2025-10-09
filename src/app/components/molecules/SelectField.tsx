import { SelectHTMLAttributes, ReactNode } from 'react';
import Select from '../atoms/Select';
import Label from '../atoms/Label';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  optional?: boolean;
  optionalText?: string;
  children: ReactNode;
}

export default function SelectField({ label, optional, optionalText, children, ...props }: SelectFieldProps) {
  return (
    <div>
      <Label optional={optional} optionalText={optionalText}>{label}</Label>
      <Select {...props}>
        {children}
      </Select>
    </div>
  );
}

