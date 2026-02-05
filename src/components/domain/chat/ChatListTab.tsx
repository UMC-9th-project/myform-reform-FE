import React, { useEffect, useState } from 'react';
import { getChatRooms, type ChatRoom, type ChatRoomFilter } from '../../../api/chat/chatApi';
import type { SelectedChat } from '../../../types/domain/chat/chatMessages';

interface ChatListTabProps {
  selectedChat: SelectedChat | null;
  setSelectedChat: (chat: SelectedChat) => void;
  onChatsLoaded?: (chatCount: number) => void;
}

const filters: { label: string; type?: ChatRoomFilter }[] = [
  { label: '전체' },
  { label: '문의', type: 'INQUIRY' },
  { label: '주문제작', type: 'ORDER' },
  { label: '안 읽은 채팅방', type: 'UNREAD' },
];

const ChatListTab: React.FC<ChatListTabProps> = ({ selectedChat, setSelectedChat, onChatsLoaded }) => {
  const [filter, setFilter] = useState(filters[0]);
  const [chats, setChats] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchChats = async (type?: ChatRoomFilter, cursor?: string) => {
    setLoading(true);
    try {
      const data = await getChatRooms({ type, cursor });

      setChats(prev => (cursor ? [...prev, ...data.data] : data.data));
      setNextCursor(data.meta.nextCursor);
      setHasMore(data.meta.hasMore);
      setError(null);

      if (onChatsLoaded) onChatsLoaded(data.data.length);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('채팅 조회 실패');
      if (onChatsLoaded) onChatsLoaded(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 필터 변경 시 초기화
    setChats([]);
    setNextCursor(null);
    setHasMore(true);
    fetchChats(filter.type);
  }, [filter]);

  if (loading && chats.length === 0) return <div>로딩 중...</div>;
  if (error && chats.length === 0) return <div className="text-red-500">{error}</div>;

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
            <div
              key={chat.chatRoomId}
              className={`flex items-center p-4 cursor-pointer transition-colors ${
                selectedChat?.chatRoomId === chat.chatRoomId
                  ? 'bg-[var(--color-gray-20)]'
                  : ''
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
              className="w-14 h-14 rounded-[5px] object-cover bg-gray-200"
            />
            <div className="ml-4 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="body-b3-sb text-black">{chat.title}</h3>
                  <p className="body-b3-rg text-[var(--color-gray-60)] mt-1">{chat.lastMessage}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="body-b5-rg text-[var(--color-gray-50)] mb-2">
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
        ))}

        {/* 더보기 버튼 */}
        {hasMore && (
          <div className="flex justify-center py-4">
            <button
              className="px-6 py-2 bg-[var(--color-gray-30)] rounded-full hover:bg-[var(--color-gray-40)]"
              onClick={() => fetchChats(filter.type, nextCursor ?? undefined)}
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
