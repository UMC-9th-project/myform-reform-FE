import React, { useState, useEffect, useRef } from 'react';
import Gallery from '../../../assets/chat/Gallery.svg'
import QuotationCard from './QuotationCard';
import PaymentCard from './PaymentCard';
import PaymentModal, { type PaymentRequestData } from './PaymentModal';
import { useChatStore, type Message } from '../../../stores/chatStore';
import RequireCard from './RequireCard';
import PayFinishCard from './PayFinishCard';
import EstimateArrivalCard from './EstimateArriveCard';
import { useNavigate } from 'react-router-dom';

interface ChatRoomProps {
  chatId: number;
  myRole: 'REFORMER' | 'USER';
}

// mock 데이터
const mockMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: "1번 채팅방 첫 메시지입니다.", senderRole: 'USER', time: '오후 08:30', type: 'text', isRead: false },
    { id: 2, text: "1번 채팅방 두 번째 메시지입니다.", senderRole: 'REFORMER', time: '오후 08:35', type: 'text', isRead: true },
  ],
  2: [
    { id: 3, text: "2번 채팅방 첫 메시지입니다.", senderRole: 'USER', time: '오후 09:00', type:'text', isRead: false },
    { id: 4, text: "2번 채팅방 두 번째 메시지입니다.", senderRole: 'REFORMER', time: '오후 09:05', type: 'text', isRead: false },
  ],
  3: [
    { id: 5, type: 'quotation', senderRole: 'REFORMER', time: '오후 10:00', isRead: false },
    {
      id: 6,
      type: 'estimateArrival',
      senderRole: 'REFORMER',
      time: '오후 10:01',
      isRead: true,
    },
    {
      id: 7,
      type: 'payFinish',
      senderRole: 'USER',
      time: '오후 10:12',
      isRead: true,

      price: 46500,
      orderNumber: 'ORD-20260122-0001',
      paymentMethod: '카드 간편결제',
      paymentDetail: '신한은행 / 0000-****-****-0000',
      date: '2026.01.22 10:12',
      receiverName: '김가인',
      phone: '010-1234-5678',
      address: '서울시 마포구 어딘가로 123',
    },
  ],
  4: [
    {
      id: 8,
      type: 'require',
      price: 7500,
      senderRole:'USER',
      time: '오후 3시 20분'
    }
  ],

};

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId, myRole }) => {
  
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const messages = useChatStore((state) => state.messages);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const resetMessages = useChatStore((state) => state.resetMessages);

  const MAX_IMAGES = 5;
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const navigate = useNavigate();



  // 스크롤 아래로
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // chatId 바뀔 때 초기 메시지 세팅
  useEffect(() => {
    resetMessages();
    const initialMessages = mockMessages[chatId] || [];
    initialMessages.forEach((msg) => sendMessage(msg));
  }, [chatId, resetMessages, sendMessage]);

  // 결제 메시지 전송
  const handlePaymentSend = (data: PaymentRequestData) => {
    sendMessage({
      id: Date.now(),
      type: 'payment',
      price: data.price,
      delivery: data.delivery,
      days: data.days,
      senderRole: myRole,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true }),
      isRead: false,
    });
    setIsPaymentModalOpen(false);
  };

  //견적서 거절
  const handleRejectEstimate = () => {
    sendMessage({
      id: Date.now(),
      type: 'system',
      systemType: 'quotationRejected',
      senderRole: myRole,
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      isRead: false,
    });
  };


  // 이미지 업로드
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (files.length > MAX_IMAGES) {
      alert(`사진은 최대 ${MAX_IMAGES}개까지 보낼 수 있어요.`);
      e.target.value = '';
      return;
    }

    const imageUrls: string[] = [];
    let loadedCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageUrls.push(reader.result as string);
        loadedCount++;
        if (loadedCount === files.length) {
          sendMessage({
            id: Date.now(),
            type: 'image',
            imageUrls,
            senderRole: myRole,
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true }),
            isRead: false,
          });
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleImageClick = () => fileInputRef.current?.click();

  // 텍스트 메시지 전송
  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage({
      id: Date.now(),
      type: 'text',
      text: message.trim(),
      senderRole: myRole,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true }),
      isRead: false,
    });
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

    // 견적서/요청서 이동만
  const handleSendQuotationOrRequire = () => {
    if (myRole === 'REFORMER') {
      navigate('/chat/create/quotation', { state: { chatId } });
    } else {
      navigate('/chat/create/request', { state: { chatId } });
    }
  };


  return (
    <div className="flex flex-col w-full h-full mx-auto h-[800px] border border-[var(--color-line-gray-40)] bg-white overflow-hidden">
      {/* 결제 모달 */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        onSend={handlePaymentSend} 
      />

      {/* 상단 상품 정보 */}
      <div className="flex items-center p-4 border-b border-[var(--color-line-gray-40)]">
        <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden mr-3 flex items-center justify-center text-[10px] text-white">
          IMAGE
        </div>
        <div>
          <h2 className="text-[14px] font-medium text-black">짐색 리폼 요청합니다.</h2>
          <p className="text-[14px] font-bold text-black">30,000~50,000원</p>
        </div>
      </div>

      {/* 채팅 내역 */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-white p-4 space-y-6"
      >
        
        <div className="flex justify-center">
          <span className="bg-[var(--color-gray-30)] text-[var(--color-gray-60)] body-b3-rg px-4 py-1 rounded-full">
            2025년 12월 3일 수요일
          </span>
        </div>
        
        {messages.map((msg) => {

          if (msg.type === 'system' && msg.systemType === 'quotationRejected') {
            return (
              <div key={msg.id} className="my-6 flex justify-center">
                <span className="body-b3-rg text-[var(--color-gray-50)] border-b border-[var(--color-gray-50)] pb-0">
                  제안이 거절되었습니다
                </span>
              </div>
            );
          }


          return (
          <div
            key={msg.id}
            className={`flex ${msg.senderRole === myRole ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}
          >
            {/* 상대방 프로필 */}
            {msg.senderRole !== myRole && (
              <div className="w-12 h-12 rounded-full border border-[var(--color-line-gray-40)] bg-[var(--color-gray-20)] overflow-hidden flex-shrink-0">
                <img src="https://via.placeholder.com/40" alt="profile" className="w-full h-full object-cover" />
              </div>
            )}

            {/* 메시지 + 시간 */}
            <div className={`flex ${msg.senderRole === myRole ? 'flex-row-reverse' : 'flex-row'} items-end gap-1.5`}>
              
              {/* 견적서와 결제창은 말풍선 디자인이 다르므로 별도 처리 */}
              {msg.type === 'require' ? (
                <RequireCard
                  key={msg.id}
                  type={msg.senderRole === myRole ? 'sent' : 'received'}
                  price={50000}       // 예: 실제 데이터로 바꾸면 됨
                  title="제 유니폼 원숄더 원피스로 가방 짐색 리폼 요청드립니다 제발요"
                />
              ) :
                msg.type === 'quotation' ? (
                <QuotationCard type={msg.senderRole === myRole ? 'sent' : 'received'} id={msg.id} chatId={chatId} myRole={myRole} key={msg.id} />
              ) : msg.type === 'payment' ? (
                <PaymentCard 
                  price={msg.price!} 
                  delivery={msg.delivery!} 
                  days={msg.days!}
                  nickname= "심심한 리본" 
                  type={msg.senderRole === myRole ? 'sent' : 'received'}
                />
              ) : msg.type === 'payFinish' ? (
                <PayFinishCard
                  type={msg.senderRole === myRole ? 'sent' : 'received'}
                  price={msg.price!}
                  orderNumber={msg.orderNumber!}
                  paymentMethod={msg.paymentMethod!}
                  paymentDetail={msg.paymentDetail!}
                  date={msg.date!}
                  receiverName={msg.receiverName!}
                  phone={msg.phone!}
                  address={msg.address!}
                />
              ) : msg.type === 'estimateArrival' ? (
                  <EstimateArrivalCard
                    type={msg.senderRole === myRole ? 'sent' : 'received'}
                    onReject={handleRejectEstimate} />
              ) : (
                /* 텍스트와 이미지는 동일한 말풍선 배경(Mint/Gray)을 사용하도록 통합 */
                <div className={`p-2 rounded-[0.625rem] max-w-[40rem] ${
                    msg.senderRole === myRole
                      ? 'bg-[var(--color-mint-5)] text-black rounded-tr-none'
                      : 'bg-[var(--color-gray-20)] text-black rounded-tl-none'
                  }`}>
                  
                  {/* 텍스트 렌더링 */}
                  {msg.type === 'text' && (
                    <div className="p-1 text-[1rem] leading-relaxed">
                      {msg.text}
                    </div>
                  )}

                  {/* 이미지 렌더링 (말풍선 안으로 들어옴) */}
                  {msg.type === 'image' && msg.imageUrls && (
                    <div className={`grid gap-1.5 ${
                        msg.imageUrls.length === 1
                          ? 'grid-cols-1 w-[240px]'
                          : msg.imageUrls.length === 2
                          ? 'grid-cols-2 w-[320px]'
                          : 'grid-cols-3 w-[360px]'
                      }`}>
                      {msg.imageUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square w-full overflow-hidden border border-[var(--color-line-gray-40)] rounded-md">
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

              {/* 시간 표시 영역 */}
              <div className={`flex flex-col justify-end body-b5-rg text-[var(--color-gray-50)] min-w-max pb-0.5 ${
                msg.senderRole === myRole ? 'items-end' : 'items-start'
              }`}>
                {msg.isRead && <span className="mb-0.5">읽음</span>}
                <span>{msg.time}</span>
              </div>
            </div>
          </div>
        )})}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="p-4 border-t border-[var(--color-line-gray-40)]">
        <input 
          title="사진 입력"
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*"
          multiple 
          className="hidden" 
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="메세지를 입력하세요."
          className="w-full h-10 resize-none outline-none body-b1-rg placeholder-[var(--color-gray-50)]"
        />

        <div className="flex justify-between items-center mt-2">
        {/* 왼쪽 버튼 그룹 */}
        <div className="flex items-center gap-3">
          {/* 이미지 버튼은 항상 */}
          <button className="text-[var(--color-gray-50)]" onClick={handleImageClick}>
            <img src={Gallery} alt="갤러리 이모콘" className='w-7' />
          </button>

          {/* REFORMER 전용 버튼 */}
          {myRole === 'REFORMER' && (
            <>
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 border border-[var(--color-gray-50)] rounded-full body-b5-rg text-[var(--color-gray-50)]"
              >
                결제창 보내기
              </button>
              {!messages.some((msg) => msg.type === 'quotation') && (
                <button
                  onClick={handleSendQuotationOrRequire}
                  className="px-3 py-1.5 border border-[var(--color-gray-50)] rounded-full body-b5-rg text-[var(--color-gray-50)]"
                >
                  견적서 보내기
                </button>
              )}
            </>
          )}

          {/* USER 전용 버튼 */}
          {myRole === 'USER' && !messages.some((msg) => msg.type === 'quotation') && (
            <button
              onClick={handleSendQuotationOrRequire}
              className="px-3 py-1.5 border border-[var(--color-gray-50)] rounded-full body-b5-rg text-[var(--color-gray-50)]"
            >
              요청서 보내기
            </button>
          )}
        </div>

        {/* 오른쪽 보내기 버튼 */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`px-6 py-2 rounded-lg body-b1-sb transition-colors ${
            message.trim() ? 'bg-[var(--color-mint-1)] text-white' : 'bg-[var(--color-gray-30)] text-[var(--color-gray-40)]'
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
