import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

type FormInputProps = {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  rules?: Record<string, any>;
  error?: FieldError;
  className?: string;
};

export const FormValidateInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  register,
  rules,
  error,
  className = "",
}) => {
  return (
    <div className={className}>
      {label && <label htmlFor={id} className="sr-only">{label}</label>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`appearance-none relative block w-full px-3 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        {...register(id, rules)}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
