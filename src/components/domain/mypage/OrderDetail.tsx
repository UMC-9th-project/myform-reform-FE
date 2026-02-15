import { useEffect, useState } from 'react';
import { useSellerTabStore } from '../../../stores/tabStore';
import { getOrderById } from '../../../api/mypage/sale';
import formatPhoneNumber from '@/utils/domain/formatPhoneNumber';
import { updateTrackingNumber } from '@/api/mypage/tracking';

interface DeliveryAddress {
  postalCode: string | null;
  address: string | null;
  addressDetail: string | null;
  recipientName: string | null;
  phone: string | null;
  addressName: string | null;
}

interface OrderDetailType {
  orderNo: string;
  id: number;
  productTitle: string;
  productImage: string;
  price: number;
  option: string;
  paymentDate: string;

  buyer: string;
  phone: string;

  deliveryAddress: DeliveryAddress;
  status: '결제 완료' | '상품준비 중' | '발송 완료';
  trackingNumber: string;
  receiptNumber: string;
}

const statusMap: Record<string, OrderDetailType['status']> = {
  PENDING: '결제 완료',
  PROCESSING: '상품준비 중',
  SHIPPED: '발송 완료'
};


const OrderDetail = () => {
  const { selectedOrderId, setSelectedOrderId } = useSellerTabStore();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
   // 드롭다운 열림/닫힘 상태 추가
  const [isEditingTracking, setIsEditingTracking] = useState(false);

  const fullAddress = [
    order?.deliveryAddress.address,
    order?.deliveryAddress.addressDetail,
  ]
    .filter(Boolean)
    .join(' ')
    + (order?.deliveryAddress.postalCode
        ? ` (${order.deliveryAddress.postalCode})`
        : '');

    const formatNumber = (value: number) =>
      value.toLocaleString('ko-KR');



    useEffect(() => {

      if (!selectedOrderId) return;

      getOrderById(selectedOrderId)
        .then(res => {
          const data = res.success;
          if (!data) { 
            return;
          }

          setOrder({
            orderNo: data.orderId,
            id: data.targetId,
            productTitle: data.title,
            productImage: data.thumbnail || '',
            price: data.price,
            option: data.option || '선택 안 함',
            paymentDate: data.createdAt.split('.')[0].replace('T', ' '), // YYYY-MM-DD HH:MM:SS
            buyer: data.userName,
            phone: data.phone,
            deliveryAddress: {
              postalCode: data.delivery_address.postal_code,
              address: data.delivery_address.address,
              addressDetail: data.delivery_address.address_detail,
              recipientName: data.delivery_address.recipient_name,
              phone: data.delivery_address.phone,
              addressName: data.delivery_address.address_name,
            },
            status: statusMap[data.status] || '결제 완료',
            trackingNumber: data.billNumber || '',
            receiptNumber: data.receiptNumber,
          });
        })
        .catch(err => console.error('주문 상세 조회 실패', err));
    }, [selectedOrderId]);

  if (!order) return <div className="text-center py-20">로딩 중...</div>;
  
  const handleSaveTracking = async () => {
    if (!order) return;
    try {
      await updateTrackingNumber(order.orderNo, order.trackingNumber);
      setIsEditingTracking(false);
      alert('운송장 번호가 저장되었습니다.');
    } catch (err) {
      console.error('운송장 번호 수정 실패', err);
      alert('운송장 번호 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteTracking = async () => {
    if (!order) return;
    try {
      await updateTrackingNumber(order.orderNo, ''); // 빈 문자열로 수정 요청
      setOrder({ ...order, trackingNumber: '' }); // 로컬 상태도 갱신
      setIsEditingTracking(false);
      alert('운송장 번호가 삭제되었습니다.');
    } catch (err) {
      console.error('운송장 번호 삭제 실패', err);
      alert('운송장 번호 삭제 중 오류가 발생했습니다.');
    }
  };


  return (
    <div className="w-100% mx-auto p-0 bg-transparent">
       <div className="mb-4">
        <button
          onClick={() => setSelectedOrderId(null)} // null로 설정하면 OrderList로 돌아감
          className="px-4 py-2 bg-[var(--color-mint-6)] text-[var(--color-mint-1)] rounded-md body-b1-rg hover:brightness-95 transition-all"
        >
          ← 목록으로 돌아가기
        </button>
      </div>
      <div className="bg-white body-b1-rg border border-[var(--color-line-gray-40)] rounded-[1.25rem] p-5 shadow-sm space-y-12">
        <div className="text-[var(--color-gray-50)] body-b1-rg mb-6">
          주문번호 {order.receiptNumber}
        </div>
        
        {/* --- 섹션 1: 상품 정보 --- */}
        <section>
          <h3 className="body-b0-md text-black mb-2">상품 정보</h3>
          <div className="w-full h-[1px] bg-[var(--color-line-gray-40)] mb-6" />
          
          <div className="flex gap-6">
            {/* 상품 이미지 */}
            <div className="w-35 h-36 bg-gray-100 flex-shrink-0 overflow-hidden">
              <img 
                src={order.productImage}
                alt="상품 이미지" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* 상품 상세 텍스트 */}
            <div className="flex-1 flex flex-col gap-3">
              <h4 className="body-b0-md text-black leading-tight">
                {order.productTitle}
              </h4>
              
              <div className="grid grid-cols-[80px_1fr] text-[15px] gap-y-2 gap-x-4">
                <span className="body-b0-rg text-[var(--color-gray-50)]">결제금액</span>
                <span className="text-black body-b0-rg">{formatNumber(order.price)}원</span>

                <span className="body-b0-rg text-[var(--color-gray-50)]">옵션</span>
                <span className="text-black body-b0-rg">{order.option}</span>
                
                <span className="body-b0-rg text-[var(--color-gray-50)]">결제일시</span>
                <span className="body-b0-rg text-[var(--color-gray-50)]">{order.paymentDate}</span>
              </div>
            </div>
          </div>
        </section>

        {/* --- 섹션 2: 주문자 정보 --- */}
        <section className='px-2'>
          <h3 className="body-b0-md text-black mb-2">주문자 정보</h3>
          <div className="w-full h-[1px] bg-[var(--color-line-gray-40)] mb-6" />

          <div className="grid grid-cols-2 gap-x-20">
            {/* 왼쪽: 기본 인적사항 */}
            <div className="grid grid-cols-[100px_1fr] text-[15px] gap-y-2 gap-x-4">
              <span className="body-b0-rg text-[var(--color-gray-50)]">구매자 성함</span>
              <span className="body-b0-rg text-black">{order.buyer}</span>

              <span className="body-b0-rg text-[var(--color-gray-50)]">연락처</span>
              <span className="text-black body-b0-rg">{formatPhoneNumber(order.phone)}</span>

              <span className="body-b0-rg text-[var(--color-gray-50)]">배송정보</span>
              <span className="text-black leading-relaxed body-b0-rg">
                {fullAddress || '배송지 정보 없음'}
              </span>
            </div>

            {/* 오른쪽: 진행 상태 및 운송장 입력 */}
            <div className="flex flex-col gap-4">
              
              <div className="grid grid-cols-[100px_1fr] items-center">
                <span className="body-b0-rg text-[var(--color-gray-50)]">진행 상태</span>
                <span className="body-b0-rg text-[var(--color-mint-1)] ml-2">{order.status}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-[15px]">
                  <span className="body-b0-rg text-[var(--color-gray-50)] mr-5">
                    운송장 번호
                  </span>
                  {isEditingTracking ? (
                    <div className="flex items-start gap-2">
                      <input
                        type="text"
                        value={order.trackingNumber}
                        onChange={(e) =>
                          setOrder({ ...order, trackingNumber: e.target.value })
                        }
                        className="w-[22rem] h-[2.5rem] border border-[var(--color-line-gray-40)] px-4 py-2 text-[14px]"
                        title="운송장 번호 입력"
                        autoFocus
                      />
                      <div className="flex flex-col gap-1">
                        <button
                          className="px-2 py-1 bg-[var(--color-mint-6)] text-[var(--color-mint-1)] rounded-md text-sm"
                          onClick={handleSaveTracking}
                        >
                          저장
                        </button>
                        <button
                          className="px-2 py-1 border rounded-md text-sm"
                          onClick={() => setIsEditingTracking(false)}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-[27rem] h-[2.5rem] border border-[var(--color-line-gray-40)] px-4 py-2 text-[1rem] text-gray-400 flex items-center">
                      {order.trackingNumber || '입력 필요'}
                    </div>
                  )}


                </div>

                {/* 하단 오른쪽 수정 / 삭제 */}
                <div className="flex justify-end gap-3 text-[13px]">
                  <button
                    className="text-[var(--color-gray-50)] body-b2-rg"
                    onClick={() => setIsEditingTracking(true)}
                  >
                    수정
                  </button>
                  <button
                    className="text-[var(--color-gray-50)] body-b2-rg"
                    onClick={handleDeleteTracking}
                  >
                    삭제
                  </button>

                </div>

              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default OrderDetail;