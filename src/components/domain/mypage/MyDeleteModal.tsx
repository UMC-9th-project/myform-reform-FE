import React from 'react';

interface DeleteModalProps {
  isOpen: boolean; // 모달 열림 상태
  onClose: () => void; // '아니오' 또는 닫기 클릭 시
  onConfirm: () => void; // '네, 삭제합니다' 클릭 시
}

const DeleteModal = ({ isOpen, onClose, onConfirm }: DeleteModalProps) => {
  // 모달이 닫혀있으면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-5">
      {/* 팝업 본체 */}
      <div className="w-full max-w-[27rem] bg-white rounded-[1.25rem] p-8 shadow-xl text-center">
        {/* 문구 영역 */}
        <div className="mb-10 mt-4">
          <h2 className="body-b1-sb text-black leading-tight">
            삭제하면 되돌릴 수 없습니다.
          </h2>
          <p className="body-b1-sb text-black mt-1">정말 삭제하시겠습니까?</p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex gap-3 justify-center">
          {/* 아니오 버튼 */}
          <button
            onClick={onClose}
            className="h-[3.5rem] px-6 bg-[var(--color-gray-30)] rounded-[0.625rem] flex items-center justify-center gap-5 group hover:bg-gray-300 transition-colors"
          >
            <span className="body-b1-sb text-[var(--color-gray-50)]">
              아니오
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* 네, 삭제합니다 버튼 */}
          <button
            onClick={onConfirm}
            className="h-[3.5rem] px-6 bg-[var(--color-mint-0)] rounded-[0.625rem] flex items-center justify-center gap-5 hover:bg-[#4ab3aa] transition-colors"
          >
            <span className="body-b1-sb text-white">네, 삭제합니다</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
