import { InputHTMLAttributes } from 'react';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  optional?: boolean;
  optionalText?: string;
}

export default function FormField({ label, optional, optionalText, ...props }: FormFieldProps) {
  return (
    <div>
      <Label optional={optional} optionalText={optionalText}>{label}</Label>
      <Input {...props} />
    </div>
  );
}

