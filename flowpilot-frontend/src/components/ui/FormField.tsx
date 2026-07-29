import React from "react";
import { cn } from "@/utils/cn";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({ label, error, children, required = false }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-primary-text mb-2">
        {label}
        {required && <span className="text-danger ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-sm text-danger mt-1">{error}</p>}
    </div>
  );
}

export default FormField;
