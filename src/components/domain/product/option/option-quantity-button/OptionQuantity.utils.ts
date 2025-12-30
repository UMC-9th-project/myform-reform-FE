import type { OptionQuantityProps } from './OptionQuantity.types';

export const getOptionQuantityProps = (
  props: OptionQuantityProps
): Required<OptionQuantityProps> => {
  return {
    quantity: props.quantity ?? 1,
    onIncrease: props.onIncrease ?? (() => {}),
    onDecrease: props.onDecrease ?? (() => {}),
    disabled: props.disabled ?? false,
  };
};
