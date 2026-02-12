import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import ChatListTab from '../../components/domain/chat/ChatListTab';
import ChatRoomCom from '../../components/domain/chat/ChatRoom';
import EmptyChatRoom from '../../components/domain/chat/EmptyChatRoom';
import NoChatYet from '../../components/domain/chat/NoChatYet';
import type { RoomType, SelectedChat } from '../../types/api/chat/chatMessages';
import { getChatRooms } from '@/api/chat/chatApi';
import type { ChatRoom } from '@/api/chat/chatApi';

type Role = 'USER' | 'REFORMER';

interface ChatPageProps {
  role: Role;
}

import useAuthStore from '@/stores/useAuthStore';

const ChatPage = ({ role }: ChatPageProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { chatRoomId } = useParams();

  const [hasChats, setHasChats] = useState(true);
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [chatList, setChatList] = useState<ChatRoom[]>([]);

  const basePath = role === 'USER' ? 'normal' : 'reformer';
  const initialFilterType = tabParam === 'order' ? 'ORDER' : undefined;

  const { accessToken } = useAuthStore();
  const isLoggedIn = !!accessToken;

  // 1️⃣ 채팅방 리스트 불러오기
  useEffect(() => {
    if (!isLoggedIn) return; // 로그인 안 됐으면 API 호출 안 함

    const fetchRooms = async () => {
      try {
        const res = await getChatRooms();
        setChatList(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRooms();
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    if (chatRoomId && chatList.length > 0 && !selectedChat) {
      const chat = chatList.find(c => c.chatRoomId === chatRoomId);
      if (chat) {
        const roomTypeMap: Record<string, RoomType> = {
          FEED: 'FEED',
          PROPOSAL: 'PROPOSAL',
          REQUEST: 'REQUEST',
        };
        const selected: SelectedChat = {
          chatRoomId: chat.chatRoomId,
          roomType: roomTypeMap[chat.roomType] || 'FEED',
        };
        setTimeout(() => setSelectedChat(selected), 0);
      }
    }
  }, [chatRoomId, chatList, selectedChat, isLoggedIn]);


  return (
    <div className="flex flex-row-reverse w-full h-screen bg-[var(--color-gray-20)] overflow-hidden">
      {/* 오른쪽 채팅 목록 */}
      <div className="w-[24rem] ml-3 m-10 border-[var(--color-line-gray-40)] bg-white">
          <ChatListTab
            initialFilterType={initialFilterType}
            selectedChat={selectedChat}
            setSelectedChat={(chat) => {
              setSelectedChat(chat);
              navigate(`/chat/${basePath}/${chat.chatRoomId}`);
            }}
            onChatsLoaded={(chatCount) => setHasChats(chatCount > 0)}
          />
      </div>

      {/* 왼쪽 채팅방 */}
      <div className="flex-1 m-10 flex flex-col bg-white overflow-hidden">
        {!isLoggedIn ? (
          <NoChatYet /> // 로그인 안 됐을 때
        ) : !hasChats ? (
          <NoChatYet />
        ) : !selectedChat ? (
          <EmptyChatRoom />
        ) : (
          <ChatRoomCom
            chatId={selectedChat.chatRoomId}
            roomType={selectedChat.roomType}
            myRole={role}
          />
        )}
      </div>
    </div>
  );
};


export default ChatPage;
