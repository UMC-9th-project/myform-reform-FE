import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatListTab from '../../components/domain/chat/ChatListTab';
import ChatRoom from '../../components/domain/chat/ChatRoom';
import EmptyChatRoom from '../../components/domain/chat/EmptyChatRoom';
import NoChatYet from '../../components/domain/chat/NoChatYet';
import type { SelectedChat } from '../../types/api/chat/chatMessages';

type Role = 'USER' | 'REFORMER';

interface ChatPageProps {
  role: Role;
}

const ChatPage = ({ role }: ChatPageProps) => {
  const navigate = useNavigate();

  const [hasChats, setHasChats] = useState(true);
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);

  const basePath = role === 'USER' ? 'normal' : 'reformer';

  return (
    <div className="flex flex-row-reverse w-full h-screen bg-[var(--color-gray-20)] overflow-hidden">
      
      {/* 오른쪽 채팅 목록 */}
      <div className="w-[24rem] ml-3 m-10 border-[var(--color-line-gray-40)] bg-white">
        <ChatListTab
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
        {!hasChats ? (
          <NoChatYet />
        ) : !selectedChat ? (
          <EmptyChatRoom />
        ) : (
          <ChatRoom
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
