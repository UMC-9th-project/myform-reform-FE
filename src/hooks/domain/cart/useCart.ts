import { useState, useMemo, useCallback } from 'react';
import type {
  CartProduct,
  CartSeller,
  PaymentSummary,
} from '@/types/api/cart/cart';

interface UseCartProps {
  initialProducts: CartProduct[];
  sellers: CartSeller[];
  initialQuantities?: number[];
}

export const useCart = ({ initialProducts, sellers, initialQuantities }: UseCartProps) => {
  const [products, setProducts] = useState<CartProduct[]>(initialProducts);
  const [quantities, setQuantities] = useState<number[]>(
    initialQuantities || new Array(initialProducts.length).fill(1)
  );
  const [sellerChecked, setSellerChecked] = useState<boolean[]>(
    new Array(sellers.length).fill(false)
  );
  const [itemChecked, setItemChecked] = useState<boolean[]>(
    new Array(initialProducts.length).fill(false)
  );

  if (products.length !== initialProducts.length || 
      products.some((p, i) => p.id !== initialProducts[i]?.id)) {
    setProducts(initialProducts);
    setQuantities(initialQuantities || new Array(initialProducts.length).fill(1));
    setSellerChecked(new Array(sellers.length).fill(false));
    setItemChecked(new Array(initialProducts.length).fill(false));
  }

  const totalItems = products.length;
  const checkedCount = itemChecked.filter(Boolean).length;
  const isAllChecked = checkedCount === totalItems && totalItems > 0;

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

  const handleAllCheck = useCallback(
    (checked: boolean) => {
      setItemChecked(new Array(products.length).fill(checked));
      setSellerChecked(new Array(sellers.length).fill(checked));
    },
    [products.length, sellers.length]
  );

  const handleItemCheck = useCallback(
    (index: number, checked: boolean) => {
      const newItemChecked = [...itemChecked];
      newItemChecked[index] = checked;
      setItemChecked(newItemChecked);

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

  const handleSellerCheck = useCallback(
    (sellerId: number, checked: boolean) => {
      const sellerIndex = sellers.findIndex((s) => s.id === sellerId);
      if (sellerIndex === -1) return;

      const newSellerChecked = [...sellerChecked];
      newSellerChecked[sellerIndex] = checked;
      setSellerChecked(newSellerChecked);

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

  const handleQuantityChange = useCallback(
    (index: number, newQuantity: number) => {
      const newQuantities = [...quantities];
      newQuantities[index] = Math.max(1, newQuantity);
      setQuantities(newQuantities);
    },
    [quantities]
  );

  const deleteProduct = useCallback(
    (productId: number) => {
      const productIndex = products.findIndex((p) => p.id === productId);
      if (productIndex === -1) return;

      const newProducts = products.filter((p) => p.id !== productId);
      setProducts(newProducts);
      setQuantities(quantities.filter((_, idx) => idx !== productIndex));
      setItemChecked(itemChecked.filter((_, idx) => idx !== productIndex));

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
