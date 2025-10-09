import { TextareaHTMLAttributes } from 'react';
import Textarea from '../atoms/Textarea';
import Label from '../atoms/Label';

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  optional?: boolean;
  optionalText?: string;
}

export default function TextareaField({ label, optional, optionalText, ...props }: TextareaFieldProps) {
  return (
    <div>
      <Label optional={optional} optionalText={optionalText}>{label}</Label>
      <Textarea {...props} />
    </div>
  );
}

