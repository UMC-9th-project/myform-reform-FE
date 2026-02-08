import { useState } from 'react';

export type OrderCategorySelection = {
  categoryTitle: string;
  itemLabel: string;
} | null;

export const useOrderRequestList = (requests: { id: number; img: string; name: string; price: string }[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<OrderCategorySelection>(null);

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedRequests = requests.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (
    _categoryIndex: number,
    _itemId: number,
    categoryTitle: string,
    itemLabel: string
  ) => {
    setSelectedCategory({ categoryTitle, itemLabel });
  };

  return {
    currentPage,
    selectedCategory,
    displayedRequests,
    totalPages,
    handlePageChange,
    handleCategoryChange,
  };
};
