import React from 'react';

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`
        w-full
        h-[3.375rem]
        px-4
        body-b1-rg
        text-[var(--color-gray-60)]
        bg-[var(--color-gray-20)]
        border border-transparent
        focus:border-[var(--color-black)]
        focus:bg-[var(--color-white)]
        placeholder:text-[var(--color-gray-50)]
        focus:outline-none


        ${className}
      `}
      {...props}
    />
  );
});

Input.displayName = 'Input';
export default Input;
