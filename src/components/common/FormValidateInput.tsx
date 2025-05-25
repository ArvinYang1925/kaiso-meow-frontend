import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
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
  const [isShowPassword, setIsShowPassword] = useState(false);
  const isPasswordType = type === "password";

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-900">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          min={0}
          type={isPasswordType && isShowPassword ? "text" : type}
          placeholder={placeholder}
          className={`appearance-none block w-full px-3 pr-10 h-[40px] border ${
            error ? "border-red-500" : "border-gray-300"
          } placeholder-slate-400 text-gray-900 rounded-md focus:outline-none focus:border-slate-500 sm:text-sm`}
          {...register(id, rules)}
        />

        {isPasswordType && (
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
            onClick={() => setIsShowPassword(!isShowPassword)}
            tabIndex={-1}
          >
            {isShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
