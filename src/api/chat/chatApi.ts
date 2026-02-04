// api/chat.ts
import { api } from '../axios';

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
