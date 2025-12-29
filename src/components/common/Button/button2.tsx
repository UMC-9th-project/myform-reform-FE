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
    'bg-[#F2FDFC] border border-[#68D8D6] text-[#07BEB8] hover:bg-[#E5F6F4] cursor-pointer',
  disabled:
    'bg-[#E9EBEE] border border-[#ADB0B5] text-[#646F7C] cursor-not-allowed',
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
