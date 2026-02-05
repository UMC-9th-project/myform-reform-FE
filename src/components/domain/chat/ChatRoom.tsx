import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getChatMessages } from '../../../api/chat/chatApi';
import Gallery from '../../../assets/chat/gallery.svg';
import QuotationCard from './QuotationCard'; // backend: proposal
import RequireCard from './RequireCard';   // backend: request
//import PaymentCard from './PaymentCard';   // UI상 결제창
import PaymentModal, { type PaymentRequestData } from './PaymentModal';
import type { RoomType } from '../../../types/domain/chat/chatMessages';

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
  const navigate = useNavigate();

  /* =========================
   * 1. React Query 무한 스크롤 설정
   * ========================= */
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['chatMessages', chatId],
    queryFn: ({ pageParam }) => getChatMessages(chatId, { cursor: pageParam as string }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
    select: (data) => ({
  pages: [...data.pages],
  allMessages: data.pages
    .flatMap((page) => page.messages)
    .reverse(),
  roomInfo: data.pages[0]?.chatRoomInfo,
}),
  });

  // 메시지 전체 데이터
  const messages = data?.allMessages ?? [];
  const roomInfo = data?.roomInfo;

  /* =========================
   * 2. 스크롤 제어
   * ========================= */
  // 메시지가 추가되면 하단으로 자동 스크롤
  useEffect(() => {
    if (messagesContainerRef.current && !isFetchingNextPage) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length, isFetchingNextPage]);

  // 상단 스크롤 감지 (이전 메시지 로딩)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  /* =========================
   * 3. 핸들러 함수
   * ========================= */
  const handleSend = () => {
    if (!inputText.trim()) return;
    console.log("텍스트 전송 API 호출:", inputText);
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

  if (status === 'pending') return <div className="flex-1 flex items-center justify-center">로딩 중...</div>;

  return (
    <div className="flex flex-col w-full h-[800px] border border-[var(--color-line-gray-40)] bg-white overflow-hidden">
      {/* 결제 모달 */}
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
              // PROPOSAL이면 마지막 proposal 메시지 찾아서 price 사용
              <p className="text-[14px] font-bold text-black">
                {(() => {
                  const lastProposal = data?.allMessages.reverse().find(msg => msg.messageType === 'proposal');
                  return (lastProposal?.payload.price ?? 0).toLocaleString() + '원';
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
        {isFetchingNextPage && <div className="text-center text-xs text-gray-400">이전 메시지 불러오는 중...</div>}

        {messages.map((msg, idx) => {
          const msgDate = new Date(msg.createdAt);
          const msgDateString = msgDate.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit'});

          const prevMsg = messages[idx - 1];
          const prevDateString = prevMsg
            ? new Date(prevMsg.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit'})
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
                    {msgDate.toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}

              <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 mb-4`}>
                {/* 상대방 프로필 이미지 */}
                {!isMine && (
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img 
                      src={roomInfo?.owner.id === msg.senderId ? roomInfo.owner.profileImage || '' : roomInfo?.requester.profileImage || ''} 
                      alt="profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* 메시지 내용 + 시간 묶음 */}
                <div className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-1.5`}>
                  
                  {/* 1. 실제 말풍선/카드 영역 */}
                  <div className="flex flex-col">
                    {msg.messageType === 'request' && (
                      <RequireCard 
                        type={isMine ? 'sent' : 'received'} 
                        price={msg.payload.maxBudget} 
                        title={msg.payload.title} 
                      />
                    )}
                    {msg.messageType === 'proposal' && (
                      <QuotationCard 
                        type={isMine ? 'sent' : 'received'} 
                        price={msg.payload.price} 
                        delivery={msg.payload.delivery}
                      />
                    )}
                    {(msg.messageType === 'text' || msg.messageType === 'image') && (
                      <div className={`p-3 rounded-[0.625rem] max-w-[400px] ${
                        isMine ? 'bg-[var(--color-mint-5)] text-black rounded-tr-none' : 'bg-[var(--color-gray-20)] text-black rounded-tl-none'
                      }`}>
                        {msg.messageType === 'text' && <p className="text-[1rem] leading-relaxed whitespace-pre-wrap">{msg.textContent}</p>}
                        {msg.messageType === 'image' && (
                          <div className={`grid gap-1 ${msg.payload.urls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {msg.payload.urls.map((url, i) => (
                              <img key={i} src={url} alt="chat" className="rounded-md w-full object-cover max-h-60" />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 2. 시간 표시 (말풍선 옆에 하단 정렬) */}
                  <div className={`flex flex-col body-b5-rg text-[var(--color-gray-50)] min-w-max`}>
                    <span>{msgDate.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* 입력창 및 액션 버튼 */}
      <div className="p-4 border-t border-[var(--color-line-gray-40)]">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="메세지를 입력하세요."
          className="w-full h-10 resize-none outline-none body-b1-rg"
        />
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-3">
            <button onClick={() => fileInputRef.current?.click()}><img src={Gallery} alt="gallery" className="w-7" /></button>
            <input type="file" title= "파일 첨부" ref={fileInputRef} className="hidden" multiple accept="image/*" />
            
            {myRole === 'REFORMER' ? (
              <>
                <button onClick={() => setIsPaymentModalOpen(true)} className="px-3 py-1.5 border border-[var(--color-gray-50)] rounded-full text-[12px] text-gray-500">결제창 보내기</button>
                <button onClick={handleSendAction} className="px-3 py-1.5 border border-[var(--color-gray-50)] rounded-full text-[12px] text-gray-500">견적서 보내기</button>
              </>
            ) : (
              <button onClick={handleSendAction} className="px-3 py-1.5 border border-[var(--color-gray-50)] rounded-full text-[12px] text-gray-500">요청서 보내기</button>
            )}
          </div>
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`px-6 py-2 rounded-lg font-bold ${inputText.trim() ? 'bg-[var(--color-mint-1)] text-white' : 'bg-gray-200 text-gray-400'}`}
          >
            보내기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;