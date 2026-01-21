import React from 'react';
import Image from '../../../assets/chat/Image.svg';

const EmptyChatRoom = () => {
  return (
    <div className="flex flex-col w-full h-full border border-[var(--color-line-gray-40)] bg-white">

      {/* 중앙 안내 문구 */}
      <div className="flex-1 flex items-center justify-center text-[var(--color-gray-60)] text-lg">
        채팅 목록에서 대화 내역을 선택해주세요
      </div>

      {/* 입력창 (비활성화) */}
      <div className="p-4 border-t border-[var(--color-line-gray-40)]">
        <textarea
          disabled
          placeholder="메시지를 입력해주세요."
          className="w-full h-10 resize-none outline-none cursor-not-allowed body-b1-rg"
        />

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-3 opacity-40">
            <button disabled>
              <img src={Image} alt="갤러리" />
            </button>
            <button
              disabled
              className="px-3 py-1.5 border rounded-full body-b5-rg"
            >
              결제창 보내기
            </button>
          </div>

          <button
            disabled
            className="px-6 py-2 rounded-lg body-b1-sb bg-[var(--color-gray-30)] text-[var(--color-gray-40)]"
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyChatRoom;
