import React, { useState, useEffect, useRef } from 'react';
import Image from '../../../assets/chat/Image.svg';

interface Message {
  id: number;
  text?: string;
  imageUrls?: string[];
  sender: 'me' | 'other';
  type: 'text' | 'image';
  time: string;
  isRead: boolean; // 읽음 상태 추가
}

interface ChatRoomProps {
  chatId: number;
  
}

// mock 데이터 정의
const mockMessages: Record<number, Message[]> = {
  1: [
    { id: 1, text: "1번 채팅방 첫 메시지입니다.", sender: 'other', time: '오후 08:30', type: 'text', isRead: false },
    { id: 2, text: "1번 채팅방 두 번째 메시지입니다.", sender: 'me', time: '오후 08:35', type: 'text', isRead: true },
  ],
  2: [
    { id: 3, text: "2번 채팅방 첫 메시지입니다.", sender: 'other', time: '오후 09:00', type:'text', isRead: false },
    { id: 4, text: "2번 채팅방 두 번째 메시지입니다.", sender: 'me', time: '오후 09:05', type: 'text', isRead: false },
  ],
  3: [
    { id: 5, text: "3번 채팅방 첫 메시지!", sender: 'other', time: '오전 10:00', type: 'text', isRead: false },
  ],
  4: [
    { id: 6, text: "4번 채팅방 첫 메시지입니다.", sender: 'other', time: '오전 11:00', type: 'text',isRead: true },
  ],
  5: [
    { id: 7, text: "5번 채팅방 첫 메시지!", sender: 'other', time: '오후 01:00', type:'text', isRead: false },
  ],
};

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  // 사진 첨부 버튼 클릭 시 실행
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const MAX_IMAGES = 5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

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

        // 🔥 전부 로드되면 한 번만 메시지 추가
        if (loadedCount === files.length) {
          const newMessage: Message = {
            id: Date.now(),
            type: 'image',
            imageUrls,
            sender: 'me',
            time: new Date().toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            isRead: false,
          };

          setMessages((prev) => [...prev, newMessage]);
        }
      };

      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // chatId가 바뀔 때마다 메시지 초기화
  useEffect(() => {
    const timer = setTimeout(() => {
    setMessages(mockMessages[chatId] || []);
  }, 0);
    return () => clearTimeout(timer);
  }, [chatId]);

  // 메시지 보내기
  const handleSend = () => {
    if (!message.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      type: 'text',
      text: message.trim(),
      sender: 'me',
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true }),
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

    useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(prev =>
        prev.map(msg => {
          if (!msg.isRead) return { ...msg, isRead: true };
          return msg;
        })
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full mx-auto h-[800px] border border-[var(--color-line-gray-40)] bg-white overflow-hidden">
      
      {/* 상단 상품 정보 헤더 */}
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
      <div className="flex-1 overflow-y-auto bg-white p-4 space-y-6">
        <div className="flex justify-center">
          <span className="bg-[var(--color-gray-30)] text-[var(--color-gray-60)] body-b3-rg px-4 py-1 rounded-full">
            2025년 12월 3일 수요일
          </span>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}
          >
            {/* 상대방 프로필 */}
            {msg.sender === 'other' && (
              <div className="w-12 h-12 rounded-full border border-[var(--color-line-gray-40)] bg-[var(--color-gray-20)] overflow-hidden flex-shrink-0">
                <img 
                  src="https://via.placeholder.com/40" 
                  alt="profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* 메시지 + 시간/읽음 */}
            <div className={`flex ${msg.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} items-end gap-1.5`}>
              <div
                className={`p-3 rounded-[0.625rem] max-w-[40rem] text-[1rem] leading-relaxed ${
                  msg.sender === 'me'
                    ? 'bg-[var(--color-mint-5)] text-black rounded-tr-none'
                    : 'bg-[var(--color-gray-20)] text-black rounded-tl-none'
                }`}
              >
                {msg.type === 'text' && msg.text}

                {msg.type === 'image' && msg.imageUrls && (
                  <div
                    className={`grid gap-1.5 ${
                      msg.imageUrls.length === 1
                        ? 'grid-cols-1 w-[240px]'
                        : msg.imageUrls.length === 2
                        ? 'grid-cols-2 w-[320px]'
                        : 'grid-cols-3 w-[360px]'
                    }`}
                  >
                    {msg.imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square w-full overflow-hidden border border-[var(--color-line-gray-40)]"
                      >
                        <img
                          src={url}
                          alt={`sent-${idx}`}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>



              <div className={`flex flex-col body-b5-rg text-[var(--color-gray-50)] min-w-max ${
                msg.sender === 'me' ? 'items-end' : 'items-start'
              }`}>
                {msg.isRead && <span className="body-b5-rg text-[var(--color-gray-50)] mb-0.5">읽음</span>}
                <span>{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력창 */}
      <div className="p-4 border-t border-[var(--color-line-gray-40)]">
        <input 
          title="사진 입력창"
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
          <div className="flex items-center gap-3">
            <button className="text-[var(--color-gray-50)]" onClick={handleImageClick}>
              <img src={Image} alt='갤러리 이모콘' />
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 border border-[var(--color-gray-50)] rounded-full body-b5-rg text-[var(--color-gray-50)]">
              결제창 보내기
            </button>
          </div>
          
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
