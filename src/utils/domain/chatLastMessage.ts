// utils/chatUtils.ts
import type { ChatMessage } from '@/types/api/chat/chatMessages';

export const getLastMessageText = (msg: ChatMessage) => {
  switch (msg.messageType) {
    case 'text':
      return msg.textContent?.trim() || '대화가 없습니다';
    case 'image':
      return '(사진)';
    case 'request':
      return '(요청서)';
    case 'payment':
      return '(결제 요청)';
    case 'proposal':
      return '(견적서)';
    case 'accept':
      // payload에 isAccepted가 있으면 수락/거절 표시
      if (msg.payload?.isAccepted === true) return '문의 진행 중';
      if (msg.payload?.isAccepted === false) return '제안 거절됨';
      // 없으면 기본 표시
      return '거래 진행 여부';
    case 'result':
      return '(결제 완료)';
    default:
      return '대화가 없습니다';
  }
};
