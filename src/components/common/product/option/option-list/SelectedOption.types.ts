import type { OptionItem } from '../option-dropdown/OptionItem';

export interface SelectedOptionProps {
  option: OptionItem;
  optionNumber?: number;
  quantity?: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
}
