import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getChatMessages } from '../../../api/chat/chatApi';
import Gallery from '../../../assets/chat/gallery.svg';
import QuotationCard from './QuotationCard';
import RequireCard from './RequireCard';
import PaymentModal, { type PaymentRequestData } from './PaymentModal';
import type { RoomType } from '../../../types/domain/chat/chatMessages';
import { connectSocket, getSocket } from '../../../utils/domain/socket';
import useAuthStore from '../../../stores/useAuthStore';

interface ChatRoomProps {
  chatId: string;
  myRole: 'REFORMER' | 'USER';
  roomType: RoomType
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId, myRole, roomType }) => {
  const [inputText, setInputText] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  /* =========================
   * 1. React Query 무한 스크롤 설정
   * ========================= */
  // select 제거
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
  queryKey: ['chatMessages', chatId],
  queryFn: ({ pageParam }) => getChatMessages(chatId, { cursor: pageParam as string }),
  initialPageParam: null as string | null,
  getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
});

// messages를 useMemo로 계산
const messages = React.useMemo(() => {
  if (!data) return [];
  return data.pages
    .flatMap(page => page.messages)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}, [data]);

  const roomInfo = data?.pages[0]?.chatRoomInfo; 

  /* =========================
   * 2. 스크롤 제어
   * ========================= */
  useEffect(() => {
    if (messagesContainerRef.current && !isFetchingNextPage) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length, isFetchingNextPage]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  /* =========================
   * 3. WebSocket 연결
   * ========================= */
  useEffect(() => {
    if (!accessToken) return;

    console.log('🔧 ChatRoom useEffect 실행');

    const socket = connectSocket(accessToken);
    if (!socket) return;

    let isJoined = false;

    const handleConnect = () => {
      console.log('connect 이벤트 - 방 입장 시도');
      if (!isJoined) {
        socket.emit('joinRoom', { roomId: chatId });
        socket.emit('readChatRoom', { roomId: chatId });
        isJoined = true;
      }
    };

    const handleNewMessage = (msg: any) => {
      queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
        if (!oldData) return oldData;

        const lastPageIndex = oldData.pages.length - 1;
        const updatedPages = [...oldData.pages];
        updatedPages[lastPageIndex] = {
          ...updatedPages[lastPageIndex],
          messages: [...updatedPages[lastPageIndex].messages, msg],
        };

        return {
          ...oldData,
          pages: updatedPages,
          allMessages: [...(oldData.allMessages || []), msg],
        };
      });


      socket.emit('readChatRoom', { roomId: chatId });
    };

    if (socket.connected) {
      handleConnect();
    }

    socket.on('connect', handleConnect);
    socket.on('newMessage', handleNewMessage);

    return () => {
      console.log('cleanup 실행');
      
      if (isJoined) {
        socket.emit('leaveRoom', { roomId: chatId });
      }
      
      socket.off('connect', handleConnect);
      socket.off('newMessage', handleNewMessage);
    };
  }, [accessToken, chatId, queryClient]);

  /* =========================
   * 4. 핸들러 함수
   * ========================= */
    const handleSend = () => {
      if (!inputText.trim()) return;

      const socket = getSocket();
      if (!socket || !socket.connected) {
        console.error('소켓이 연결되지 않음');
        return;
      }

      const tempMessage = {
        messageId: `temp-${Date.now()}`, // 임시 ID
        senderType: myRole === 'REFORMER' ? 'OWNER' : 'USER',
        senderId: 'me', // 임시
        messageType: 'text',
        textContent: inputText,
        payload: null,
        createdAt: new Date().toISOString(),
      };

      // 1️⃣ 낙관적 UI 적용: 바로 화면에 반영
      queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
        if (!oldData) return oldData;

        const lastPageIndex = oldData.pages.length - 1;
        const updatedPages = [...oldData.pages];
        updatedPages[lastPageIndex] = {
          ...updatedPages[lastPageIndex],
          messages: [...updatedPages[lastPageIndex].messages, tempMessage],
        };

        return {
          ...oldData,
          pages: updatedPages,
        };
      });

      // 2️⃣ 서버로 전송
      socket.emit('sendMessage', {
        roomId: chatId,
        contentType: 'text',
        content: inputText,
      });

      // 3️⃣ 입력창 초기화
      setInputText('');
  };


  const handlePaymentSend = (paymentData: PaymentRequestData) => {
    console.log("결제 요청 데이터 전송:", paymentData);
    setIsPaymentModalOpen(false);
  };

  const handleSendAction = () => {
    const path = myRole === 'REFORMER' ? '/chat/create/quotation' : '/chat/create/request';
    navigate(path, { state: { chatId } });
  };

  if (status === 'pending') {
    return <div className="flex-1 flex items-center justify-center">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col w-full h-[800px] border border-[var(--color-line-gray-40)] bg-white overflow-hidden">
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        onSend={handlePaymentSend} 
      />

      {/* 상단 상품 정보 */}
      {roomInfo && (roomType === 'REQUEST' || roomType === 'PROPOSAL') && (
        <div className="flex items-center p-4 border-b border-[var(--color-line-gray-40)] bg-white">
          <img
            src={roomInfo.targetPayload?.image ?? ''}
            alt="상품"
            className="w-12 h-12 rounded-md object-cover mr-3 bg-gray-100"
          />
          <div className="flex-1">
            <h2 className="text-[14px] font-medium text-black line-clamp-1">
              {roomInfo.targetPayload?.title ?? ''}
            </h2>

            {roomType === 'REQUEST' ? (
              <p className="text-[14px] font-bold text-black">
                {(roomInfo.targetPayload?.minBudget ?? 0).toLocaleString()}원 ~ {(roomInfo.targetPayload?.maxBudget ?? 0).toLocaleString()}원
              </p>
            ) : (
              <p className="text-[14px] font-bold text-black">
                {(() => {
                  // 배열이 이미 시간순이므로 마지막 proposal 찾기
                  const proposals = messages.filter(msg => msg.messageType === 'proposal');
                  const lastProposal = proposals[proposals.length - 1];
                  return (lastProposal?.payload?.price ?? 0).toLocaleString() + '원';
                })()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 채팅 메시지 영역 */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto bg-white p-4 space-y-6"
      >
        {isFetchingNextPage && (
          <div className="text-center text-xs text-gray-400">이전 메시지 불러오는 중...</div>
        )}

        {messages.map((msg, idx) => {
          const msgDate = new Date(msg.createdAt);
          const msgDateString = msgDate.toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit'
          });

          const prevMsg = messages[idx - 1];
          const prevDateString = prevMsg
            ? new Date(prevMsg.createdAt).toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit'
              })
            : null;

          const showDate = msgDateString !== prevDateString;

          const isMine = 
            (myRole === 'REFORMER' && msg.senderType === 'OWNER') ||
            (myRole === 'USER' && msg.senderType === 'USER');
          
          return (
            <React.Fragment key={msg.messageId}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="bg-[var(--color-gray-30)] text-[var(--color-gray-60)] px-4 py-1 rounded-full text-[12px]">
                    {msgDate.toLocaleDateString('ko-KR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              )}

              <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 mb-4`}>
                {!isMine && (
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img 
                      src={roomInfo?.owner.id === msg.senderId 
                        ? roomInfo.owner.profileImage || '' 
                        : roomInfo?.requester.profileImage || ''
                      } 
                      alt="profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-1.5`}>
                  <div className="flex flex-col">
                    {msg.messageType === 'request' && (
                      <RequireCard 
                        type={isMine ? 'sent' : 'received'} 
                        minBudget={msg.payload.minBudget}
                        maxBudget={msg.payload.maxBudget}
                        title={msg.payload.title}
                        nickname={isMine 
                          ? roomInfo?.requester.nickname ?? '알 수 없음' 
                          : roomInfo?.owner.nickname ?? '알 수 없음'
                        } 
                      />
                    )}
                    {msg.messageType === 'proposal' && (
                      <QuotationCard 
                        type={isMine ? 'sent' : 'received'} 
                        price={msg.payload.price} 
                        delivery={msg.payload.delivery}
                        nickname={isMine 
                          ? roomInfo?.requester.nickname ?? '사용자' 
                          : roomInfo?.owner.nickname ?? '리포머'
                        }
                      />
                    )}
                    {(msg.messageType === 'text' || msg.messageType === 'image') && (
                      <div className={`p-3 rounded-[0.625rem] max-w-[400px] ${
                        isMine 
                          ? 'bg-[var(--color-mint-5)] text-black rounded-tr-none' 
                          : 'bg-[var(--color-gray-20)] text-black rounded-tl-none'
                      }`}>
                        {msg.messageType === 'text' && (
                          <p className="text-[1rem] leading-relaxed whitespace-pre-wrap">
                            {msg.textContent}
                          </p>
                        )}
                        {msg.messageType === 'image' && (
                          <div className={`grid gap-1 ${
                            msg.payload.urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                          }`}>
                            {msg.payload.urls.map((url: string, i: number) => (
                              <img 
                                key={i} 
                                src={url} 
                                alt="chat" 
                                className="rounded-md w-full object-cover max-h-60" 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col body-b5-rg text-[var(--color-gray-50)] min-w-max">
                    <span>
                      {msgDate.toLocaleTimeString('ko-KR', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        hour12: true 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* 입력창 */}
      <div className="p-4 border-t border-[var(--color-line-gray-40)]">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="메세지를 입력하세요."
          className="w-full h-10 resize-none outline-none body-b1-rg"
        />
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-3">
            <button onClick={() => fileInputRef.current?.click()}>
              <img src={Gallery} alt="gallery" className="w-7" />
            </button>
            <input 
              type="file" 
              title="파일 첨부" 
              ref={fileInputRef} 
              className="hidden" 
              multiple 
              accept="image/*" 
            />
            
            <div className="flex items-center gap-3">
              {myRole === 'REFORMER' && (
                <>
                  <button 
                    onClick={() => setIsPaymentModalOpen(true)} 
                    className="px-3 py-1 border border-[var(--color-gray-50)] rounded-full body-b5-rg text-[var(--color-gray-50)]"
                  >
                    결제창 보내기
                  </button>

                  {roomType !== 'PROPOSAL' && (
                    <button 
                      onClick={handleSendAction} 
                      className="px-3 py-1 border border-[var(--color-gray-50)] rounded-full body-b5-rg text-[var(--color-gray-50)]"
                    >
                      견적서 보내기
                    </button>
                  )}
                </>
              )}
              {myRole === 'USER' && roomType !== 'PROPOSAL' && (
                <button 
                  onClick={handleSendAction} 
                  className="px-3 py-1 border border-[var(--color-gray-50)] rounded-full body-b5-rg text-[var(--color-gray-50)]"
                >
                  요청서 보내기
                </button>
              )}
            </div>
          </div>
          
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`px-6 py-2 rounded-lg font-bold ${
              inputText.trim() 
                ? 'bg-[var(--color-mint-1)] text-white' 
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;