import React, { useState, useEffect, useRef } from 'react';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getChatMessages } from '@/api/chat/chatApi';
import { getReformProposalDetail } from '@/api/order/reformProposal';
import type { ReformProposalDetail } from '@/types/api/order/reformProposal';
import Gallery from '@/assets/chat/gallery.svg';
import QuotationCard from './QuotationCard';
import RequireCard from './RequireCard';
import PaymentModal, { type PaymentRequestData } from './PaymentModal';
import type {
  ChatMessage,
  ChatMessagesPage,
  ChatRoomInfo,
  ChatRoomWithUnread,
  PaymentPayload,
  PaymentResult,
  RoomType,
} from '@/types/api/chat/chatMessages';
import { connectSocket, getSocket } from '@/utils/domain/socket';
import useAuthStore from '@/stores/useAuthStore';
import { uploadImages } from '@/api/upload';
import PaymentCard from './PaymentCard';
import PayFinishCard from './PayFinishCard';
import ImageViewerModal from '../mypage/ImageViewModal';
import EstimateArriveCard from './EstimateArriveCard';
import { getLastMessageText } from '@/utils/domain/chatLastMessage';

interface ChatRoomProps {
  chatId: string;
  myRole: 'REFORMER' | 'USER';
  roomType?: RoomType;
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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<ChatMessagesPage, Error>({
      queryKey: ['chatMessages', chatId],
      queryFn: async ({ pageParam }: { pageParam?: unknown }) => {
        // pageParam이 null이면 undefined로 바꿔주기
        const cursor = pageParam == null ? undefined : (pageParam as string);

        const res = await getChatMessages(chatId, { cursor });

        const chatRoomInfo = res.chatRoomInfo
          ? {
              owner: {
                ...res.chatRoomInfo.owner,
                profileImage: res.chatRoomInfo.owner.profileImage ?? null,
              },
              requester: {
                ...res.chatRoomInfo.requester,
                profileImage: res.chatRoomInfo.requester.profileImage ?? null,
              },
              ownerLastReadId: res.chatRoomInfo.ownerLastReadId,
              requesterLastReadId: res.chatRoomInfo.requesterLastReadId,
              type: res.chatRoomInfo.type,
              targetPayload: res.chatRoomInfo.targetPayload
                ? {
                    ...res.chatRoomInfo.targetPayload,
                    minBudget:
                      res.chatRoomInfo.targetPayload.minBudget ?? undefined,
                    maxBudget:
                      res.chatRoomInfo.targetPayload.maxBudget ?? undefined,
                    image: res.chatRoomInfo.targetPayload.image ?? undefined,
                  }
                : undefined,
            }
          : undefined;

        return {
          messages: res.messages,
          nextCursor: res.nextCursor,
          hasMore: res.hasMore,
          chatRoomInfo,
        };
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasMore ? lastPage.nextCursor : undefined,
      initialPageParam: null, // 무시 가능, pageParam = null이면 undefined 처리
    });

  // messages를 useMemo로 계산
  const messages = React.useMemo(() => {
    if (!data) return [];
    return data.pages
      .flatMap((page) => page.messages)
      .sort((a, b) => {
        const timeDiff =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (timeDiff !== 0) return timeDiff;
        // createdAt 같으면 UUID 기준으로 정렬
        return a.messageId.localeCompare(b.messageId);
      });
  }, [data]);

  const roomInfo = data?.pages[0]?.chatRoomInfo;

  // PROPOSAL 타입일 때 제안서 상세 조회
  const proposalId =
    roomInfo?.type === 'PROPOSAL' ? roomInfo.targetPayload?.id : null;

  const { data: proposalDetailResponse } = useQuery({
    queryKey: ['reform-proposal-detail', proposalId],
    queryFn: async () => {
      if (!proposalId) {
        return null;
      }
      const data = await getReformProposalDetail(proposalId);
      if (data.resultType !== 'SUCCESS' || !data.success) {
        return null;
      }
      return data.success;
    },
    enabled: !!proposalId,
    staleTime: 1000 * 60 * 5,
  });

  const proposalDetail = React.useMemo((): ReformProposalDetail | null => {
    if (!proposalDetailResponse) return null;

    if (
      'resultType' in proposalDetailResponse &&
      proposalDetailResponse.resultType === 'SUCCESS'
    ) {
      const response = proposalDetailResponse as unknown as {
        resultType: string;
        success: ReformProposalDetail | null;
        error: { code: string; message: string } | null;
      };
      if (response.success && 'price' in response.success) {
        return response.success;
      }
    }

    if ('price' in proposalDetailResponse) {
      return proposalDetailResponse as ReformProposalDetail;
    }

    return null;
  }, [proposalDetailResponse]);

  const myUserId = React.useMemo(() => {
    if (!roomInfo) return undefined;
    return myRole === 'REFORMER' ? roomInfo.owner.id : roomInfo.requester.id;
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
  }, [
    roomInfo?.ownerLastReadId,
    roomInfo?.requesterLastReadId,
    roomInfo?.owner.id,
    myUserId,
    roomInfo,
  ]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const tempMessage: ChatMessage = {
      messageId: `temp-${Date.now()}`,
      senderType: myRole === 'REFORMER' ? 'OWNER' : 'USER',
      senderId: myUserId!,
      messageType: 'image',
      textContent: null, // 필수
      payload: { urls: imageUrls },
      createdAt: new Date().toISOString(),
    };

    // 1️⃣ 채팅 메시지 낙관적 업데이트
    queryClient.setQueryData<InfiniteData<ChatMessagesPage>>(
      ['chatMessages', chatId],
      (oldData) => {
        if (!oldData) return oldData;

        const lastPageIndex = oldData.pages.length - 1;
        const updatedPages = [...oldData.pages];
        updatedPages[lastPageIndex] = {
          ...updatedPages[lastPageIndex],
          messages: [...updatedPages[lastPageIndex].messages, tempMessage],
        };

        return { ...oldData, pages: updatedPages };
      }
    );

    // 2️⃣ 채팅방 리스트 낙관적 업데이트
    type ChatRoomsQuery = { data: ChatRoomInfo[] };
    [undefined, 'INQUIRY', 'ORDER', 'UNREAD'].forEach((filterType) => {
      queryClient.setQueryData<ChatRoomsQuery>(
        ['chatRooms', filterType],
        (oldData) => {
          if (!oldData?.data) return oldData;

          const updatedData = oldData.data.map((room) =>
            room.chatRoomId === chatId
              ? {
                  ...room, // 기존 필드 유지
                  lastMessage: inputText,
                  lastMessageAt: tempMessage.createdAt,
                }
              : room
          );

          const targetRoom = updatedData.find(
            (room) => room.chatRoomId === chatId
          );
          if (!targetRoom) return oldData;

          const sortedData = [
            targetRoom,
            ...updatedData.filter((room) => room.chatRoomId !== chatId),
          ];

          return { ...oldData, data: sortedData };
        }
      );
    });

    // 3️⃣ 서버 전송
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
      isFetchingOld.current = true; // 과거 메시지 로딩 시작
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

        // ✅ 채팅방 목록 낙관적 업데이트
        queryClient.setQueryData<{ data: ChatRoomInfo[] }>(
          ['chatRooms', undefined],
          (oldData) => {
            if (!oldData?.data) return oldData;

            const updatedData = oldData.data.map((room) =>
              room.chatRoomId === chatId ? { ...room, unreadCount: 0 } : room
            );

            return { ...oldData, data: updatedData };
          }
        );
      }
    };

