import { useState, useMemo, useCallback } from 'react';
import type {
  CartProduct,
  CartSeller,
  PaymentSummary,
} from '../../../types/domain/cart/cart';

interface UseCartProps {
  initialProducts: CartProduct[];
  sellers: CartSeller[];
}

export const useCart = ({ initialProducts, sellers }: UseCartProps) => {
  const [products, setProducts] = useState<CartProduct[]>(initialProducts);
  const [quantities, setQuantities] = useState<number[]>(
    new Array(initialProducts.length).fill(1)
  );
  const [sellerChecked, setSellerChecked] = useState<boolean[]>(
    new Array(sellers.length).fill(false)
  );
  const [itemChecked, setItemChecked] = useState<boolean[]>(
    new Array(initialProducts.length).fill(false)
  );

  // 전체 선택 상태 계산
  const totalItems = products.length;
  const checkedCount = itemChecked.filter(Boolean).length;
  const isAllChecked = checkedCount === totalItems && totalItems > 0;

  // 결제 금액 계산
  const payment: PaymentSummary = useMemo(() => {
    let productTotal = 0;
    products.forEach((product, index) => {
      if (itemChecked[index]) {
        productTotal += product.price * quantities[index];
      }
    });

    const sellerIndices = new Set<number>();
    products.forEach((product, index) => {
      if (itemChecked[index]) {
        sellerIndices.add(product.sellerId);
      }
    });

    let shippingTotal = 0;
    sellerIndices.forEach((sellerId) => {
      const seller = sellers.find((s) => s.id === sellerId);
      if (seller) {
        shippingTotal += seller.shippingFee;
      }
    });

    return {
      productTotal,
      shippingTotal,
      total: productTotal + shippingTotal,
    };
  }, [products, itemChecked, quantities, sellers]);

  // 전체 선택 핸들러
  const handleAllCheck = useCallback(
    (checked: boolean) => {
      setItemChecked(new Array(products.length).fill(checked));
      setSellerChecked(new Array(sellers.length).fill(checked));
    },
    [products.length, sellers.length]
  );

  // 개별 아이템 체크박스 핸들러
  const handleItemCheck = useCallback(
    (index: number, checked: boolean) => {
      const newItemChecked = [...itemChecked];
      newItemChecked[index] = checked;
      setItemChecked(newItemChecked);

      // 판매자별 체크박스 상태 업데이트
      const product = products[index];
      const sellerProducts = products.filter(
        (p) => p.sellerId === product.sellerId
      );
      const sellerProductIndices = sellerProducts.map((p) =>
        products.findIndex((prod) => prod.id === p.id)
      );
      const sellerAllChecked = sellerProductIndices.every(
        (idx) => newItemChecked[idx]
      );
      const newSellerChecked = [...sellerChecked];
      const sellerIndex = sellers.findIndex((s) => s.id === product.sellerId);
      if (sellerIndex !== -1) {
        newSellerChecked[sellerIndex] = sellerAllChecked;
        setSellerChecked(newSellerChecked);
      }
    },
    [itemChecked, products, sellerChecked, sellers]
  );

  // 판매자 체크박스 핸들러
  const handleSellerCheck = useCallback(
    (sellerId: number, checked: boolean) => {
      const sellerIndex = sellers.findIndex((s) => s.id === sellerId);
      if (sellerIndex === -1) return;

      const newSellerChecked = [...sellerChecked];
      newSellerChecked[sellerIndex] = checked;
      setSellerChecked(newSellerChecked);

      // 해당 판매자의 모든 아이템 체크박스 업데이트
      const newItemChecked = [...itemChecked];
      products.forEach((product, index) => {
        if (product.sellerId === sellerId) {
          newItemChecked[index] = checked;
        }
      });
      setItemChecked(newItemChecked);
    },
    [sellerChecked, sellers, itemChecked, products]
  );

  // 수량 변경 핸들러
  const handleQuantityChange = useCallback(
    (index: number, newQuantity: number) => {
      const newQuantities = [...quantities];
      newQuantities[index] = Math.max(1, newQuantity);
      setQuantities(newQuantities);
    },
    [quantities]
  );

  // 상품 삭제 핸들러
  const deleteProduct = useCallback(
    (productId: number) => {
      const productIndex = products.findIndex((p) => p.id === productId);
      if (productIndex === -1) return;

      const newProducts = products.filter((p) => p.id !== productId);
      setProducts(newProducts);
      setQuantities(quantities.filter((_, idx) => idx !== productIndex));
      setItemChecked(itemChecked.filter((_, idx) => idx !== productIndex));

      // 판매자 체크박스 상태 업데이트
      const remainingSellers = new Set(newProducts.map((p) => p.sellerId));
      const newSellerChecked = sellers.map((seller) => {
        if (!remainingSellers.has(seller.id)) return false;
        const sellerProducts = newProducts.filter(
          (p) => p.sellerId === seller.id
        );
        const sellerProductIndices = sellerProducts.map((p) =>
          newProducts.findIndex((prod) => prod.id === p.id)
        );
        const newItemCheckedAfterDelete = itemChecked.filter(
          (_, idx) => idx !== productIndex
        );
        return sellerProductIndices.every(
          (idx) => newItemCheckedAfterDelete[idx]
        );
      });
      setSellerChecked(newSellerChecked);
    },
    [products, quantities, itemChecked, sellers]
  );

  // 선택 삭제 핸들러
  const deleteSelected = useCallback(() => {
    const indicesToDelete = itemChecked
      .map((checked, index) => (checked ? index : -1))
      .filter((index) => index !== -1)
      .sort((a, b) => b - a);

    if (indicesToDelete.length === 0) return;

    const newProducts = products.filter(
      (_, index) => !indicesToDelete.includes(index)
    );
    setProducts(newProducts);
    setQuantities(
      quantities.filter((_, idx) => !indicesToDelete.includes(idx))
    );
    setItemChecked(new Array(newProducts.length).fill(false));
    setSellerChecked(new Array(sellers.length).fill(false));
  }, [itemChecked, products, quantities, sellers.length]);

  return {
    products,
    sellers,
    quantities,
    sellerChecked,
    itemChecked,
    totalItems,
    checkedCount,
    isAllChecked,
    payment,
    handleAllCheck,
    handleItemCheck,
    handleSellerCheck,
    handleQuantityChange,
    deleteProduct,
    deleteSelected,
  };
};
