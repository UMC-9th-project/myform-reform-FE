// 주문서 조회 커스텀 훅
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrderSheet } from '../../../services/payment/paymentService';

interface UseOrderSheetParams {
  itemId: string;
  optionItemIds: string[];
  quantity: number;
  enabled?: boolean;
}

/**
 * 주문서 조회 훅 (배송비 및 총 금액 조회)
 */
export const useOrderSheet = ({
  itemId,
  optionItemIds,
  quantity,
  enabled = true,
}: UseOrderSheetParams) => {
  const [shippingFee, setShippingFee] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const { data: orderSheet, isLoading, error } = useQuery({
    queryKey: ['order-sheet', itemId, optionItemIds, quantity],
    queryFn: () => fetchOrderSheet({
      item_id: itemId,
      option_item_ids: optionItemIds,
      quantity,
    }),
    enabled: enabled && !!itemId && optionItemIds.length >= 0,
    staleTime: 1000 * 30, // 30초
  });

  useEffect(() => {
    if (orderSheet) {
      const deliveryFee = orderSheet.delivery_fee || orderSheet.payment?.delivery_fee || 0;
      const totalAmount = orderSheet.payment?.total_amount || 0;
      
      setShippingFee(deliveryFee);
      setTotalPrice(totalAmount);
    }
  }, [orderSheet]);

  return {
    orderSheet,
    shippingFee,
    totalPrice,
    isLoading,
    error,
    receiptNumber: orderSheet?.receipt_number,
  };
};
