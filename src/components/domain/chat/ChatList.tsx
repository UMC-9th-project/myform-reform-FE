import { useState } from 'react';

const ChatListItem = () => {
  const [selected, setSelected] = useState(false);

  // UI 확인용 숫자
  const unreadCount = 120;
  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  return (
    <div
      className={`flex items-center justify-between p-4 pb-6 cursor-pointer
        ${selected ? 'bg-[#F7F8F9]' : 'hover:bg-gray-50'} bg-white`}
      onClick={() => setSelected(!selected)}
    >
      {/* 프로필 + 텍스트 */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="https://picsum.photos/seed/r7a/200/200"
          alt="프로필 이미지"
          className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="font-bold text-gray-900 text-[15px] truncate">홍길동</div>
          <div className="text-gray-500 text-sm truncate">
            안녕하세요! 오늘 회의 몇 시인가요? 확인 부탁드립니다.
          </div>
        </div>
      </div>

      {/* 우측 시간 + 안 읽은 메시지 */}
      <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-3">
        <div className="text-gray-400 text-[11px]">오후 12:34</div>
        {unreadCount > 0 && (
          <div
            className={`bg-[#FF4D4D] text-white text-[10px] font-bold 
              flex items-center justify-center
              h-5 shadow-sm
              ${unreadCount > 99
                ? 'px-1.5 rounded-full min-w-[28px]' // 99+일 때 타원형
                : 'w-5 rounded-full'                 // 숫자 적을 때 원형
              }`}
          >
            {displayCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;
