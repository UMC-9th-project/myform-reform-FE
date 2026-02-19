import { type ReformerApplicationData } from '../../../types/api/admin/reformerApproval';

// 전화번호 포맷팅 함수
const formatPhoneNumber = (phone: string): string => {
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

interface ReformerApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ReformerApplicationData | null;
  onApprove?: (ownerId: string) => void;
  onReject?: (ownerId: string) => void;
}

const ReformerApprovalModal = ({
  isOpen,
  onClose,
  application,
  onApprove,
  onReject,
}: ReformerApprovalModalProps) => {
  if (!isOpen || !application) return null;

  const handleApprove = () => {
    onApprove?.(application.owner_id);
  };

  const handleReject = () => {
    onReject?.(application.owner_id);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[20px] w-[90%] max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-[var(--color-gray-30)] px-8 py-6 flex items-center justify-between rounded-t-[20px]">
          <h2 className="heading-h4-bd text-[var(--color-black)]">신청 상세 정보</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-[var(--color-gray-20)] rounded-full transition-colors"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[var(--color-gray-60)]"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="px-12 pt-10 pb-0 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 기본 정보 */}
            <div>
              <h3 className="body-b0-sb text-[var(--color-black)] mb-3">기본 정보</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="body-b0-rg text-[var(--color-gray-60)]">이름 : </span>
                  <span className="body-b0-rg text-[var(--color-gray-60)]">{application.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="body-b0-rg text-[var(--color-gray-60)]">닉네임 : </span>
                  <span className="body-b0-rg text-[var(--color-gray-60)]">
                    {application.nickname}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="body-b0-rg text-[var(--color-gray-60)]">전화번호 : </span>
                  <span className="body-b0-rg text-[var(--color-gray-60)]">
                    {formatPhoneNumber(application.phone)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="body-b0-rg text-[var(--color-gray-60)]">가입 이메일 정보 : </span>
                  <span className="body-b0-rg text-[var(--color-gray-60)]">{application.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="body-b0-rg text-[var(--color-gray-60)]">사업자등록번호 : </span>
                  <span className="body-b0-rg text-[var(--color-gray-60)]">
                    {application.business_number}
                  </span>
                </div>
              </div>
            </div>

            {/* 자기소개 */}
            <div>
              <h3 className="body-b0-sb text-[var(--color-black)] mb-3">자기소개</h3>
              <div className="border border-[var(--color-gray-30)] rounded-lg p-4 h-[200px] overflow-y-auto">
                <p className="body-b1-rg text-[var(--color-black)] whitespace-pre-wrap">
                  {application.introduction || '자기소개가 없습니다.'}
                </p>
              </div>
            </div>
          </div>

          {/* 작업물 사진 */}
          <div className="mt-6 pb-6">
            <h3 className="body-b0-sb text-[var(--color-black)] mb-4">작업물 사진</h3>
            {application.photos && application.photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {application.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden bg-[var(--color-gray-20)]"
                  >
                    <img
                      src={photo}
                      alt={`작업물 ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/300x300?text=No+Image';
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="body-b1-rg text-[var(--color-gray-60)]">작업물 사진이 없습니다.</p>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="sticky bottom-0 bg-white border-t border-[var(--color-gray-30)] px-8 py-4 flex justify-end gap-4 rounded-b-[20px]">
          <button
            onClick={handleApprove}
            disabled={application.status === 'APPROVED'}
            className={`
              inline-flex items-center justify-center
              body-b0-bd px-6 py-2 rounded-[0.625rem]
              ${application.status === 'APPROVED'
                ? 'text-[var(--color-gray-50)] bg-[var(--color-gray-30)] cursor-not-allowed opacity-60'
                : 'text-white bg-[var(--color-mint-0)] hover:bg-[var(--color-mint-1)] cursor-pointer transition-colors duration-200'
              }
            `}
          >
            승인
          </button>
          <button
            onClick={handleReject}
            disabled={application.status === 'REJECTED'}
            className={`
              inline-flex items-center justify-center
              body-b0-bd px-6 py-2 rounded-[0.625rem]
              ${application.status === 'REJECTED'
                ? 'text-[var(--color-gray-50)] bg-[var(--color-gray-30)] cursor-not-allowed opacity-60'
                : 'text-white bg-[var(--color-red-1)] hover:bg-[var(--color-red-2)] cursor-pointer transition-colors duration-200'
              }
            `}
          >
            반려
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReformerApprovalModal;
