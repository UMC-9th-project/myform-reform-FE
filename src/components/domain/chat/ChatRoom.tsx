import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery, useQueryClient} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getChatMessages } from '@/api/chat/chatApi';
import Gallery from '@/assets/chat/gallery.svg';
import QuotationCard from './QuotationCard';
import RequireCard from './RequireCard';
import PaymentModal, { type PaymentRequestData } from './PaymentModal';
import type { PaymentPayload, RoomType } from '@/types/api/chat/chatMessages';
import { connectSocket, getSocket } from '@/utils/domain/socket';
import useAuthStore from '@/stores/useAuthStore';
import { uploadImages } from '@/api/upload';
import PaymentCard from './PaymentCard';
import PayFinishCard from './PayFinishCard';
import ImageViewerModal from '../mypage/ImageViewModal';
import EstimateArriveCard from './EstimateArriveCard';

interface ChatRoomProps {
  chatId: string;
  myRole: 'REFORMER' | 'USER';
  roomType?: RoomType
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId, myRole, roomType }) => {
  const [inputText, setInputText] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [imageViewerImages, setImageViewerImages] = useState<string[]>([]);
  const [imageViewerIndex, setImageViewerIndex] = useState(0);



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
      .sort((a, b) => {
        const timeDiff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (timeDiff !== 0) return timeDiff;
        // createdAt 같으면 UUID 기준으로 정렬
        return a.messageId.localeCompare(b.messageId);
      });
  }, [data]);


  const roomInfo = data?.pages[0]?.chatRoomInfo; 

const myUserId = React.useMemo(() => {
  if (!roomInfo) return undefined;
  return myRole === 'REFORMER'
    ? roomInfo.owner.id
    : roomInfo.requester.id;
}, [roomInfo, myRole]);


// useMemo로 감싸서 변경 감지
const { opponentLastReadId, myLastReadId } = React.useMemo(() => {
  if (!roomInfo || !myUserId) {
    return {
      opponentLastReadId: null,
      myLastReadId: null,
    };
  }
  
  const isOwner = myUserId === roomInfo.owner.id;
  
  return {
    opponentLastReadId: isOwner
      ? roomInfo.requesterLastReadId
      : roomInfo.ownerLastReadId,
    myLastReadId: isOwner
      ? roomInfo.ownerLastReadId
      : roomInfo.requesterLastReadId,
  };
}, [roomInfo?.ownerLastReadId, roomInfo?.requesterLastReadId, roomInfo?.owner.id, myUserId, data]);




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
      senderId: myUserId,
      messageType: 'image',
      payload: { urls: imageUrls },
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    /** 1️⃣ 채팅 메시지 낙관적 UI */
    queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
      if (!oldData) return oldData;

      const lastPageIndex = oldData.pages.length - 1;
      const updatedPages = [...oldData.pages];
      updatedPages[lastPageIndex] = {
        ...updatedPages[lastPageIndex],
        messages: [...updatedPages[lastPageIndex].messages, tempMessage],
      };

      return { ...oldData, pages: updatedPages };
    });

    /** 2️⃣ 모든 채팅 탭 UI 낙관적 업데이트 */
    [undefined, 'INQUIRY', 'ORDER', 'UNREAD'].forEach((filterType) => {
      queryClient.setQueryData(['chatRooms', filterType], (oldData: any) => {
        if (!oldData?.data) return oldData;

        const updatedData = oldData.data.map((room: any) =>
          room.chatRoomId === chatId
            ? { ...room, lastMessage: '사진', lastMessageAt: tempMessage.createdAt }
            : room
        );

        const targetRoom = updatedData.find((room: any) => room.chatRoomId === chatId);
        if (!targetRoom) return oldData; // 안전 체크

        const sortedData = [targetRoom, ...updatedData.filter((room: any) => room.chatRoomId !== chatId)];

        return { ...oldData, data: sortedData };
      });
    });

    /** 3️⃣ 서버 전송 */
    socket.emit('sendMessage', {
      roomId: chatId,
      contentType: 'image',
      content: imageUrls,
    });
  };




  /* =========================
   * 2. 스크롤 제어
   * ========================= */
    const prevScrollHeight = useRef(0);
const isFetchingOld = useRef(false);

const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
  const { scrollTop } = e.currentTarget;

  if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
    isFetchingOld.current = true;          // 과거 메시지 로딩 시작
    prevScrollHeight.current = e.currentTarget.scrollHeight;
    fetchNextPage();
  }
};

