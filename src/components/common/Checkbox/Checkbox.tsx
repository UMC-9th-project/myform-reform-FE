import { useState } from 'react';
import squareCheckedIcon from './icons/square/checked.svg';
import squareUncheckedIcon from './icons/square/disabled.svg';
import circleCheckedIcon from './icons/circle/checked.svg';
import circleUncheckedIcon from './icons/circle/unchecked.svg';

type CheckboxVariant = 'circle' | 'square';

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  variant?: CheckboxVariant;
}

const Checkbox = ({
  checked: controlledChecked,
  onChange,
  disabled = false,
  className = '',
  label,
  variant = 'square',
}: CheckboxProps) => {
  const [uncontrolledChecked, setUncontrolledChecked] = useState(false);

  // controlled 또는 uncontrolled 모드 지원
  const isChecked =
    controlledChecked !== undefined ? controlledChecked : uncontrolledChecked;

  // variant에 따라 아이콘 선택
  const getIcon = () => {
    if (variant === 'circle') {
      return isChecked ? circleCheckedIcon : circleUncheckedIcon;
    } else {
      return isChecked ? squareCheckedIcon : squareUncheckedIcon;
    }
  };

  const handleClick = () => {
    if (disabled) return;

    const newChecked = !isChecked;

    if (controlledChecked === undefined) {
      // uncontrolled 모드
      setUncontrolledChecked(newChecked);
    }

    // onChange 콜백 호출
    onChange?.(newChecked);
  };

  return (
    <div className={`flex items-center gap-[8px] ${className}`}>
      <button
        onClick={handleClick}
        disabled={disabled}
        className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
      >
        <img
          src={getIcon()}
          alt={isChecked ? 'checked' : 'unchecked'}
          className="w-5 h-5"
        />
      </button>
      {label && (
        <span
          onClick={handleClick}
          className={
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }
        >
          {label}
        </span>
      )}
    </div>
  );
};

export default Checkbox;
