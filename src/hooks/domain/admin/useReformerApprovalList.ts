import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getReformerApprovalList } from '../../../api/admin/reformerApproval';
import type {
  ReformerStatus,
  ReformerFilterStatus,
  ReformerApplicationData,
} from '../../../types/api/admin/reformerApproval';

export type ApprovalStatus = ReformerStatus;
export type FilterStatus = ReformerFilterStatus;

export interface ReformerApplication {
  id: string;
  applicationDate: string;
  name: string;
  nickname: string;
  phoneNumber: string;
  email: string;
  status: ApprovalStatus;
}

const ITEMS_PER_PAGE = 10;

export const useReformerApprovalList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['reformer-approval-list', filterStatus, currentPage],
    queryFn: async () => {
      const response = await getReformerApprovalList({
        status: filterStatus,
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        order: 'desc',
      });

      if (response.resultType !== 'SUCCESS' || !response.success) {
        throw new Error(response.error?.reason || '리폼러 승인 목록 조회 실패');
      }

      return response;
    },
    staleTime: 1000 * 30, // 30초
  });

  // API 응답 데이터를 페이지에서 사용하는 형식으로 변환
  const applications: ReformerApplication[] =
    data?.success?.data.map((item) => ({
      id: item.owner_id,
      applicationDate: new Date().toISOString().split('T')[0], // API에 날짜 필드가 없어서 현재 날짜 사용
      name: item.name,
      nickname: item.nickname,
      phoneNumber: item.phone,
      email: item.email,
      status: item.status,
    })) ?? [];

  const totalCount = data?.success?.totalCount ?? 0;
  const totalPages = totalCount > 0 ? Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE)) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value as FilterStatus);
    setCurrentPage(1); // 필터 변경 시 첫 페이지로 이동
  };

  // 원본 API 데이터 (모달에서 사용)
  const rawApplications: ReformerApplicationData[] = data?.success?.data ?? [];

  return {
    applications,
    rawApplications, // 원본 API 데이터
    isLoading,
    isError,
    currentPage,
    totalPages,
    filterStatus,
    handlePageChange,
    handleFilterChange,
  };
};
