/* =========================
 * Room / SelectedChat
 * ========================= */

export type RoomType = 'FEED' | 'PROPOSAL' | 'REQUEST';

export interface SelectedChat {
  chatRoomId: string;
  roomType: RoomType;
}

/* =========================
 * Message Payloads
 * ========================= */

export interface ImagePayload {
  urls: string[];
}

export interface RequestPayload {
  id: string;
  title: string;
  minBudget: number;
  maxBudget: number;
}

export interface ProposalPayload {
  id: string;
  price: number;
  delivery: number;
  expected_working: number;
}

/* =========================
 * Message Types
 * ========================= */

export type MessageType =
  | 'text'
  | 'image'
  | 'request'
  | 'proposal';

/* =========================
 * Chat Message (Discriminated Union)
 * ========================= */

export type ChatMessage =
  | {
      messageId: string;
      senderId: string;
      senderType: 'USER' | 'OWNER';
      messageType: 'text';
      textContent: string;
      payload: null;
      createdAt: string;
    }
  | {
      messageId: string;
      senderId: string;
      senderType: 'USER' | 'OWNER';
      messageType: 'image';
      textContent: null;
      payload: ImagePayload;
      createdAt: string;
    }
  | {
      messageId: string;
      senderId: string;
      senderType: 'USER' | 'OWNER';
      messageType: 'request';
      textContent: null;
      payload: RequestPayload;
      createdAt: string;
    }
  | {
      messageId: string;
      senderId: string;
      senderType: 'USER' | 'OWNER';
      messageType: 'proposal';
      textContent: null;
      payload: ProposalPayload;
      createdAt: string;
    };

/* =========================
 * ChatRoom Info (상단 정보)
 * ========================= */

export interface ChatRoomInfo {
  chatRoomId: string;
  type: RoomType;
  targetPayload: {
    id: string;
    title: string;
    minBudget: number;
    maxBudget: number;
    image: string;
  };
  owner: {
    id: string;
    nickname: string;
    profileImage: string | null;
  };
  requester: {
    id: string;
    nickname: string;
    profileImage: string | null;
  };
}

/* =========================
 * API Response
 * ========================= */

export interface ChatMessagesResponse {
  resultType: 'SUCCESS' | 'FAIL';
  error: { reason: string } | null;
  success: {
    data: ChatMessage[];
    meta: {
      nextCursor: string | null;
      hasMore: boolean;
    };
    chatRoomInfo?: ChatRoomInfo;
  };
}