    const handleReadStatus = (data: {
      chatRoomId: string;
      readerId: string;
      lastReadMessageId: string;
    }) => {
      if (data.chatRoomId !== chatId) return;

      queryClient.setQueryData<InfiniteData<ChatMessagesPage>>(
        ['chatMessages', chatId],
        (oldData) => {
          if (!oldData) return oldData;

          const updatedPages = oldData.pages.map((page, idx) => {
            if (idx !== 0) return page;

            const owner = page.chatRoomInfo!.owner; // 절대 undefined 아님
            const requester = page.chatRoomInfo!.requester;

            const isReaderOwner = owner.id === data.readerId;

            return {
              ...page,
              chatRoomInfo: {
                ...page.chatRoomInfo!,
                ownerLastReadId: isReaderOwner
                  ? data.lastReadMessageId
                  : page.chatRoomInfo!.ownerLastReadId,
                requesterLastReadId: !isReaderOwner
                  ? data.lastReadMessageId
                  : page.chatRoomInfo!.requesterLastReadId,
                owner,
                requester,
                type: page.chatRoomInfo!.type,
                targetPayload: page.chatRoomInfo!.targetPayload ?? null,
              },
            };
          });

          return { ...oldData, pages: updatedPages };
        }
      );
    };

    const handleNewMessage = (msg: ChatMessage) => {
      const isCurrentRoom = true;

      // 1️⃣ 현재 채팅방 메시지 추가
      if (isCurrentRoom) {
        queryClient.setQueryData<InfiniteData<ChatMessagesPage>>(
          ['chatMessages', chatId],
          (oldData) => {
            if (!oldData) return oldData;

            const lastPageIndex = oldData.pages.length - 1;
            const updatedPages = [...oldData.pages];

            updatedPages[lastPageIndex] = {
              ...updatedPages[lastPageIndex],
              messages: [...updatedPages[lastPageIndex].messages, msg],
            };

            const isReaderOwner =
              oldData.pages[0].chatRoomInfo?.owner.id === myUserId;

            updatedPages[0] = {
              ...updatedPages[0],
              chatRoomInfo: {
                ...updatedPages[0].chatRoomInfo!,
                ownerLastReadId: isReaderOwner
                  ? msg.messageId
                  : updatedPages[0].chatRoomInfo!.ownerLastReadId,
                requesterLastReadId: !isReaderOwner
                  ? msg.messageId
                  : updatedPages[0].chatRoomInfo!.requesterLastReadId,
                // owner / requester / type / targetPayload는 그대로 유지
                owner: updatedPages[0].chatRoomInfo!.owner,
                requester: updatedPages[0].chatRoomInfo!.requester,
                type: updatedPages[0].chatRoomInfo!.type,
                targetPayload:
                  updatedPages[0].chatRoomInfo!.targetPayload ?? null,
              },
            };
            return { ...oldData, pages: updatedPages };
          }
        );

        socket?.emit('readChatRoom', { roomId: chatId });
      }

      // 2️⃣ 모든 채팅방 목록 업데이트
      const lastMessageText = getLastMessageText(msg);

      [undefined, 'INQUIRY', 'ORDER', 'UNREAD'].forEach((filterType) => {
        queryClient.setQueryData<{ data: ChatRoomWithUnread[] }>(
          ['chatRooms', filterType],
          (oldData) => {
            if (!oldData?.data) return oldData;

            const updatedData = oldData.data.map((room) => {
              if (room.chatRoomId !== chatId) return room;

              const newUnreadCount = isCurrentRoom
                ? 0
                : (room.unreadCount ?? 0) + 1;

              return {
                ...room,
                lastMessage: lastMessageText,
                lastMessageAt: msg.createdAt,
                unreadCount: newUnreadCount,
              };
            });

            const targetRoom = updatedData.find(
              (room) => room.chatRoomId === chatId
            );
            if (!targetRoom) return { ...oldData, data: updatedData };

            const sortedData = [
              targetRoom,
              ...updatedData.filter((r) => r.chatRoomId !== chatId),
            ];

            return { ...oldData, data: sortedData };
          }
        );
      });
    };

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
  }, [accessToken, chatId, queryClient, myUserId]);

  /* =========================
   * 4. 핸들러 함수
   * ========================= */
  const handleSend = () => {
    if (!inputText.trim() || !myUserId) return;

    const socket = getSocket();
    if (!socket || !socket.connected) {
      console.error('소켓이 연결되지 않음');
      return;
    }

    const tempMessage: ChatMessage & { isRead: boolean } = {
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
    queryClient.setQueryData<InfiniteData<ChatMessagesPage>>(
      ['chatMessages', chatId],
      (oldData) => {
        if (!oldData) return oldData;

        const lastPageIndex = oldData.pages.length - 1;
        const updatedPages = [...oldData.pages];
        updatedPages[lastPageIndex] = {
          ...updatedPages[lastPageIndex],
          messages: [...updatedPages[lastPageIndex].messages, tempMessage],
        };

        return { ...oldData, pages: updatedPages };
      }
    );

    // 2️⃣ 모든 채팅 탭 UI 낙관적 업데이트
    [undefined, 'INQUIRY', 'ORDER', 'UNREAD'].forEach((filterType) => {
      queryClient.setQueryData<{ data: ChatRoomWithUnread[] }>(
        ['chatRooms', filterType],
        (oldData) => {
          if (!oldData?.data) return oldData;

          const updatedData = oldData.data.map((room) =>
            room.chatRoomId === chatId
              ? {
                  ...room,
                  lastMessage: inputText,
                  lastMessageAt: tempMessage.createdAt,
                }
              : room
          );

          // 메시지가 온 채팅방 맨 위로
          const targetRoom = updatedData.find(
            (room) => room.chatRoomId === chatId
          );
          if (!targetRoom) return oldData;

          const sortedData = [
            targetRoom,
            ...updatedData.filter((room) => room.chatRoomId !== chatId),
          ];

          return { ...oldData, data: sortedData };
        }
      );
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
    if (!myUserId) return;

    const socket = getSocket();
    if (!socket || !socket.connected) return;

    const tempMessage: ChatMessage & { isRead: boolean } = {
      messageId: `temp-${Date.now()}`,
      senderType: myRole === 'REFORMER' ? 'OWNER' : 'USER',
      senderId: myUserId,
      messageType: 'payment',
      textContent: null,
      payload: {
        price: paymentData.price,
        delivery: paymentData.delivery,
        expectedWorking: paymentData.expectedWorking,
        orderId: '', // 임시 값
        receiptNumber: '', // 임시 값
      } as PaymentPayload,
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // 1️⃣ 낙관적 UI
    queryClient.setQueryData<InfiniteData<ChatMessagesPage>>(
      ['chatMessages', chatId],
      (oldData) => {
        if (!oldData) return oldData;
        const lastPageIndex = oldData.pages.length - 1;
        const updatedPages = [...oldData.pages];
        updatedPages[lastPageIndex] = {
          ...updatedPages[lastPageIndex],
          messages: [...updatedPages[lastPageIndex].messages, tempMessage],
        };
        return { ...oldData, pages: updatedPages };
      }
    );

    // 2️⃣ 채팅 탭 UI
    queryClient.setQueryData<{ data: ChatRoomWithUnread[] }>(
      ['chatRooms', undefined],
      (oldData) => {
        if (!oldData?.data) return oldData;

        const updatedData = oldData.data.map((room) =>
          room.chatRoomId === chatId
            ? {
                ...room,
                lastMessage: '결제 요청',
                lastMessageAt: tempMessage.createdAt,
              }
            : room
        );

        const targetRoom = updatedData.find(
          (room) => room.chatRoomId === chatId
        )!;
        const sortedData = [
          targetRoom,
          ...updatedData.filter((r) => r.chatRoomId !== chatId),
        ];

        return { ...oldData, data: sortedData };
      }
    );

    // 서버 전송
    socket.emit('sendMessage', {
      roomId: chatId,
      contentType: 'payment',
      content: paymentData,
    });

    // 모달 닫기
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

  const handleAnswerEstimate = (messageId: string, isAccepted: boolean) => {
    const socket = getSocket();
    if (!socket || !socket.connected || !myUserId) return;

    const tempMessage: ChatMessage & { isRead: boolean } = {
      messageId: `temp-${isAccepted ? 'accept' : 'reject'}-${Date.now()}`,
      senderType: myRole === 'REFORMER' ? 'OWNER' : 'USER',
      senderId: myUserId!,
      messageType: 'accept',
      textContent: null,
      payload: { isAccepted },
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    // 메시지 UI 업데이트
    queryClient.setQueryData<InfiniteData<ChatMessagesPage>>(
      ['chatMessages', chatId],
      (oldData) => {
        if (!oldData) return oldData;

        const lastPageIndex = oldData.pages.length - 1;
        const updatedPages = [...oldData.pages];
        updatedPages[lastPageIndex] = {
          ...updatedPages[lastPageIndex],
          messages: [...updatedPages[lastPageIndex].messages, tempMessage],
        };
        return { ...oldData, pages: updatedPages };
      }
    );

    // 채팅 리스트 탭 UI
    queryClient.setQueryData<{ data: ChatRoomWithUnread[] }>(
      ['chatRooms', undefined],
      (oldData) => {
        if (!oldData?.data) return oldData;

        const updatedData = oldData.data.map((room) =>
          room.chatRoomId === chatId
            ? {
                ...room,
                lastMessage: '(거래 진행 여부)',
                lastMessageAt: tempMessage.createdAt,
              }
            : room
        );

        const targetRoom = updatedData.find((r) => r.chatRoomId === chatId)!;
        const sortedData = [
          targetRoom,
          ...updatedData.filter((r) => r.chatRoomId !== chatId),
        ];

        return { ...oldData, data: sortedData };
      }
    );

    // 서버 전송
    socket.emit('sendMessage', {
      roomId: chatId,
      contentType: 'accept',
      content: { messageId, isAccepted },
    });
  };

  useEffect(() => {
    const handlePaymentCompleted = (e: CustomEvent) => {
      const { chatRoomId } = e.detail;
      if (chatRoomId === chatId) {
        console.log(
          'payment event received in chatRoom.tsx',
          chatRoomId,
          e.detail
        );

        // 무한 스크롤 쿼리 전체 새로고침
        queryClient.setQueryData(['chatMessages', chatId], (oldData: any) => {
          // 필요하다면 초기화하거나 새로 가져오기
          return oldData; // 그냥 새로고침만 하려면 refetchQueries 사용
        });

        queryClient.refetchQueries({
          predicate: (query) =>
            query.queryKey[0] === 'chatMessages' &&
            query.queryKey[1] === chatId,
        });
      }
    };

    window.addEventListener(
      'payment-completed',
      handlePaymentCompleted as EventListener
    );

    return () => {
      window.removeEventListener(
        'payment-completed',
        handlePaymentCompleted as EventListener
      );
    };
  }, [chatId, queryClient]);

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
                {(roomInfo.targetPayload?.minBudget ?? 0).toLocaleString()}원 ~{' '}
                {(roomInfo.targetPayload?.maxBudget ?? 0).toLocaleString()}원
              </p>
            ) : (
              <p className="text-[14px] font-bold text-black">
                {(() => {
                  // 제안서 상세에서 금액 가져오기
                  if (proposalDetail?.price) {
                    return proposalDetail.price.toLocaleString('ko-KR') + '원';
                  }
                  // 제안서 상세가 없으면 메시지에서 찾기
                  const proposals = messages.filter(
                    (msg) => msg.messageType === 'proposal'
                  );
                  const lastProposal = proposals[proposals.length - 1];
                  if (lastProposal?.payload?.price) {
                    return (
                      lastProposal.payload.price.toLocaleString('ko-KR') + '원'
                    );
                  }
                  return '0원';
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
          <div className="text-center text-xs text-gray-400">
            이전 메시지 불러오는 중...
          </div>
        )}

        {messages.map((msg, idx) => {
          const msgDate = new Date(msg.createdAt);
          const msgDateString = msgDate.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });

          const prevMsg = messages[idx - 1];
          const prevDateString = prevMsg
            ? new Date(prevMsg.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
            : null;

          const showDate = msgDateString !== prevDateString;

          const isMine = myUserId ? msg.senderId === myUserId : false;
          const isRead =
            (isMine &&
              opponentLastReadId &&
              msg.messageId <= opponentLastReadId) ||
            (!isMine && myLastReadId && msg.messageId <= myLastReadId);

          return (
            <React.Fragment key={msg.messageId}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="bg-[var(--color-gray-30)] text-[var(--color-gray-60)] px-4 py-1 rounded-full text-[12px]">
                    {msgDate.toLocaleDateString('ko-KR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              <div
                className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 mb-4`}
              >
                {!isMine && (
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <img
                      src={
                        roomInfo?.owner.id === msg.senderId
                          ? roomInfo.owner.profileImage || ''
                          : roomInfo?.requester.profileImage || ''
                      }
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={`flex ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-1.5`}
                >
                  <div className="flex flex-col">
                    {msg.messageType === 'request' && (
                      <RequireCard
                        type={isMine ? 'sent' : 'received'}
                        minBudget={msg.payload.minBudget}
                        maxBudget={msg.payload.maxBudget}
                        title={msg.payload.title}
                        requestId={msg.payload.id}
                        nickname={
                          isMine
                            ? (roomInfo?.requester.nickname ?? '알 수 없음')
                            : (roomInfo?.owner.nickname ?? '알 수 없음')
                        }
                      />
                    )}
                    {msg.messageType === 'payment' && (
                      <PaymentCard
                        role={myRole}
                        type={isMine ? 'sent' : 'received'}
                        nickname={
                          isMine
                            ? (roomInfo?.requester.nickname ?? '사용자')
                            : (roomInfo?.owner.nickname ?? '리포머')
                        }
                        chatRoomId={chatId} // ✅ 추가
                        payload={{
                          ...msg.payload,
                          chatRoomId: chatId, // payload 안에도 있어도 됨
                        }}
                      />
                    )}

                    {msg.messageType === 'result' && msg.payload && (
                      <PayFinishCard
                        type={isMine ? 'sent' : 'received'}
                        payload={msg.payload as PaymentResult}
                      />
                    )}

                    {msg.messageType === 'proposal' && (
                      <QuotationCard
                        id={msg.payload.id}
                        type={isMine ? 'sent' : 'received'}
                        price={msg.payload.price}
                        delivery={msg.payload.delivery}
                        nickname={
                          isMine
                            ? (roomInfo?.requester.nickname ?? '사용자')
                            : (roomInfo?.owner.nickname ?? '리포머')
                        }
                        expectedWorking={msg.payload.expectedWorking}
                      />
                    )}

                    {msg.messageType === 'accept' &&
                      (msg.payload?.isAccepted === false ? (
                        <div
                          className={`p-3 rounded-[0.625rem] max-w-[400px] ${
                            isMine
                              ? 'bg-[#FFF7DD] text-[#725A11] rounded-tr-none'
                              : 'bg-[#FFF7DD] text-[#725A11] rounded-tl-none'
                          }`}
                        >
                          <p className="text-[1rem] leading-relaxed whitespace-pre-wrap">
                            {myRole === 'REFORMER'
                              ? `📢 ${roomInfo?.requester.nickname ?? '사용자'}님이 제안을 거절하였습니다.`
                              : `📢 ${roomInfo?.owner.nickname ?? '리포머'}님의 제안을 거절하였습니다.`}
                          </p>
                        </div>
                      ) : msg.payload?.isAccepted === true ? (
                        <div
                          className={`p-3 rounded-[0.625rem] max-w-[400px] ${
                            isMine
                              ? 'bg-[#FFF7DD] text-[#725A11] rounded-tr-none'
                              : 'bg-[#FFF7DD] text-[#725A11] rounded-tl-none'
                          }`}
                        >
                          <p className="text-[1rem] leading-relaxed whitespace-pre-wrap">
                            {myRole === 'REFORMER'
                              ? `📢 ${roomInfo?.requester.nickname ?? '사용자'}님이 제안을 수락하였습니다.`
                              : `📢 ${roomInfo?.owner.nickname ?? '리포머'}님의 제안을 수락하였습니다.`}
                          </p>
                        </div>
                      ) : // payload가 없으면 OWNER 입장에서는 그냥 메시지
                      myRole === 'REFORMER' ? (
                        <div className="p-3 rounded-[0.625rem] max-w-[400px] bg-[#FFF7DD] text-[#725A11] rounded-tr-none">
                          <p className="text-[1rem] leading-relaxed whitespace-pre-wrap">
                            📢 거래 진행여부를 전송했습니다.
                          </p>
                        </div>
                      ) : (
                        // USER 입장에서는 카드 그대로 보여주기
                        <EstimateArriveCard
                          type={isMine ? 'sent' : 'received'}
                          onReject={() =>
                            handleAnswerEstimate(msg.messageId, false)
                          }
                          onAccept={() =>
                            handleAnswerEstimate(msg.messageId, true)
                          }
                        />
                      ))}

                    {(msg.messageType === 'text' ||
                      msg.messageType === 'image') && (
                      <div
                        className={`p-3 rounded-[0.625rem] max-w-[400px] ${
                          isMine
                            ? 'bg-[var(--color-mint-5)] text-black rounded-tr-none'
                            : 'bg-[var(--color-gray-20)] text-black rounded-tl-none'
                        }`}
                      >
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
                    className={`flex flex-col justify-end body-b5-rg text-[var(--color-gray-50)] min-w-max ${
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
                  {roomType !== 'PROPOSAL' && (
                    <button
                      onClick={handleSendAction}
                      className="px-3 py-1 border border-[var(--color-gray-50)] rounded-full body-b5-rg text-[var(--color-gray-50)]"
                    >
                      견적서 보내기
                    </button>
                  )}
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="px-3 py-1 border border-[var(--color-gray-50)] rounded-full body-b5-rg text-[var(--color-gray-50)]"
                  >
                    결제창 보내기
                  </button>
                </>
              )}
              {myRole === 'USER' && roomType === 'PROPOSAL' && (
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
