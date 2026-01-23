import React, { useState } from 'react';

export interface PaymentRequestData {
  price: number;
  delivery: number;
  days: number;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: PaymentRequestData) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSend }) => {
  const [price, setPrice] = useState('');
  const [delivery, setDelivery] = useState('');
  const [days, setDays] = useState('');

  if (!isOpen) return null;

  const isFormValid =
    price.trim() != '' &&
    delivery.trim() !== '' &&
    days.trim() !== '';
    

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-8">
      <div className="bg-white mr-5 rounded-[2rem] w-[45rem] relative shadow-xl">
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black" title="닫기 버튼">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className='pt-5 px-8'>
          <h2 className="heading-h4-bd">결제창 보내기</h2>
          <p className="body-b1-rg text-[var(--color-gray-60)] mb-2">아래 결제 요청 내용을 확인해주세요.</p>
        </div>
        <div className='bg-[var(--color-gray-30)] rounded-b-[2rem] p-8'>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block heading-h5-sb text-[var(--color-gray-60)] mb-2">예상 가격</label>
              <div className="flex items-center justify-between border-[0.6rem] border-white rounded-xl">
                <input
                    title="예상 가격" 
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}  
                    className="flex-1 outline-none text-left text-[1.3rem] w-[15rem] bg-white" />
                <span className="shrink-0 bg-white text-[1.3rem]">원</span>
              </div>
            </div>
            <div className="flex-1">
              <label className="block heading-h5-sb text-[var(--color-gray-60)] mb-2">배송비</label>
              <div className="flex items-center justify-between border-[0.6rem] border-white rounded-xl">
                <input
                    title="배송비" 
                    value={delivery}
                    onChange={(e) => setDelivery(e.target.value)}
                    type="number" 
                    className="flex-1 outline-none text-left text-[1.3rem] w-[15rem] bg-white" />
                <span className="shrink-0 bg-white text-[1.3rem]">원</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <label className="block heading-h5-sb text-[var(--color-gray-60)] mb-2">예상 작업 소요일</label>
            <div className="flex items-center justify-between border-white border-[0.6rem] rounded-xl">
            <input
                title="예상 작업 소요일" 
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)} 
                className="flex-1 outline-none text-left text-[1.3rem] bg-white" />
            <span className="shrink-0 bg-white text-[1.3rem]">일 이내</span>
            </div>
          </div>
        </div>
        <div className='flex justify-center'>
        <button
          disabled={!isFormValid}
          onClick={() => {
            onSend({
              price: Number(price),
              delivery: Number(delivery),
              days: Number(days),
            });
            onClose();
          }}
          className={`w-50 text-[1.31rem] font-semibold rounded-xl py-4 mt-20 transition
            ${
              isFormValid
              ? 'bg-[black] text-white'
              : 'bg-[var(--color-gray-50)] text-white'
            }`}
          > 전송하기 </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;