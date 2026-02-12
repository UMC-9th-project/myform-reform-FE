// api/chat.ts
import { api } from '../axios';
import type { ChatMessage, ChatRoomInfo, ChatMessagesResponse } from '@/types/api/chat/chatMessages';
export type ChatRoomType = 'INQUIRY' | 'ORDER';
export type ChatRoomFilter = ChatRoomType | 'UNREAD';

export interface ChatRoom {
  chatRoomId: string;
  image: string;
  title: string;
  roomType: string;
  messageType: string;
  type: ChatRoomType;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatRoomsResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: { reason: string } | null;
  success: {
    data: ChatRoom[];
    meta: {
      nextCursor: string | null;
      hasMore: boolean;
    };
  } | null;
}

interface ChatRoomsParams {
  type?: ChatRoomFilter;
  cursor?: string;
  limit?: number;
}

export const getChatRooms = async (params?: ChatRoomsParams) => {
  const { data } = await api.get<ChatRoomsResponse>('/chat/rooms/list', { params });
  if (data.resultType !== 'SUCCESS' || !data.success) {
    throw new Error(data.error?.reason || '채팅방 조회 실패');
  }
  return data.success;
};

interface GetChatMessagesParams {
  cursor?: string;
  limit?: number;
}

/* =========================
 * 메시지 목록 조회 (무한 스크롤)
 * ========================= */

export interface GetChatMessagesResult {
  messages: ChatMessage[];
  chatRoomInfo?: ChatRoomInfo;
  nextCursor: string | null;
  hasMore: boolean;
}

export const getChatMessages = async (
  roomId: string,
  params?: GetChatMessagesParams
): Promise<GetChatMessagesResult> => {
  const { data } = await api.get<ChatMessagesResponse>(
    `/chat/rooms/${roomId}/messages`,
    { params }
  );

  if (data.resultType !== 'SUCCESS') {
    throw new Error(data.error?.reason ?? '채팅 메시지 조회 실패');
  }

  const { success } = data;

  return {
    messages: success.data,
    chatRoomInfo: success.chatRoomInfo,
    nextCursor: success.meta.nextCursor,
    hasMore: success.meta.hasMore,
  };
};
