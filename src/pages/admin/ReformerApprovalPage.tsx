import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Pagination from '../../components/common/pagination/Pagination';
import Select from '../../components/common/dropdown/SortDropdown';
import ReformerApprovalModal from '../../components/domain/admin/ReformerApprovalModal';
import {
  useReformerApprovalList,
  type ApprovalStatus,
} from '../../hooks/domain/admin/useReformerApprovalList';
import { updateReformerStatus } from '../../api/admin/reformerApproval';
import type { ReformerApplicationData } from '../../types/api/admin/reformerApproval';

// 전화번호 포맷팅 함수
const formatPhoneNumber = (phone: string | undefined): string => {
  if (!phone) return '';
  
  // 숫자만 추출
  const numbers = phone.replace(/\D/g, '');
  
  // 11자리 (010-1234-5678)
  if (numbers.length === 11) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  }
  // 10자리 (02-1234-5678)
  if (numbers.length === 10) {
    // 02로 시작하면 서울 지역번호
    if (numbers.startsWith('02')) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    // 그 외 지역번호 (031-123-4567)
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
  }
  // 이미 포맷팅되어 있거나 다른 형식이면 그대로 반환
  return phone;
};

const STATUS_COLORS: Record<ApprovalStatus, string> = {
  PENDING: 'text-[#DCB509] ',
  APPROVED: 'text-[var(--color-mint-1)]',
  REJECTED: 'text-[#FF4D4D]',
};

const STATUS_LABELS: Record<ApprovalStatus, string> = {
  PENDING: '대기중',
  APPROVED: '승인',
  REJECTED: '반려',
};

const ReformerApprovalPage = () => {
  const [selectedApplication, setSelectedApplication] =
    useState<ReformerApplicationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    applications,
    rawApplications,
    isLoading,
    isError,
    currentPage,
    totalPages,
    handlePageChange,
    filterStatus,
    handleFilterChange,
  } = useReformerApprovalList();

  const updateStatusMutation = useMutation({
    mutationFn: updateReformerStatus,
    onSuccess: () => {
      // 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ['reformer-approval-list'] });
      handleCloseModal();
    },
    onError: (error: unknown) => {
      console.error('상태 업데이트 실패:', error);
      
      // Axios 에러인 경우 상태 코드 확인
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 403) {
        alert('어드민 계정이 아닌거라서 그 권한이 없습니다.');
      } else {
        alert('상태 업데이트에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    },
  });

  const handleViewClick = (applicationId: string) => {
    const application = rawApplications.find((app) => app.owner_id === applicationId);
    if (application) {
      setSelectedApplication(application);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  const handleApprove = (ownerId: string) => {
    updateStatusMutation.mutate({
      reformerId: ownerId,
      status: 'APPROVED',
    });
  };

  const handleReject = (ownerId: string) => {
    updateStatusMutation.mutate({
      reformerId: ownerId,
      status: 'REJECTED',
    });
  };

  return (
    <div className="bg-white min-h-screen pb-[7.4375rem]">
      <div className="px-4 md:px-[3.125rem] pt-8 md:pt-[3.125rem]">
        {/* 페이지 제목 */}
        <h1 className="heading-h4-bd text-[var(--color-black)] mb-8">
          리폼러 승인 관리
        </h1>

        {/* 필터 및 헤더 */}
        <div className="flex items-center justify-end mb-6">
          {/* 필터 드롭다운 */}
          <Select
            options={[
              { value: 'ALL', label: '전체' },
              { value: 'PENDING', label: '대기중' },
              { value: 'APPROVED', label: '승인' },
              { value: 'REJECTED', label: '반려' },
            ]}
            value={filterStatus}
            onChange={handleFilterChange}
          />
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto border border-[var(--color-line-gray-40)] rounded-[20px]">
          <table className="w-full border-b border-[var(--color-line-gray-40)]">
            <thead>
              <tr className="border-b border-[var(--color-gray-30)] bg-[var(--color-mint-6)]">
                <th className="body-b0-sb text-[var(--color-gray-60)] py-4 pl-6 pr-4 text-left">
                  신청일
                </th>
                <th className="body-b0-sb text-[var(--color-gray-60)] py-4 px-4 text-left">
                  이름
                </th>
                <th className="body-b0-sb text-[var(--color-gray-60)] py-4 px-4 text-left">
                  닉네임
                </th>
                <th className="body-b0-sb text-[var(--color-gray-60)] py-4 px-4 text-left">
                  전화번호
                </th>
                <th className="body-b0-sb text-[var(--color-gray-60)] py-4 px-4 text-left">
                  가입 이메일
                </th>
                <th className="body-b0-sb text-[var(--color-gray-60)] py-4 px-4 text-center">
                  상태
                </th>
                <th className="body-b0-sb text-[var(--color-gray-60)] py-4 px-4 text-center">
                  상세보기
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center body-b1-rg text-[var(--color-gray-60)]">
                    불러오는 중...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center body-b1-rg text-[var(--color-red-1)]">
                    데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center body-b1-rg text-[var(--color-gray-60)]">
                    신청 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                applications.map((application) => {
                  const statusColor = STATUS_COLORS[application.status as ApprovalStatus] || STATUS_COLORS.PENDING;
                  const statusLabel = STATUS_LABELS[application.status as ApprovalStatus] || '알 수 없음';
                  
                  return (
                    <tr
                      key={application.id}
                      className="border-b border-[var(--color-gray-30)] hover:bg-[var(--color-gray-20)] transition-colors"
                    >
                      <td className="body-b1-rg text-[var(--color-gray-60)] py-4 pl-6 pr-4">
                        {application.applicationDate || '-'}
                      </td>
                      <td className="body-b1-rg text-[var(--color-black)] py-4 px-4">
                        {application.name || '-'}
                      </td>
                      <td className="body-b1-rg text-[var(--color-black)] py-4 px-4">
                        {application.nickname || '-'}
                      </td>
                      <td className="body-b1-rg text-[var(--color-gray-60)] py-4 px-4">
                        {formatPhoneNumber(application.phoneNumber)}
                      </td>
                      <td className="body-b1-rg text-[var(--color-gray-60)] py-4 px-4">
                        {application.email || '-'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block px-3 py-1 rounded-full body-b1-md ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleViewClick(application.id)}
                          className="body-b0-rg text-[var(--color-gray-50)] hover:text-[var(--color-gray-60)] transition-colors underline"
                        >
                          보기
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      {/* 모달 */}
      <ReformerApprovalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        application={selectedApplication}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};

export default ReformerApprovalPage;
