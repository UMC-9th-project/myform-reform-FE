import React, { useEffect, useState } from 'react';
import ChatListTab from '../../components/domain/chat/ChatListTab';
import ChatRoom from '../../components/domain/chat/ChatRoom';
import EmptyChatRoom from '../../components/domain/chat/EmptyChatRoom';

const NormalChat = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  

    useEffect(() => {
    console.log('selectedChatId:', selectedChatId);
  }, [selectedChatId]);

  return (
    <div className="flex flex-row-reverse w-full h-screen bg-[var(--color-gray-20)] overflow-hidden">
  
  {/* 오른쪽 채팅 목록 */}
  <div className="w-[24rem] ml-3 m-10 border-[var(--color-line-gray-40)] bg-white">
    <ChatListTab
      selectedChat={selectedChatId}
      setSelectedChat={setSelectedChatId} />
  </div>

  {/* 왼쪽 채팅방 컨테이너 */}
  <div className="flex-1  mr-0 m-10 flex flex-col min-w-0 bg-white overflow-hidden">
    {selectedChatId === null ? (
      <EmptyChatRoom />
    ) : (
      <ChatRoom chatId={selectedChatId} myRole='USER' />
    )}
  </div>
  
</div>
  );
};

export default NormalChat;
