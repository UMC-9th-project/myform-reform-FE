import React, { useState } from 'react';


interface ChatListTabProps {
  selectedChat: number | null;
  setSelectedChat: (id: number) => void;
}

// Mock Data 정의
const mockChats = [
  { id: 1, type: '문의', title: '축구 유니폼 문의', lastMsg: '사이즈 재고 있나요?', date: '어제', unread: 2, img: 'https://via.placeholder.com/50' },
  { id: 2, type: '주문제작', title: '메시 10번 마킹', lastMsg: '시안 확인 부탁드립니다.', date: '2024-10-23', unread: 99, img: 'https://via.placeholder.com/50' },
  { id: 3, type: '주문제작', title: '단체복 주문', lastMsg: '결제 완료했습니다.', date: '2024-10-23', unread: 105, img: 'https://via.placeholder.com/50' },
  { id: 4, type: '문의', title: '배송지 변경', lastMsg: '주소 변경 가능한가요?', date: '2024-10-23', unread: 0, img: 'https://via.placeholder.com/50' },
  { id: 5, type: '안읽음', title: '이벤트 알림', lastMsg: '새로운 쿠폰이 도착했습니다.', date: '2024-10-23', unread: 1, img: 'https://via.placeholder.com/50' },
];

const ChatListTab: React.FC<ChatListTabProps> = ({ selectedChat, setSelectedChat}) => {
  const [filter, setFilter] = useState('전체');
  const [chats, setChats] = useState(mockChats);

  // 필터링 로직
  const filteredChats = chats.filter(chat => {
    if (filter === '전체') return true;
    if (filter === '안 읽은 채팅방') return chat.unread > 0;
    return chat.type === filter;
  });

  const filters = ['전체', '문의', '주문제작', '안 읽은 채팅방'];

  return (
    <div className="w-full h-full bg-whited border border-[var(--color-line-gray-40)]">
      {/* Header */}
      <div className="p-6">
        <h1 className="body-b0-sb text-black">채팅 목록</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar body-b3-rg">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
              filter === f
                ? 'border-teal-500 text-[black] bg-teal-50'
                : 'border-[var(--color-line-gray-40)] text-[black]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="">
        {filteredChats.map((chat) => (
          <div key={chat.id} className={`flex items-center p-4 cursor-pointer transition-colors
            ${selectedChat === chat.id ? 'bg-[var(--color-gray-20)]': '' }`}
            onClick={() => {
              console.log('clicked chat id:', chat.id);
              setSelectedChat(chat.id);
              
              setChats(prev =>
                prev.map(c => c.id === chat.id ? {...c, unread: 0}: c)
              );
            }}
            >
            {/* Thumbnail */}
            <img src={chat.img} alt="thumb" className="w-14 h-14 rounded-[5px] object-cover bg-gray-200" />
            
            {/* Content */}
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="body-b3-sb text-black">{chat.title}</h3>
                  <p className="body-b3-rg text-[var(--color-gray-60)] mt-1">({chat.lastMsg})</p>
                </div>
                
                {/* Meta Info */}
                <div className="flex flex-col items-end">
                  <span className="body-b5-rg text-[var(--color-gray-50)] mb-2">{chat.date}</span>
                  {chat.unread > 0 && (
                    <span className="bg-[var(--color-red-1)] text-white body-b5-sb px-2 py-0.5 rounded-full">
                      {chat.unread > 99 ? '99+' : chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatListTab;