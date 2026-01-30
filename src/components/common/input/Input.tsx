import { useState } from 'react';
import type { ReactNode } from 'react';
import eyeIcon from './icons/eye_tmp.svg';
import eyeOffIcon from './icons/eyeOff_tmp.svg';
type InputType = 'email' | 'password' | 'text' | 'tel';
type InputVariant = 'login' | 'signup';

interface InputProps {
  label?: string;
  required?: boolean;
  placeholder?: string;
  variant?: InputVariant;
  type: InputType;
  value?: string;
  error?: string | null;
  showErrorText?: boolean; 
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
  variant,
  type,
  value: controlledValue,
  error,
  showErrorText = true, 
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
  const [showPassword, setShowPassword] = useState(false);

  const currentValue =
    controlledValue !== undefined ? controlledValue : internalValue;

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

    if (onChange) {
      onChange(value);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const getBorderColor = () => {
    if (error) return 'border-[var(--color-red-1)]';
    if (isFocused) {
      return variant === 'login'
        ?  'border-[var(--color-line-gray-40)]'
        : 'border-[var(--color-black)]';
    }
    return variant === 'login'
    ?  'border-[var(--color-line-gray-40)]'
    : 'border-[var(--color-black)]';
  };


  const getInputStyles = () => {
    const baseStyles = 'w-full rounded-[0.9375rem] px-[1.375rem] py-[1.4375rem] body-b1-rg border focus:outline-none transition-colors duration-200';
    
    if (variant === 'login') {
      if (error) {
        return `
          ${baseStyles}
          bg-[#FFEEEE]
          border-[var(--color-red-1)]
         
          ${getBorderColor()}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `;
      }
      return `
        ${baseStyles}
        text-[var(--color-black)]
        focus:border-[var(--color-black)]
        ${getBorderColor()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `;
    }
    
    if (error) {
      return `
        ${baseStyles}
        border-[var(--color-red-1)]
        ${getBorderColor()}
        ${hasRightContent ? (type === 'tel' || (type === 'text' && timerSeconds !== null) ? 'pr-[5rem]' : 'pr-[3rem]') : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `;
    }
    
    return `
      ${baseStyles}
      border-[var(--color-line-gray-40)]
      focus:border-[var(--color-black)]
      ${getBorderColor()}
      ${hasRightContent ? (type === 'tel' || (type === 'text' && timerSeconds !== null) ? 'pr-[5rem]' : 'pr-[3rem]') : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `;
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
    <div className={`flex flex-col ${variant === 'login' ? 'gap-[0.5625rem]' : 'gap-[0.5rem]'}`}>
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
            className={getInputStyles()}
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
      {error && showErrorText && (
        <p className="body-b2-rg text-[var(--color-red-1)] mt-1">{error}</p>
      )}
    </div>
  );
}
