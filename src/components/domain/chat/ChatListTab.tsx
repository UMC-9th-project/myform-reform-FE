import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getChatRooms,  type ChatRoomFilter } from '@/api/chat/chatApi';
import type { SelectedChat } from '@/types/api/chat/chatMessages';
import { useLocation } from 'react-router-dom';

interface ChatListTabProps {
  selectedChat: SelectedChat | null;
  setSelectedChat: (chat: SelectedChat) => void;
  onChatsLoaded?: (chatCount: number) => void;
  /** URL 등에서 지정한 초기 탭 (예: tab=order → 주문제작) */
  initialFilterType?: ChatRoomFilter;
}

const filters: { label: string; type?: ChatRoomFilter }[] = [
  { label: '전체' },
  { label: '문의', type: 'INQUIRY' },
  { label: '주문제작', type: 'ORDER' },
  { label: '안 읽은 채팅방', type: 'UNREAD' },
];

const ChatListTab: React.FC<ChatListTabProps> = ({ selectedChat, setSelectedChat, onChatsLoaded, initialFilterType }) => {
  const initialFilter = initialFilterType
    ? filters.find((f) => f.type === initialFilterType) ?? filters[0]
    : filters[0];
  const [filter, setFilter] = useState(initialFilter);
  const queryClient = useQueryClient();
  const location = useLocation();
  const chatRoomIdFromUrl = location.pathname.split('/').pop() || null;

  // ✅ React Query로 변경
  const { data, isLoading, error } = useQuery({
    queryKey: ['chatRooms', filter.type],
    queryFn: () => getChatRooms({ type: filter.type }),
  });

  const chats = data?.data || [];
  const hasMore = data?.meta.hasMore || false;
  const nextCursor = data?.meta.nextCursor || null;

  // 더보기 함수
  const handleLoadMore = async () => {
    if (!nextCursor) return;
    
    const moreData = await getChatRooms({ type: filter.type, cursor: nextCursor });
    
    queryClient.setQueryData(['chatRooms', filter.type], (oldData: any) => ({
      ...oldData,
      data: [...(oldData?.data || []), ...moreData.data],
      meta: moreData.meta,
    }));
  };

  React.useEffect(() => {
    if (data && onChatsLoaded) {
      onChatsLoaded(chats.length);
    }
  }, [data, onChatsLoaded]);

  React.useEffect(() => {
    if (chatRoomIdFromUrl && chats.length > 0) {
      const matched = chats.find(c => c.chatRoomId === chatRoomIdFromUrl);
      if (matched) {
        setSelectedChat({
          chatRoomId: matched.chatRoomId,
          roomType: matched.roomType as 'FEED' | 'PROPOSAL' | 'REQUEST',
        });
      }
    }
  }, [chatRoomIdFromUrl, chats]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">채팅 조회 실패</div>;

  return (
    <div className="flex flex-col h-full border border-[var(--color-line-gray-40)] bg-white">
      {/* Header */}
      <div className="pb-4 p-6 flex-none">
        <h1 className="body-b0-sb text-black">채팅 목록</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar body-b3-rg flex-none">
        {filters.map(f => (
          <button
            key={f.label}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full border whitespace-nowrap transition-colors ${
              filter.label === f.label
                ? 'border-teal-500 text-black bg-teal-50'
                : 'border-[var(--color-line-gray-40)] text-black'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        {chats.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
            채팅방이 없습니다.
          </div>
        ) : (
          <>
            {chats.map((chat) => (
              chat?.chatRoomId ? (
                <div
                  key={chat.chatRoomId}
                  className={`flex items-center p-4 cursor-pointer transition-colors ${
                    selectedChat?.chatRoomId === chat.chatRoomId ? 'bg-[var(--color-gray-20)]' : ''
                  }`}
                  onClick={() =>
                    setSelectedChat({
                      chatRoomId: chat.chatRoomId,
                      roomType: chat.roomType as 'FEED' | 'PROPOSAL' | 'REQUEST',
                    })
                  }
                >
                  <img
                    src={chat.image}
                    alt="thumb"
                    className="w-14 h-14 rounded-[5px] object-cover bg-gray-200 flex-shrink-0"
                  />
                  <div className="ml-4 flex-1 flex flex-col overflow-hidden">
                    <div className="flex justify-between items-start">
                      {/* 제목 + 메시지 */}
                      <div className="flex-1 min-w-0">
                        <h3 className="body-b3-sb text-black truncate">{chat.title}</h3>
                        <p className="body-b3-rg text-[var(--color-gray-60)] truncate">
                          {chat.lastMessage ??
                            (chat.messageType === 'payment'
                              ? '결제창'
                              : chat.messageType === 'text'
                              ? '메시지'
                              : chat.messageType === 'request'
                              ? '요청서'
                              : chat.messageType === 'proposal'
                              ? '견적서'
                              : chat.messageType === 'image'
                              ? '사진'
                              : chat.messageType === 'result'
                              ? '결제 완료'
                              : '새로운 메시지')}
                        </p>
                      </div>

                      {/* 날짜 + 읽지 않은 메시지 */}
                      <div className="flex flex-col items-end ml-4 flex-shrink-0">
                        <span className="body-b5-rg text-[var(--color-gray-50)] mb-2 whitespace-nowrap">
                          {new Date(chat.lastMessageAt).toLocaleDateString()}
                        </span>
                        {chat.unreadCount > 0 && (
                          <span className="bg-[var(--color-red-1)] text-white body-b5-sb px-2 py-0.5 rounded-full">
                            {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              ) : null
            ))}

            {/* 더보기 버튼 */}
            {hasMore && (
              <div className="flex justify-center py-4">
                <button
                  className="px-6 py-2 bg-[var(--color-gray-30)] rounded-full hover:bg-[var(--color-gray-40)]"
                  onClick={handleLoadMore}
                >
                  더보기
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChatListTab;