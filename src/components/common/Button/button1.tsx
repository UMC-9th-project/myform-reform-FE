import React from 'react';

type ButtonSize = 'default' | 'big';
/*
 버튼 스타일 변형
  - primary: 기본 활성화 버튼 (teal 배경)
  - disabled: 비활성화 버튼 (회색 배경, 자동으로 disabled 처리)
  - outlined-mint: 테두리만 있는 버튼 (teal 테두리)
  - white: 테두리만 있는 버튼 (회색 테두리)
 */
type ButtonVariant = 'primary' | 'disabled' | 'outlined-mint' | 'white';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 크기 (default: 작은 글씨, big: 큰 글씨) */
  size?: ButtonSize;
  /** 버튼 스타일 변형 */
  variant?: ButtonVariant;
}

const TYPOGRAPHY_CLASSES = {
  default: 'body-b0-bd',
  big: 'heading-h5-sb',
} as const;

const PADDING_CLASSES = {
  default: 'px-[1.875rem] py-[1.375rem]',
  big: 'px-[1.54375rem] py-[1.1875rem]',
} as const;

const VARIANT_STYLES = {
  primary: 'text-white bg-[#05D4CD] hover:bg-[#00CAC3]',
  disabled: 'text-[#5C6F7F] bg-[#EBEBEB] cursor-not-allowed', // 비활성화 버튼 (hover 효과 없음)
  'outlined-mint':
    'text-[#05D4CD] bg-white border border-[#05D4CD] hover:bg-[#F7F8F9]',
  white: 'text-black bg-white border border-[#EBEBEB] hover:border-[#5C6F7F]',
} as const;

export default function Button({
  size = 'default',
  variant = 'primary',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  // 사이즈에 따른 타이포그래피 클래스
  const typographyClass = TYPOGRAPHY_CLASSES[size];

  // 사이즈에 따른 패딩 클래스
  const paddingClass = PADDING_CLASSES[size];

  // variant에 따른 스타일 클래스
  const variantClass = VARIANT_STYLES[variant];

  // disabled variant는 비활성화 버튼이므로 항상 disabled
  const isDisabled = variant === 'disabled' || disabled;

  return (
    <button
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center
        gap-[0.625rem]
        rounded-[0.625rem]
        ${typographyClass}
        ${paddingClass}
        ${variantClass}
        ${isDisabled ? '' : 'transition-colors duration-200'}
        ${isDisabled ? 'opacity-60' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
