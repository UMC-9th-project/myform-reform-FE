import { useState, useRef, useEffect } from 'react';
import xIcon from '../../../assets/icons/x.svg';

export interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  imageUrl?: string;
  type: 'market' | 'custom' | 'chat' | 'all';
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
}

const NotificationPanel = ({ isOpen, onClose, notifications = [] }: NotificationPanelProps) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'market' | 'custom' | 'chat'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  const filterOptions = [
    { value: 'all' as const, label: '전체' },
    { value: 'market' as const, label: '마켓' },
    { value: 'custom' as const, label: '주문제작' },
    { value: 'chat' as const, label: '채팅' },
  ];

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // 필터링된 알림
  const filteredNotifications = notifications.filter((notification) => {
    if (activeFilter === 'all') return true;
    return notification.type === activeFilter;
  });

  // 예시 데이터 (실제로는 props로 받아야 함)
  const defaultNotifications: Notification[] = [
    {
      id: '1',
      title: '마켓의 상품이 판매되었습니다!',
      content: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
      time: '오후 09:52',
      type: 'market',
      imageUrl: '/Home/images/p1.jpg',
    },
    {
      id: '2',
      title: '[제안 주문]이 접수되었습니다!',
      content: '짐색 리폼 요청합니다.',
      time: '2025-04-06',
      type: 'custom',
      imageUrl: '/Home/images/p1.jpg',
    },
    {
      id: '3',
      title: '[리폼 진행 상태]를 변경해주세요!',
      content: '결제가 완료되었지만 상태 변경이 되지 않은 주문이 있어요. (주문번호 00000000000)',
      time: '2025-04-06',
      type: 'custom',
      imageUrl: '/Home/images/p1.jpg',
    },
    {
      id: '4',
      title: '[제안서]가 도착하였습니다!',
      content: '짐색 리폼 요청합니다.',
      time: '2025-04-06',
      type: 'custom',
      imageUrl: '/Home/images/p1.jpg',
    },
    {
      id: '5',
      title: '결제 요청이 도착했어요!',
      content: '주문제작 건에 대해 채팅에서 결제를 진행해주세요.',
      time: '2025-04-06',
      type: 'chat',
  
    },
    {
      id: '6',
      title: '결제가 성공적으로 완료되었습니다!',
      content: '짐색 리폼 요청합니다.',
      time: '2025-04-06',
      type: 'custom',
      imageUrl: '/Home/images/p1.jpg',
    },
    {
      id: '7',
      title: '리폼러가 상품 발송을 완료했어요.',
      content: '짐색 리폼 요청합니다.',
      time: '2025-04-06',
      type: 'custom',
      imageUrl: '/Home/images/p1.jpg',
    },
    {
      id: '8',
      title: '침착한 대머리독수리님과의 새로운 채팅!',
      content: '안녕하세요, 기본 제작 일정은 결제일 익일부터 4-5일이며 요청하시는 날짜에 수령 원하실 경우 빠른 제작 추가 금액이 필요합니다.',
      time: '2025-04-06',
      type: 'chat',
    },
  ];

  const displayNotifications = notifications.length > 0 ? filteredNotifications : defaultNotifications.filter((n) => {
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 left-[-230px] mt-2 z-50" ref={panelRef}>
      <div className="bg-white h-[529px] overflow-hidden relative rounded-[30px] shadow-[0px_3px_10.7px_0px_rgba(0,0,0,0.22)] w-[405px]">
        {/* 헤더 */}
        <div className="absolute bg-white border-[#c5c8ce] border-b border-solid flex gap-[290px] h-[73px] items-center left-0 pb-[10px] pt-[15px] px-[20px] top-0 w-[405px]">
          <div className="flex flex-col font-['Pretendard',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black whitespace-nowrap">
            <p className="leading-[1.5]">알림</p>
          </div>
          <button
            onClick={onClose}
            className="block cursor-pointer overflow-hidden relative shrink-0 size-[40px]"
          >
            <img src={xIcon} alt="닫기" className="w-full h-full" />
          </button>
        </div>

        {/* 필터 탭 */}
        <div className="absolute bg-white flex gap-[9px] items-center left-0 pb-[15px] pt-[20px] px-[20px] top-[73px] w-[405px]">
          {filterOptions.map((option) => {
            const isActive = activeFilter === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setActiveFilter(option.value)}
                className={`flex items-center justify-center px-[15px] py-[5px] relative rounded-[100px] shrink-0 ${
                  isActive
                    ? 'bg-[#c5efea] border border-[#07beb8] border-solid'
                    : 'bg-white border border-[#c5c8ce] border-solid'
                }`}
              >
                <p className="font-['Pretendard',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[15px] text-black">
                  {option.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* 알림 목록 */}
        <div className="absolute flex flex-col gap-[3px] h-[388px] items-start left-0 top-[141px] w-[383px] overflow-y-auto">
          {displayNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-full w-full">
              <p className="body-b2-rg text-[var(--color-gray-50)]">알림이 없습니다.</p>
            </div>
          ) : (
            displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white flex items-center pl-[25px] pr-[15px] py-[10px] relative shrink-0 w-full"
              >
                <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
                  <div className="flex items-center relative shrink-0 w-full">
                    <p className="font-['Pretendard',sans-serif] font-medium h-[23px] leading-[1.5] not-italic overflow-hidden relative shrink-0 text-[16px] text-black text-ellipsis w-[269px] whitespace-nowrap">
                      {notification.title}
                    </p>
                    <div className="flex flex-col items-end justify-center relative shrink-0 w-[79px]">
                      <div className="flex flex-col gap-[3px] items-end relative shrink-0 w-[79px]">
                        <p className="font-['Pretendard',sans-serif] font-normal leading-[1.5] not-italic relative shrink-0 text-[#646f7c] text-[13px] text-right">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-[34px] items-end relative shrink-0 w-full">
                    <p className="font-['Pretendard',sans-serif] font-normal h-[50px] leading-[1.5] not-italic overflow-hidden relative shrink-0 text-[#374553] text-[16px] text-ellipsis w-[269px] whitespace-pre-wrap">
                      {notification.content}
                    </p>
                    {notification.imageUrl && (
                      <div className="relative rounded-[3px] shrink-0 size-[45px]">
                        <img
                          alt=""
                          className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[3px] size-full"
                          src={notification.imageUrl}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
