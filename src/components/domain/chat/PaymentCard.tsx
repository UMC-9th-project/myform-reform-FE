import { verifyPayment } from '@/api/chat/orderApi';
import type { PaymentPayload } from '@/types/api/chat/chatMessages';
import React from 'react';

export interface PaymentCardProps {
  nickname: string;
  type: 'sent' | 'received';
  payload: PaymentPayload;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ type, nickname, payload }) => {
  const isSent = type === 'sent';
  const displayNickname = nickname || '심심한 리본';

  const { price, delivery, expectedWorking: days, receiptNumber } = payload;
  const totalPrice = (Number(price) || 0) + (Number(delivery) || 0);

  // ✅ 포트원 V1 SDK 로드
  const loadPortOne = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).IMP) {
        // 이미 초기화되었는지 확인
        const IMP = (window as any).IMP;
        if (!IMP.agency) {
          IMP.init(import.meta.env.VITE_PORTONE_STORE_ID);
        }
        return resolve();
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.iamport.kr/v1/iamport.js';
      script.async = true;
      script.onload = () => {
        const IMP = (window as any).IMP;
        if (!IMP) return reject(new Error('포트원 SDK 로드 실패'));
        IMP.init(import.meta.env.VITE_PORTONE_STORE_ID);
        resolve();
      };
      script.onerror = () => reject(new Error('포트원 SDK 로드 실패'));
      document.body.appendChild(script);
    });
  };

  const handlePaymentClick = async () => {
  if (!receiptNumber) {
    alert('결제 정보를 불러오지 못했습니다.');
    return;
  }

  try {
    await loadPortOne();

    const IMP = (window as any).IMP;
      if (!IMP) throw new Error('포트원 SDK가 로드되지 않았습니다.');

    // IMP.request_pay 콜백 안에서
    IMP.request_pay(
      {
        pg: 'html5_inicis',
        pay_method: 'card',
        merchant_uid: receiptNumber,
        name: '내폼리폼 결제',
        amount: totalPrice,
        buyer_name: displayNickname,
      },
      (rsp: any) => {
        if (rsp.success) {
          console.log('결제 성공:', rsp);
          alert(`결제가 완료되었습니다.\n결제 금액: ${rsp.paid_amount.toLocaleString()}원`);

          if (payload.orderId) {
            // verifyPayment 호출
            verifyPayment({ order_id: payload.orderId, imp_uid: rsp.imp_uid })
              .then((res) => {
                if (res.resultType === 'SUCCESS' && res.success?.success) {
                  console.log('결제 검증 완료');
                } else {
                  console.error('결제 검증 실패', res);
                }
              })
              .catch((err) => {
                console.error('verify API 호출 오류', err);
              });
          }
        } else {
          console.error('결제 실패:', rsp);
          alert(`결제 실패: ${rsp.error_msg}`);
        }
      }
    );  

    } catch (err) {
      console.error('결제 오류:', err);
      alert((err as Error).message);
    }
  };


  return (
    <div className={`flex w-full gap-2 ${isSent ? 'justify-end' : 'justify-start'}`}>
      <div className={`${isSent ? 'bg-[var(--color-mint-5)] rounded-2xl rounded-tr-none' : 'bg-[var(--color-gray-20)] rounded-2xl rounded-tl-none'} p-5 min-w-[23rem] shadow-sm`}>
        <h2 className="heading-h5-sb mb-3 text-black">내폼리폼 안전 결제</h2>
        <p className="body-b4-sb mb-5">
          {isSent ? (
            <>
              {displayNickname}님께 <br />
              확정된 견적서에 따른 결제 요청을 보냈습니다.
            </>
          ) : (
            <>
              {displayNickname}님이 <br />
              확정된 견적서에 따른 결제 요청을 보내왔습니다.
            </>
          )}
        </p>
        <div className="bg-white rounded-xl p-4 space-y-3 shadow-sm text-sm">
          <div className="flex justify-between body-b4-sb">
            <span>견적 금액</span>
            <span className="body-b4-sb">{price.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between body-b4-sb">
            <span>배송비</span>
            <span className="body-b4-sb">{delivery.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between body-b4-sb">
            <span>예상 작업 소요일</span>
            <span className="body-b4-sb">{days}일 이내</span>
          </div>
          <div className="border-t border-[var(--color-gray-40)] pt-3 flex justify-between items-center">
            <span className="body-b4-sb">총 예상 금액</span>
            <span className="body-b4-sb">{totalPrice.toLocaleString()}원</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-4 mb-4 body-b4-sb">
          <span>수수료 별도안내</span>
          <div className="w-3.5 h-3.5 text-white bg-[var(--color-gray-50)] rounded-full etc-c2-bd flex items-center justify-center cursor-pointer">
            ?
          </div>
        </div>

        <button
          onClick={handlePaymentClick}
          className="w-full bg-black text-white py-3 rounded-xl body-b4-sb transition-colors cursor-pointer"
        >
          결제창으로 이동하기
        </button>
      </div>
    </div>
  );
};

export default PaymentCard;
