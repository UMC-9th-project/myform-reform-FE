import { useState } from 'react';
import checkedIcon from './icons/circle/checked.svg';
import uncheckedIcon from './icons/circle/unchecked.svg';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: 'default' | 'small';
}

export default function Checkbox({
  checked: controlledChecked,
  onChange,
  disabled = false,
  className = '',
  size = 'default',
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(false);

  const isChecked =
    controlledChecked !== undefined ? controlledChecked : internalChecked;

  const handleClick = () => {
    if (disabled) return;

    const newChecked = !isChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(newChecked);
    }
    if (onChange) {
      onChange(newChecked);
    }
  };

  const sizeClass = size === 'small' ? 'w-5 h-5' : 'w-[30px] h-[30px]';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`flex items-center justify-center cursor-pointer disabled:cursor-not-allowed ${sizeClass} ${className}`}
    >
      <img
        src={isChecked ? checkedIcon : uncheckedIcon}
        alt={isChecked ? 'checked' : 'unchecked'}
        className="w-full h-full"
      />
    </button>
  );
}
