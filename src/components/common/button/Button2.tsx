import React from 'react';

/*
 버튼 스타일 변형
  - default: 기본 활성화 버튼 
  - disabled: 비활성화 버튼 
 */
type Button2Variant = 'default' | 'disabled';

interface Button2Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Button2Variant;
}

const VARIANT_STYLES = {
  default:
    'bg-[var(--color-mint-6)] border border-[var(--color-mint-3)] text-[var(--color-mint-1)] hover:bg-[var(--color-mint-5)] cursor-pointer',
  disabled:
    'bg-[var(--color-gray-30)] border border-[var(--color-gray-40)] text-[var(--color-gray-50)] cursor-not-allowed',
} as const;

export default function Button2({
  variant = 'default',
  className = '',
  children,
  disabled,
  ...props
}: Button2Props) {
  const variantClass = VARIANT_STYLES[variant];
  const isDisabled = variant === 'disabled' || disabled;

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        body-b1-rg
        rounded-[0.625rem]
        px-6 py-5
        ${variantClass}
        ${isDisabled ? '' : 'transition-colors duration-200'}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
