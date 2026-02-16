/* =========================
 * Room / SelectedChat
 * ========================= */
export type ChatRoomWithUnread = ChatRoomInfo & { unreadCount?: number };
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
  expectedWorking: number;
}

export interface PaymentPayload {
  price: number;
  orderId: string;
  delivery: number;
  receiptNumber: string;
  expectedWorking: number;
  chatRoomId: string;
}

export interface PaymentResult {
  receiptNumber: string;
  totalAmount: number;
  currency: string;
  paymentMethod: {
    type: string;
    provider: string | null;
    cardNumber: string | null;
  };
  approvedAt: string | null;
}

export interface AcceptPayload {
  isAccepted: boolean | null;
}

/* =========================
 * Message Types
 * ========================= */

export type MessageType =
  | 'text'
  | 'image'
  | 'request'
  | 'proposal'
  | 'payment'
  | 'result'
  | 'accept';

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
    }
  | {
      messageId: string;
      senderId: string;
      senderType: 'USER' | 'OWNER';
      messageType: 'payment';
      textContent: null;
      payload: PaymentPayload;
      createdAt: string;
    }
  | {
      messageId: string;
      senderId: string;
      senderType: 'USER' | 'OWNER';
      messageType: 'result';
      textContent: null;
      payload: PaymentResult;
      createdAt: string;
    }
  | {
      messageId: string;
      senderId: string;
      senderType: 'USER' | 'OWNER';
      messageType: 'accept';
      textContent: null;
      payload: AcceptPayload;
      createdAt: string;
    };

/* =========================
 * ChatRoom Info (상단 정보)
 * ========================= */

export interface RequestTargetPayload {
  id: string;
  title: string;
  minBudget: number | null;
  maxBudget: number | null;
  image: string;
}

export interface ChatRoomInfo {
  chatRoomId: string;
  type: RoomType;

  lastMessageId: string;
  ownerLastReadId: string | null;
  requesterLastReadId: string | null;

  targetPayload: RequestTargetPayload | null;

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

export interface ChatMessagesPage {
  messages: ChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
  chatRoomInfo?: {
    owner: { id: string; nickname: string; profileImage: string | null };
    requester: { id: string; nickname: string; profileImage: string | null };
    ownerLastReadId: string | null;
    requesterLastReadId: string | null;
    type: RoomType;
    targetPayload?: {
      id: string;
      title: string;
      image?: string;
      minBudget?: number;
      maxBudget?: number;
    } | null;
  };
}

// 메시지 페이지 캐시
export interface ChatMessagesQuery {
  pages: ChatMessagesPage[];
}

// 채팅방 리스트 캐시
export interface ChatRoomsQuery {
  data: ChatRoomWithUnread[];
}
