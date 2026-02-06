import { useState } from 'react';

export type OrderCategorySelection = {
  categoryTitle: string;
  itemLabel: string;
} | null;

export const useOrderProposalList = (
  proposals: {
    id: number;
    img: string;
    name: string;
    price: string;
    review: number;
    reviewCount: number;
    nickname: string;
  }[],
  itemsPerPage: number
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<OrderCategorySelection>(null);
  const [sortValue, setSortValue] = useState<string>('popular');

  const totalPages = Math.ceil(proposals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProposals = proposals.slice(startIndex, endIndex);

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

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setCurrentPage(1);
  };

  return {
    currentPage,
    selectedCategory,
    sortValue,
    displayedProposals,
    totalPages,
    handlePageChange,
    handleCategoryChange,
    handleSortChange,
  };
};
