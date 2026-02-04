import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatListTab from '../../components/domain/chat/ChatListTab';
import ChatRoom from '../../components/domain/chat/ChatRoom';
import EmptyChatRoom from '../../components/domain/chat/EmptyChatRoom';
import NoChatYet from '../../components/domain/chat/NoChatYet';

type Role = 'USER' | 'REFORMER';

interface ChatPageProps {
  role: Role;
}

const ChatPage = ({ role }: ChatPageProps) => {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();

  const [hasChats, setHasChats] = useState(true); // 채팅방 존재 여부

  const selectedChatId = chatId ?? null;
  const basePath = role === 'USER' ? 'normal' : 'reformer';

  return (
    <div className="flex flex-row-reverse w-full h-screen bg-[var(--color-gray-20)] overflow-hidden">
      
      {/* 오른쪽 채팅 목록 */}
      <div className="w-[24rem] ml-3 m-10 border-[var(--color-line-gray-40)] bg-white">
        <ChatListTab
          selectedChat={selectedChatId}
          setSelectedChat={(id) => navigate(`/chat/${basePath}/${id}`)}
          onChatsLoaded={(chatCount) => setHasChats(chatCount > 0)}
        />
      </div>

      {/* 왼쪽 채팅방 컨테이너 */}
      <div className="flex-1 mr-0 m-10 flex flex-col min-w-0 bg-white overflow-hidden">
        {!hasChats ? (
          <NoChatYet />
        ) : selectedChatId === null ? (
          <EmptyChatRoom />
        ) : (
          <ChatRoom chatId={selectedChatId} myRole={role} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
