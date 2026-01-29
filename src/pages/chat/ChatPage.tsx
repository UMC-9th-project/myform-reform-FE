import { useParams, useNavigate } from 'react-router-dom';
import ChatListTab from '../../components/domain/chat/ChatListTab';
import ChatRoom from '../../components/domain/chat/ChatRoom';
import EmptyChatRoom from '../../components/domain/chat/EmptyChatRoom';

type Role = 'USER' | 'REFORMER';

interface ChatPageProps {
  role: Role;
}

const ChatPage = ({ role }: ChatPageProps) => {
  const { chatId } = useParams<{ chatId?: string }>();
  const navigate = useNavigate();

  // 선택된 채팅 ID (없으면 null)
  const selectedChatId = chatId ? Number(chatId) : null;

  // URL 경로 기본값 설정
  const basePath = role === 'USER' ? 'normal' : 'reformer';

  return (
    <div className="flex flex-row-reverse w-full h-screen bg-[var(--color-gray-20)] overflow-hidden">
      
      {/* 오른쪽 채팅 목록 */}
      <div className="w-[24rem] ml-3 m-10 border-[var(--color-line-gray-40)] bg-white">
        <ChatListTab
          selectedChat={selectedChatId}
          setSelectedChat={(id) => navigate(`/chat/${basePath}/${id}`)}
        />
      </div>

      {/* 왼쪽 채팅방 컨테이너 */}
      <div className="flex-1 mr-0 m-10 flex flex-col min-w-0 bg-white overflow-hidden">
        {selectedChatId === null ? (
          <EmptyChatRoom />
        ) : (
          <ChatRoom chatId={selectedChatId} myRole={role} />
        )}
      </div>

    </div>
  );
};

export default ChatPage;
