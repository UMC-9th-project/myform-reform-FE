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
      return '(거래 진행 여부)';
    case 'result':
      return '(결제 완료)';
    default:
      return '대화가 없습니다';
  }
};
