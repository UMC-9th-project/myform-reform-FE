import Button from '../../common/button_tmp/button1';
import type { PaymentSummary } from '../../../types/domain/cart/cart';

interface PaymentSummaryProps {
  payment: PaymentSummary;
  onCheckout: () => void;
}

const PaymentSummaryCard = ({ payment, onCheckout }: PaymentSummaryProps) => {
  return (
    <div className="gap-[1.4375rem] flex-shrink-0 w-[26.4375rem] h-[29.875rem] mt-[4.375rem] flex flex-col">
      <div className="flex flex-col gap-[1.6875rem] px-[2.375rem] py-[2.3125rem] bg-[var(--color-white)] rounded-[10px] border border-[var(--color-line-gray-40)]">
        <div className="heading-h5-sb">결제금액</div>
        <div className="flex flex-col gap-[0.5625rem] pb-[2.0625rem] border-b border-[var(--color-line-gray-40)]">
          <div className="flex justify-between body-b0-sb text-[var(--color-gray-50)]">
            <div>상품 금액</div>
            <div>{payment.productTotal.toLocaleString()}원</div>
          </div>
          <div className="flex justify-between body-b0-sb text-[var(--color-gray-50)]">
            <div>배송비</div>
            <div>{payment.shippingTotal.toLocaleString()}원</div>
          </div>
        </div>
        <div className="items-center flex justify-between body-b0-sb text-[var(--color-gray-50)]">
          <div>결제 예정 금액</div>
          <div className="heading-h4-bd text-[var(--color-mint-1)]">
            {payment.total.toLocaleString()}원
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        className="!w-full !h-[3.75rem] body-b0-bd"
        onClick={onCheckout}
      >
        결제하기
      </Button>
    </div>
  );
};

export default PaymentSummaryCard;
