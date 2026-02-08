import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getChatMessages } from '@/api/chat/chatApi';
import Gallery from '@/assets/chat/gallery.svg';
import QuotationCard from './QuotationCard';
import RequireCard from './RequireCard';
import PaymentModal, { type PaymentRequestData } from './PaymentModal';
import type { RoomType } from '@/types/api/chat/chatMessages';
import { connectSocket, getSocket } from '@/utils/domain/socket';
import useAuthStore from '@/stores/useAuthStore';
import { uploadImages } from '@/api/upload';

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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
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

  const handleImageChange = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  try {
    const fileArray = Array.from(files);

    // 1️⃣ 서버 업로드
      const uploadResult = await uploadImages(fileArray);
      const imageUrls = uploadResult.success.url;

      // 2️⃣ 이미지 메시지 전송
      sendImageMessage(imageUrls);
    } catch (err) {
      console.error('이미지 업로드 실패', err);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      // 같은 파일 다시 선택 가능하게 초기화
      e.target.value = '';
    }
  };

  

  const sendImageMessage = (imageUrls: string[]) => {
  const socket = getSocket();
  if (!socket || !socket.connected) {
    console.error('소켓 연결 안 됨');
    return;
  }

  const tempMessage = {
    messageId: `temp-${Date.now()}`,
    senderType: myRole === 'REFORMER' ? 'OWNER' : 'USER',
    senderId: 'me',
    messageType: 'image',
    payload: {
      urls: imageUrls,
    },
    createdAt: new Date().toISOString(),
    isRead: false,
  };

  /** ✅ 1. 채팅 메시지 낙관적 UI */
  queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
    if (!oldData) return oldData;

    const lastPageIndex = oldData.pages.length - 1;
    const updatedPages = [...oldData.pages];

    updatedPages[lastPageIndex] = {
      ...updatedPages[lastPageIndex],
      messages: [
        ...updatedPages[lastPageIndex].messages,
        tempMessage,
      ],
    };

    return { ...oldData, pages: updatedPages };
  });

  /** ✅ 2. 채팅 목록 낙관적 UI */
  queryClient.setQueryData(['chatRooms', undefined], (oldData: any) => {
    if (!oldData?.data) return oldData;

    const updatedData = oldData.data.map((room: any) =>
      room.chatRoomId === chatId
        ? {
            ...room,
            lastMessage: '사진',
            lastMessageAt: tempMessage.createdAt,
          }
        : room
    );

    const sortedData = [
      updatedData.find((room: any) => room.chatRoomId === chatId)!,
      ...updatedData.filter((room: any) => room.chatRoomId !== chatId),
    ];

    return { ...oldData, data: sortedData };
  });

  /** ✅ 3. 서버 전송 */
  socket.emit('sendMessage', {
    roomId: chatId,
    contentType: 'image',
    content: imageUrls,
  });
};



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

  const socket = connectSocket(accessToken);
  if (!socket) return;

  let isJoined = false;

  const handleConnect = () => {
  if (!isJoined) {
    socket.emit('joinRoom', { roomId: chatId });
    socket.emit('readChatRoom', { roomId: chatId });
    isJoined = true;

    // ✅ 방 입장 시 탭의 unreadCount 바로 0 처리
    queryClient.setQueryData(['chatRooms', undefined], (oldData: any) => {
      if (!oldData?.data) return oldData;

      const updatedData = oldData.data.map((room: any) =>
        room.chatRoomId === chatId
          ? { ...room, unreadCount: 0 }
          : room
      );

      return { ...oldData, data: updatedData };
    });
  }
};

  const handleReadStatus = (data: {
  chatRoomId: string;
  readerId: string;
  lastReadMessageId: string;
}) => {
  if (data.chatRoomId !== chatId) return;

  // 1️⃣ messages 업데이트 (상대 메시지만 isRead: true)
  queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
    if (!oldData) return oldData;

    const updatedPages = oldData.pages.map((page: any) => ({
      ...page,
      messages: page.messages.map((msg: any) => {
        const isOther =
          (myRole === 'REFORMER' && msg.senderType === 'USER') ||
          (myRole === 'USER' && msg.senderType === 'OWNER');

        if (!String(msg.messageId).startsWith('temp-') && isOther && msg.messageId <= data.lastReadMessageId) {
          return { ...msg, isRead: true }; // UI 표시 없이도 unreadCount 계산용
        }
        return msg;
      }),
    }));

    return { ...oldData, pages: updatedPages };
  });

  // 2️⃣ chatRooms의 unreadCount 업데이트 (0으로)
  queryClient.setQueryData(['chatRooms', undefined], (oldData: any) => {
    if (!oldData?.data) return oldData;

    const updatedData = oldData.data.map((room: any) =>
      room.chatRoomId === chatId
        ? { ...room, unreadCount: 0 } // 여기서 탭에 표시되는 안읽음 개수 업데이트
        : room
    );

    return { ...oldData, data: updatedData };
  });
};




  const handleNewMessage = (msg: any) => {
  const isCurrentRoom = !msg.chatRoomId || msg.chatRoomId === chatId;

  // 1️⃣ 현재 채팅방의 메시지만 메시지 목록에 추가
  if (isCurrentRoom) {
    queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
      if (!oldData) return oldData;

      const exists = oldData.pages
        .flatMap((p: any) => p.messages)
        .some((m: any) => m.messageId === msg.messageId);

      if (exists) return oldData;

      const lastPageIndex = oldData.pages.length - 1;
      const updatedPages = [...oldData.pages];
      updatedPages[lastPageIndex] = {
        ...updatedPages[lastPageIndex],
        messages: [...updatedPages[lastPageIndex].messages, msg],
      };

      return {
        ...oldData,
        pages: updatedPages,
      };
    });

    // 현재 채팅방이면 읽음 처리
    const socket = getSocket();
    socket?.emit('readChatRoom', { roomId: chatId });
  }

  // 2️⃣ 모든 채팅방에 대해 탭 목록 업데이트
  const lastMessageText =
    msg.messageType === 'text'
      ? msg.textContent
      : msg.messageType === 'image'
      ? '사진'
      : msg.messageType === 'proposal'
      ? '견적서'
      : '요청서';

  const targetRoomId = msg.chatRoomId || chatId;

  [undefined, 'INQUIRY', 'ORDER', 'UNREAD'].forEach(filterType => {
    queryClient.setQueryData(['chatRooms', filterType], (oldData: any) => {
      if (!oldData?.data) return oldData;

      const updatedData = oldData.data.map((room: any) => {
        if (room.chatRoomId !== targetRoomId) return room;

        // 현재 채팅방이면 unreadCount 0, 다른 채팅방이면 +1
        const newUnreadCount = isCurrentRoom ? 0 : (room.unreadCount || 0) + 1;

        return {
          ...room,
          lastMessage: lastMessageText,
          lastMessageAt: msg.createdAt,
          unreadCount: newUnreadCount,
        };
      });

      // 메시지가 온 채팅방을 맨 위로
      const targetRoom = updatedData.find((room: any) => room.chatRoomId === targetRoomId);
      if (!targetRoom) return { ...oldData, data: updatedData };

      const sortedData = [
        targetRoom,
        ...updatedData.filter((room: any) => room.chatRoomId !== targetRoomId),
      ];

      return { ...oldData, data: sortedData };
    });
  });
};

    // 소켓 이벤트 등록
    if (socket.connected) handleConnect();
    socket.on('connect', handleConnect);
    socket.on('newMessage', handleNewMessage);
    socket.on('readStatus', handleReadStatus);

    return () => {
      if (isJoined) socket.emit('leaveRoom', { roomId: chatId });
      socket.off('connect', handleConnect);
      socket.off('newMessage', handleNewMessage);
      socket.off('readStatus', handleReadStatus);
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
    isRead: false,
  };

  //text 낙관적 UI 
  queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
    if (!oldData) return oldData;

    const lastPageIndex = oldData.pages.length - 1;
    const updatedPages = [...oldData.pages];

    updatedPages[lastPageIndex] = {
      ...updatedPages[lastPageIndex],
      messages: [
        ...updatedPages[lastPageIndex].messages,
        tempMessage,
      ],
    };

  return { ...oldData, pages: updatedPages };
  });


    /// 채팅 목록(Tab) 낙관적 UI 업데이트 + 맨 위로
  queryClient.setQueryData(['chatRooms', undefined], (oldData: any) => {
    if (!oldData?.data) return oldData;

    const updatedData = oldData.data.map((room: any) =>
      room.chatRoomId === chatId
        ? { ...room, lastMessage: inputText, lastMessageAt: tempMessage.createdAt }
        : room
    );

    // 맨 위로 올리기
    const sortedData = [
      updatedData.find((room: any) => room.chatRoomId === chatId)!,
      ...updatedData.filter((room: any) => room.chatRoomId !== chatId),
    ];

    return { ...oldData, data: sortedData };
  });


    // 서버로 전송
    socket.emit('sendMessage', {
      roomId: chatId,
      contentType: 'text',
      content: inputText,
    });

    // 입력창 초기화
    setInputText('');
  };


  const handlePaymentSend = (paymentData: PaymentRequestData) => {
    console.log("결제 요청 데이터 전송:", paymentData);
    setIsPaymentModalOpen(false);
  };

  const handleSendAction = () => {
    if (myRole === 'USER') {
      // USER는 요청서 작성 페이지로 이동
      navigate(`/chat/create/request/${chatId}`, {
        state: {
          mode: 'create',
        },
      });
    } else if (myRole === 'REFORMER') {
      // REFORMER는 견적서 작성 페이지로 이동
      navigate(`/chat/create/quotation/${chatId}`, {
        state: {
          mode: 'create',
        },
      });
    }
  };


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
                        requestId={msg.payload.id}
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
                        expectedWorking={msg.payload.expected_working}
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
                        {msg.messageType === 'image' && msg.payload.urls && (
                          <div
                            className={`grid gap-1.5 ${
                              msg.payload.urls.length === 1
                                ? 'grid-cols-1 w-[240px]'
                                : msg.payload.urls.length === 2
                                ? 'grid-cols-2 w-[320px]'
                                : 'grid-cols-3 w-[360px]'
                            }`}
                          >
                            {msg.payload.urls.map((url, idx) => (
                              <div
                                key={idx}
                                className="relative aspect-square w-full overflow-hidden border border-[var(--color-line-gray-40)] rounded-md"
                              >
                                <img
                                  src={url}
                                  alt={`sent-${idx}`}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    )}
                  </div>

                  <div
                    className={`flex flex-col justify-end body-b5-rg text-[var(--color-gray-50)] min-w-max pb-0.5 ${
                      isMine ? 'items-end' : 'items-start'
                    }`}
                  >
                    {/* ✅ 읽음 표시 */}
                     {/*{isMine && isRead && ( /* 여기 추후에 msg.isRead로 변경 필요
                      <span className="mb-0.5 text-[10px] text-[var(--color-gray-40)]">
                        읽음
                      </span>
                    )} */}

                    <span>
                      {msgDate.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
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
              onChange={handleImageChange}
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