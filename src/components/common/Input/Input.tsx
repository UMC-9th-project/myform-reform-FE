import { useState } from 'react';
import type { ReactNode } from 'react';
import { z } from 'zod';
import eyeIcon from './icons/Eye.svg';
import eyeOffIcon from './icons/EyeOff.svg';

type InputType = 'email' | 'password' | 'text' | 'tel';

interface InputProps {
  label?: string;
  required?: boolean;
  placeholder?: string;

  type: InputType;
  value?: string;
  schema?: z.ZodString;
  error?: string | null;
  showPasswordToggle?: boolean;
  timerSeconds?: number | null;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  className?: string;
  rightElement?: ReactNode;
  disabled?: boolean;
}

export default function Input({
  label,
  required,
  placeholder,
  type = 'text',
  value: controlledValue,
  schema,
  error: externalError,
  showPasswordToggle = false,
  timerSeconds = null,
  showButton = false,
  buttonText,
  onChange,
  onBlur,
  onFocus,
  rightElement,
  disabled = false,
}: InputProps) {
  const [internalValue, setInternalValue] = useState(controlledValue || '');
  const [isFocused, setIsFocused] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const currentValue =
    controlledValue !== undefined ? controlledValue : internalValue;
  const error = externalError !== undefined ? externalError : internalError;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (type === 'tel') {
      value = value.replace(/[^0-9]/g, '');
    } else if (type === 'text' && timerSeconds !== null && !showButton) {
      value = value.replace(/[^0-9]/g, '').slice(0, 6);
    }

    if (controlledValue === undefined) {
      setInternalValue(value);
    }

    if (schema) {
      if (value.trim() === '') {
        setInternalError(null);
      } else {
        const result = schema.safeParse(value);
        if (!result.success) {
          setInternalError(result.error.errors[0].message);
        } else {
          setInternalError(null);
        }
      }
    }

    if (onChange) {
      onChange(value);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();

    if (currentValue.trim() !== '' && schema) {
      const result = schema.safeParse(currentValue);
      if (!result.success) {
        setInternalError(result.error.errors[0].message);
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const getBorderColor = () => {
    if (error) return 'border-[var(--color-red-1)]';
    if (isFocused) return 'border-[var(--color-black)]';
    return 'border-[var(--color-line-gray-30)]';
  };

  const inputType = showPasswordToggle
    ? showPassword
      ? 'text'
      : 'password'
    : type;
  const hasRightContent =
    showPasswordToggle ||
    (timerSeconds !== null && timerSeconds > 0) ||
    rightElement;

  return (
    <div className="flex flex-col gap-[0.5rem]">
      {label && (
        <label className="body-b1-sb text-[var(--color-black)]">
          {label}
          {required && (
            <span className="text-[var(--color-red-1)] ml-1">*</span>
          )}
        </label>
      )}
      <div className="relative flex gap-[0.5rem]">
        <div className="relative flex-1">
          <input
            type={inputType}
            value={currentValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full
              px-[1.375rem]
              py-[1.4375rem]
              body-b1-rg
              border
              text-[var(--color-gray-50)]
              border-[var(--color-line-gray-40)]
              focus:border-[var(--color-black)]
              rounded-[0.9375rem]
              ${getBorderColor()}
              focus:outline-none
              transition-colors
              duration-200
              ${hasRightContent ? (type === 'tel' || (type === 'text' && timerSeconds !== null) ? 'pr-[5rem]' : 'pr-[3rem]') : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          />
          {hasRightContent && (
            <div className="absolute right-[1rem] top-1/2 -translate-y-1/2 flex items-center gap-[0.5rem]">
              {timerSeconds !== null && timerSeconds > 0 && (
                <span className="body-b3-rg text-[var(--color-gray-50)]">
                  {formatTime(timerSeconds)}
                </span>
              )}
              {showPasswordToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[var(--color-gray-50)] hover:text-[var(--color-black)] transition-colors"
                >
                  {showPassword ? (
                    <img src={eyeIcon} alt="eye" />
                  ) : (
                    <img src={eyeOffIcon} alt="eyeoff" />
                  )}
                </button>
              )}
              {rightElement}
            </div>
          )}
        </div>
        {showButton && (
          <button className="body-b1-rg bg-[var(--color-gray-30)] text-[var(--color-gray-50)] border border-[var(--color-line-gray-40)] rounded-[0.625rem] px-6 py-5  transition-colors duration-200 cursor-pointer">
            {buttonText}
          </button>
        )}
      </div>
      {error && (
        <p className="body-b2-rg text-[var(--color-red-1)] mt-1">{error}</p>
      )}
    </div>
  );
}