useEffect(() => {
  const container = messagesContainerRef.current;
  if (!container) return;

  if (isFetchingOld.current) {
    // 과거 메시지 로딩 후 스크롤 위치 유지
    container.scrollTop = container.scrollHeight - prevScrollHeight.current;
    prevScrollHeight.current = 0;
    isFetchingOld.current = false;
    return;
  }

  // 새 메시지가 추가된 경우만 맨 아래로
  container.scrollTop = container.scrollHeight;
}, [messages.length]); // messages.length만 의존

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
  console.log('📖 readStatus 받음:', {
    받은데이터: data,
    현재chatId: chatId,
    내ID: myUserId,
    일치여부: data.chatRoomId === chatId
  });
  
  if (data.chatRoomId !== chatId) return;

  queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
    if (!oldData) {
      console.log('❌ oldData 없음');
      return oldData;
    }

    const updatedPages = oldData.pages.map((page: any, idx: number) => {
      if (idx !== 0) return page;

      const isReaderOwner = page.chatRoomInfo.owner.id === data.readerId;
      
      console.log('🔍 비교:', {
        ownerID: page.chatRoomInfo.owner.id,
        readerID: data.readerId,
        isReaderOwner,
        기존ownerLastReadId: page.chatRoomInfo.ownerLastReadId,
        기존requesterLastReadId: page.chatRoomInfo.requesterLastReadId,
        새로운lastReadMessageId: data.lastReadMessageId
      });

      return {
        ...page,
        chatRoomInfo: {
          ...page.chatRoomInfo,
          ownerLastReadId: isReaderOwner
            ? data.lastReadMessageId
            : page.chatRoomInfo.ownerLastReadId,
          requesterLastReadId: !isReaderOwner
            ? data.lastReadMessageId
            : page.chatRoomInfo.requesterLastReadId,
        },
      };
    });

    const result = { ...oldData, pages: updatedPages };
    console.log('✅ 업데이트 완료:', result.pages[0].chatRoomInfo);
    return result;
  });
};


  const handleNewMessage = (msg: any) => {
  const isCurrentRoom = !msg.chatRoomId || msg.chatRoomId === chatId;

  // 1️⃣ 현재 채팅방의 메시지만 메시지 목록에 추가
  if (isCurrentRoom) {
  queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
    if (!oldData) return oldData;

    const lastPageIndex = oldData.pages.length - 1;
    const updatedPages = [...oldData.pages];

    updatedPages[lastPageIndex] = {
      ...updatedPages[lastPageIndex],
      messages: [...updatedPages[lastPageIndex].messages, msg],
    };
    
    const isReaderOwner =
      oldData.pages[0].chatRoomInfo.owner.id === myUserId;

    updatedPages[0] = {
      ...updatedPages[0],
      chatRoomInfo: {
        ...updatedPages[0].chatRoomInfo,
        ownerLastReadId: isReaderOwner
          ? msg.messageId
          : updatedPages[0].chatRoomInfo.ownerLastReadId,
        requesterLastReadId: !isReaderOwner
          ? msg.messageId
          : updatedPages[0].chatRoomInfo.requesterLastReadId,
      },
    };

    return {
      ...oldData,
      pages: updatedPages,
    };
  });

  // 서버에도 읽음 알림
  socket?.emit('readChatRoom', { roomId: chatId });
}


  // 2️⃣ 모든 채팅방에 대해 탭 목록 업데이트
  const lastMessageText =
    msg.messageType === 'text'
      ? msg.textContent
      : msg.messageType === 'image'
      ? '(사진)'
      : msg.messageType === 'proposal'
      ? '(견적서)'
      : msg.messageType === 'request'
      ? '(요청서)'
      : msg.messageType === 'payment'
      ? '(결제창) '
      : msg.messageType === 'result'
      ? '(결제 완료)'
      : msg.messageType === 'accept'
      ? '거래 진행 여부'
      : '(새로운 메시지)'

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
    senderId: myUserId, // 임시
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
      messages: [...updatedPages[lastPageIndex].messages, tempMessage],
    };

    return { ...oldData, pages: updatedPages };
  });

  // 2️⃣ 모든 채팅 탭 UI 낙관적 업데이트
  [undefined, 'INQUIRY', 'ORDER', 'UNREAD'].forEach(filterType => {
    queryClient.setQueryData(['chatRooms', filterType], (oldData: any) => {
      if (!oldData?.data) return oldData;

      const updatedData = oldData.data.map((room: any) =>
        room.chatRoomId === chatId
          ? { ...room, lastMessage: inputText, lastMessageAt: tempMessage.createdAt }
          : room
      );

      // 메시지가 온 채팅방 맨 위로
      const targetRoom = updatedData.find((room: any) => room.chatRoomId === chatId);
      if (!targetRoom) return oldData;
      const sortedData = [
        targetRoom,
        ...updatedData.filter((room: any) => room.chatRoomId !== chatId),
      ];

      return { ...oldData, data: sortedData };
    });
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
    const socket = getSocket();
    if (!socket || !socket.connected) return;

    const tempMessage = {
      messageId: `temp-${Date.now()}`,
      senderType: myRole === 'REFORMER' ? 'OWNER' : 'USER',
      senderId: myUserId,
      messageType: 'payment', // 여기 중요
      payload: {
        price: paymentData.price,
        delivery: paymentData.delivery,
        expectedWorking: paymentData.days,
        // receiptNumber, orderId는 서버에서 나중에 채워줄 수 있음
      },
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    

    // 1️⃣ 낙관적 UI
    queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
      if (!oldData) return oldData;
      const lastPageIndex = oldData.pages.length - 1;
      const updatedPages = [...oldData.pages];
      updatedPages[lastPageIndex] = {
        ...updatedPages[lastPageIndex],
        messages: [...updatedPages[lastPageIndex].messages, tempMessage],
      };
      return { ...oldData, pages: updatedPages };
    });

    // 2️⃣ 채팅 탭 UI
    queryClient.setQueryData(['chatRooms', undefined], (oldData: any) => {
      if (!oldData?.data) return oldData;
      const updatedData = oldData.data.map((room: any) =>
        room.chatRoomId === chatId
          ? { ...room, lastMessage: '결제 요청', lastMessageAt: tempMessage.createdAt }
          : room
      );
      const sortedData = [
        updatedData.find((room: any) => room.chatRoomId === chatId)!,
        ...updatedData.filter((room: any) => room.chatRoomId !== chatId),
      ];
      return { ...oldData, data: sortedData };
    });

    socket.emit('sendMessage', {
      roomId: chatId,
      contentType: 'payment',
      content: paymentData,
    });

    // 모달 닫기
    setIsPaymentModalOpen(false);
  };

  const handlePaymentFinishOptimistic = (payload: PaymentPayload) => {
    const tempResultMessage = {
      messageId: `temp-result-${Date.now()}`,
      senderType: myRole === 'REFORMER' ? 'OWNER' : 'USER',
      senderId: myUserId,
      messageType: 'result',
      payload: {
        totalAmount: payload.price,
        receiptNumber: '-', // 서버에서 채워줄 예정
        approvedAt: new Date().toISOString(),
        paymentMethod: {
          type: 'CARD_EASY_PAY',
          provider: '',
          cardNumber: '',
        },
      },
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
      if (!oldData) return oldData;
      const lastPageIndex = oldData.pages.length - 1;
      const updatedPages = [...oldData.pages];
      updatedPages[lastPageIndex] = {
        ...updatedPages[lastPageIndex],
        messages: [...updatedPages[lastPageIndex].messages, tempResultMessage],
      };
      return { ...oldData, pages: updatedPages };
    });

    queryClient.setQueryData(['chatRooms', undefined], (oldData: any) => {
      if (!oldData?.data) return oldData;
      const updatedData = oldData.data.map((room: any) =>
        room.chatRoomId === chatId
          ? { ...room, lastMessage: '결제 완료', lastMessageAt: tempResultMessage.createdAt }
          : room
      );
      const sortedData = [
        updatedData.find((room: any) => room.chatRoomId === chatId)!,
        ...updatedData.filter((room: any) => room.chatRoomId !== chatId),
      ];
      return { ...oldData, data: sortedData };
    });
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

  const handleAnswerEstimate = (messageId: string, isAccepted: boolean) => {
    const socket = getSocket();
    if (!socket || !socket.connected) return;

    const tempMessage = {
      messageId: `temp-${isAccepted ? 'accept' : 'reject'}-${Date.now()}`,
      senderType: myRole === 'REFORMER' ? 'OWNER' : 'USER',
      senderId: myUserId,
      messageType: 'accept',
      payload: { isAccepted },
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // 메시지 UI 업데이트
    queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
      if (!oldData) return oldData;
      const lastPageIndex = oldData.pages.length - 1;
      const updatedPages = [...oldData.pages];
      updatedPages[lastPageIndex] = {
        ...updatedPages[lastPageIndex],
        messages: [...updatedPages[lastPageIndex].messages, tempMessage],
      };
      return { ...oldData, pages: updatedPages };
    });

    // 채팅 리스트 탭 UI
    queryClient.setQueryData(['chatRooms', undefined], (oldData: any) => {
      if (!oldData?.data) return oldData;
      const updatedData = oldData.data.map((room: any) => {
        if (room.chatRoomId !== chatId) return room;
        return {
          ...room,
          lastMessage: isAccepted ? '문의 진행 중' : '제안 거절됨',
          lastMessageAt: tempMessage.createdAt,
        };
      });
      const targetRoom = updatedData.find((r: any) => r.chatRoomId === chatId);
      const sortedData = [
        targetRoom,
        ...updatedData.filter((r: any) => r.chatRoomId !== chatId),
      ];
      return { ...oldData, data: sortedData };
    });

    // 서버 전송
    socket.emit('sendMessage', {
      roomId: chatId,
      contentType: 'accept',
      content: { messageId, isAccepted },
    });
  };




  return (
    <div className="flex flex-col w-full h-[800px] border border-[var(--color-line-gray-40)] bg-white overflow-hidden">
      <PaymentModal 
        roomId={chatId}
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

          const isMine = myUserId ? msg.senderId === myUserId : false;
          const isRead =
            (isMine &&
              opponentLastReadId &&
              msg.messageId <= opponentLastReadId) ||
            (!isMine &&
              myLastReadId &&
              msg.messageId <= myLastReadId);


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
                    {msg.messageType === 'payment' && (
                      <PaymentCard
                        type={isMine ? 'sent' : 'received'}
                        nickname={isMine ? roomInfo?.requester.nickname ?? '사용자' : roomInfo?.owner.nickname ?? '리포머'}
                        payload={msg.payload}
                        onFinish={handlePaymentFinishOptimistic}
                      />
                    )}

                    {msg.messageType === 'result' && msg.payload && (
                      <PayFinishCard
                        type={isMine ? 'sent' : 'received'}
                        price={msg.payload.totalAmount ?? 0}
                        orderNumber={msg.payload.receiptNumber ?? '-'}
                        paymentMethod={
                          msg.payload.paymentMethod?.type === 'CARD_EASY_PAY' 
                            ? '카드 간편결제' 
                            : (msg.payload.paymentMethod?.type || '결제 수단 없음')
                        }
                        paymentDetail={`${msg.payload.paymentMethod?.provider ?? ''} / ${msg.payload.paymentMethod?.cardNumber ?? ''}`}
                        date={
                          msg.payload.approvedAt 
                            ? new Date(msg.payload.approvedAt).toLocaleString('ko-KR', { 
                                year: 'numeric', month: '2-digit', day: '2-digit', 
                                hour: '2-digit', minute: '2-digit', hour12: false 
                              })
                            : '-'
                        }
                      />
                    )}

                    {msg.messageType === 'proposal' && (
                      <QuotationCard
                        id={msg.payload.id} 
                        type={isMine ? 'sent' : 'received'} 
                        price={msg.payload.price} 
                        delivery={msg.payload.delivery}
                        nickname={isMine 
                          ? roomInfo?.requester.nickname ?? '사용자' 
                          : roomInfo?.owner.nickname ?? '리포머'
                        }
                        expectedWorking={msg.payload.expectedWorking}
                      />
                    )}

                    {msg.messageType === 'accept' && (
                      msg.payload?.isAccepted === false ? (
                        <div
                          className={`p-3 rounded-[0.625rem] max-w-[400px] ${
                            isMine
                              ? 'bg-[#FFF7D6] text-[#5A4D2F] rounded-tr-none'
                              : 'bg-[#FFF7D6] text-[#5A4D2F] rounded-tl-none'
                          }`}
                        >
                          <p className="text-[1rem] leading-relaxed whitespace-pre-wrap">
                            안내 메시지: 제안이 거절되었습니다
                          </p>
                        </div>
                      ) : msg.payload?.isAccepted === true ? (
                        <div
                          className={`p-3 rounded-[0.625rem] max-w-[400px] ${
                            isMine
                              ? 'bg-[#FFF7D6] text-[#5A4D2F] rounded-tr-none'
                              : 'bg-[#FFF7D6] text-[#5A4D2F] rounded-tl-none'
                          }`}
                        >
                          <p className="text-[1rem] leading-relaxed whitespace-pre-wrap">
                            안내 메시지: 계속 문의를 진행해보세요
                          </p>
                        </div>
                      ) : (
                        <EstimateArriveCard
                          type={isMine ? 'sent' : 'received'}
                          onReject={() => handleAnswerEstimate(msg.messageId, false)}
                          onAccept={() => handleAnswerEstimate(msg.messageId, true)}
                        />
                      )
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
                                className="relative aspect-square w-full overflow-hidden border border-[var(--color-line-gray-40)] rounded-md cursor-pointer"
                                onClick={() => {
                                  setImageViewerImages(msg.payload.urls);
                                  setImageViewerIndex(idx);
                                  setIsImageViewerOpen(true);
                                }}
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

                     {isRead && (
                      <span className="body-b5-rg text-[var(--color-gray-50)]">
                        읽음
                      </span>
                    )}

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
      {isImageViewerOpen && (
      <ImageViewerModal
        images={imageViewerImages}
        currentIndex={imageViewerIndex}
        setCurrentIndex={setImageViewerIndex}
        onClose={() => setIsImageViewerOpen(false)}
      />
    )}

    </div>
  );
};

export default ChatRoom;