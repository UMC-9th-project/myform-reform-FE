import React from 'react';
import { useChatStore } from '../../stores/chatStore';

const SendQuotationPage = () => {
  const sendMessage = useChatStore((state) => state.sendMessage);

  const handleSendQuotation = () => {
    sendMessage({
      id: Date.now(),
      type: 'quotation',      // 견적서 타입
      senderRole: 'REFORMER', // 리폼러가 보낸걸로
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    });
    alert('견적서를 전송했습니다! ✅');
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">견적서 전송 테스트</h1>
      <button
        onClick={handleSendQuotation}
        className="px-6 py-3 bg-[var(--color-mint-1)] text-white rounded-lg hover:bg-[var(--color-mint-2)]"
      >
        견적서 보내기
      </button>
    </div>
  );
};

export default SendQuotationPage;
