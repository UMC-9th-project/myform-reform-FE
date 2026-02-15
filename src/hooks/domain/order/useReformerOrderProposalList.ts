import { useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { getReformProposalList } from '../../../api/order/reformProposal';
import { getProfile } from '../../../api/profile/user';
import type {
  ReformProposalListItem,
  ReformProposalSortBy,
} from '../../../types/api/order/reformProposal';

const ITEMS_PER_PAGE = 15;

export type OrderCategorySelection = {
  categoryTitle: string;
  itemLabel: string;
} | null;

function mapSortValueToApiSort(sortValue: string): ReformProposalSortBy {
  if (sortValue === 'popular') return 'POPULAR';
  if (sortValue === 'latest') return 'RECENT';
  return 'POPULAR';
}

export const useReformerOrderProposalList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] =
    useState<OrderCategorySelection>(null);
  const [sortValue, setSortValue] = useState<string>('popular');

  // 기타 > 전체: 카테고리 안 넣으면 API에서 전체 반환
  const isOtherAll =
    selectedCategory?.categoryTitle === '기타' &&
    selectedCategory?.itemLabel === '전체';
  const category = isOtherAll ? undefined : selectedCategory?.categoryTitle;
  const subcategory = isOtherAll
    ? undefined
    : selectedCategory?.itemLabel && selectedCategory.itemLabel !== '전체'
      ? selectedCategory.itemLabel
      : undefined;
  const apiSortBy = mapSortValueToApiSort(sortValue);

  const { data: reformProposalListResponse, isLoading, isError } = useQuery({
    queryKey: [
      'reform-proposal-list',
      'reformer',
      currentPage,
      category,
      subcategory,
      apiSortBy,
    ],
    queryFn: async () => {
      const params = {
        sortBy: apiSortBy,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        category,
        subcategory,
      };
      console.log('[제안 목록 API] 요청 params:', params);
      const data = await getReformProposalList(params);

      if (data.resultType !== 'SUCCESS' || !data.success) {
        throw new Error(data.error?.message || '제안서 목록 조회 실패');
      }

      return data;
    },
    staleTime: 1000 * 30,
  });

  const proposals: ReformProposalListItem[] =
    reformProposalListResponse?.success ?? [];

  // 제안별로 닉네임(ownerName)으로 GET /profile/{id} 호출해 별점·리뷰 수 조회
  const profileResults = useQueries({
    queries: proposals.map((p) => ({
      queryKey: ['profile', 'by-nickname', p.ownerName],
      queryFn: () => getProfile(p.ownerName),
      enabled: !!p.ownerName,
      staleTime: 1000 * 60,
    })),
  });

  const proposalsWithProfile: ReformProposalListItem[] = proposals.map((p, i) => {
    const profileRes = profileResults[i]?.data;
    const fromProfile =
      profileRes?.resultType === 'SUCCESS' && profileRes?.success;
    return {
      ...p,
      ownerName: fromProfile ? profileRes.success!.nickname : p.ownerName,
      avgStar: fromProfile ? profileRes.success!.avgStar : p.avgStar,
      reviewCount: fromProfile ? profileRes.success!.reviewCount : p.reviewCount,
    };
  });

  const hasNextPage = proposals.length >= ITEMS_PER_PAGE;
  const totalPages = currentPage + (hasNextPage ? 1 : 0);

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
    setCurrentPage(1);
  };

  const handleClearSelection = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortValue(value);
    setCurrentPage(1);
  };

  return {
    proposals: proposalsWithProfile,
    isLoading,
    isError,
    currentPage,
    selectedCategory,
    sortValue,
    totalPages,
    handlePageChange,
    handleCategoryChange,
    handleClearSelection,
    handleSortChange,
  };
};
