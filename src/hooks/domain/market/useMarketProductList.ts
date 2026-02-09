import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMarketProductList } from '../../../api/market/market';
import type { MarketProductItem } from '../../../types/api/market/market';

export type MarketCategorySelection = {
  categoryTitle: string;
  itemLabel: string;
  categoryId?: string;
} | null;

export const useMarketProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<MarketCategorySelection>(null);
  const [sort, setSort] = useState<'popular' | 'latest'>('popular');

  const categoryId = selectedCategory?.categoryId;

  const { data: productListResponse } = useQuery({
    queryKey: ['market-product-list', currentPage, categoryId, sort],
    queryFn: async () => {
      const data = await getMarketProductList({
        categoryId,

        sort,
        page: currentPage,
        limit: 15,
      });

     

      return data;
    },
    staleTime: 1000 * 30,
  });

  const products: MarketProductItem[] = productListResponse?.success.items ?? [];
  const hasNextPage = products.length >= 15;
  const totalPages = currentPage + (hasNextPage ? 1 : 0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (
    _categoryIndex: number,
    _itemId: number,
    categoryTitle: string,
    itemLabel: string,
    categoryId?: string
  ) => {
    setSelectedCategory({ categoryTitle, itemLabel, categoryId });
    setCurrentPage(1);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const handleSortChange = (value: 'popular' | 'latest') => {
    setSort(value);
    setCurrentPage(1);
  };

  return {
    products,
    currentPage,
    selectedCategory,
    totalPages,
    sort,
    handlePageChange,
    handleCategoryChange,
    handleClearSelection,
    handleSortChange,
  };
};
