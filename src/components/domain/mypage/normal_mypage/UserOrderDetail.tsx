import { useEffect, useState } from 'react';
import { useUserTabStore } from '../../../../stores/tabStore';
import { getOrderDetail, type OrderDetail } from '@/api/mypage/orderApi';

const UserOrderDetail = () => {
  const { selectedOrderId, setSelectedOrderId } = useUserTabStore();

  const [order, setOrder] = useState<
  OrderDetail & { 
    status: '결제 완료' | '상품준비 중' | '발송 완료' | '상태 없음';
    postalCode: string; 
  } | null
>(null);

  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const displayStatusMap: Record<OrderDetail['status'], '결제 완료' | '상품준비 중' | '발송 완료'> = {
    PENDING: '상품준비 중',
    SHIPPED: '발송 완료',
    COMPLETED: '결제 완료',
  };

  const statusOptions: ('결제 완료' | '상품준비 중' | '발송 완료')[] = [
    '결제 완료',
    '상품준비 중',
    '발송 완료',
  ];

  useEffect(() => {
    if (!selectedOrderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await getOrderDetail(selectedOrderId);
        const mappedStatus = data.status ? displayStatusMap[data.status] : '상태 없음';
        setOrder({ ...data, status: mappedStatus, postalCode: data.deliveryPostalCode });
      } catch (err) {
        console.error('주문 상세 조회 실패', err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [selectedOrderId]);

  if (loading) return <div className="text-center py-10">로딩 중...</div>;
  if (!order) return <div className="text-center py-10">주문 정보를 불러올 수 없습니다.</div>;

  return (
    <div className="w-full mx-auto p-4 bg-transparent">
      {/* 목록으로 돌아가기 */}
      <div className="mb-4">
        <button
          onClick={() => setSelectedOrderId(null)}
          className="px-4 py-2 bg-[var(--color-mint-6)] text-[var(--color-mint-1)] rounded-md body-b1-rg hover:brightness-95 transition-all"
        >
          ← 목록으로 돌아가기
        </button>
      </div>

      <div className="bg-white body-b1-rg border border-[var(--color-line-gray-40)] rounded-[1.25rem] p-8 shadow-sm space-y-12">
        
        {/* 주문번호 */}
        <div className="text-[var(--color-gray-50)] body-b1-rg mb-6">
          주문번호 {order.receiptNumber}
        </div>

        {/* --- 섹션 1: 상품 정보 --- */}
        <section>
          <h3 className="body-b0-md text-black mb-2">상품 정보</h3>
          <div className="w-full h-[1px] bg-[var(--color-line-gray-40)] mb-6" />

          <div className="flex gap-6">
            <div className="w-35 h-36 bg-gray-100 flex-shrink-0 overflow-hidden rounded-lg">
              <img 
                src={order.thumbnail}
                alt={order.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <h4 className="body-b0-md text-black leading-tight">
                {order.title}
              </h4>

              <div className="grid grid-cols-[80px_1fr] text-[15px] gap-y-2 gap-x-4">
                <span className="body-b0-rg text-[var(--color-gray-50)]">결제금액</span>
                <span className="text-black body-b0-rg">{order.price.toLocaleString()}원</span>

                <span className="body-b0-rg text-[var(--color-gray-50)]">옵션</span>
                <span className="text-black body-b0-rg">
                  {order.options.map(opt => opt.name).join(', ')}
                </span>

                <span className="body-b0-rg text-[var(--color-gray-50)]">결제일시</span>
                <span className="body-b0-rg text-[var(--color-gray-50)]">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* --- 섹션 2: 주문자 및 배송 정보 --- */}
        <section className='px-2'>
          <h3 className="body-b0-md text-black mb-2">주문자 정보</h3>
          <div className="w-full h-[1px] bg-[var(--color-line-gray-40)] mb-6" />

          <div className="flex flex-col">
            {/* 상단 레이아웃: 이름/연락처와 진행상태/운송장을 2컬럼으로 배치 */}
            <div className="grid grid-cols-2 gap-x-20">
              {/* 왼쪽: 기본 인적사항 */}
              <div className="grid grid-cols-[100px_1fr] text-[15px] gap-y-4 gap-x-4">
                <span className="body-b0-rg text-[var(--color-gray-50)]">구매자 성함</span>
                <span className="body-b0-rg text-black">{order.deliveryRecipientName}</span>

                <span className="body-b0-rg text-[var(--color-gray-50)]">연락처</span>
                <span className="text-black body-b0-rg">{order.deliveryPhone}</span>
              </div>

              {/* 오른쪽: 진행 상태 및 운송장 입력 */}
              <div className="flex flex-col gap-4">
                {/* 진행 상태 드롭다운 */}
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="body-b0-rg text-[var(--color-gray-50)]">진행 상태</span>
                  <div className="relative">
                    <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 body-b0-rg text-[var(--color-mint-1)] bg-transparent outline-none"
                    >
                      {order.status || '상태 없음'}
                      <span className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute top-full mt-2 w-40 bg-white rounded-[1.25rem] p-4 z-50 shadow-[1px_3px_11.7px_0px_#00000026]">
                        <ul className="flex flex-col gap-4">
                          {statusOptions.map(option => (
                            <li
                              key={option}
                              onClick={() => {
                                setOrder({ ...order, status: option });
                                setIsDropdownOpen(false);
                              }}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all
                                ${order.status === option ? 'border-black' : 'border-gray-300'}`}>
                                {order.status === option && (
                                  <div className="w-2.5 h-2.5 bg-black rounded-full" />
                                )}
                              </div>
                              <span className={`body-b1-sb ${order.status === option ? 'text-black' : 'text-gray-600'}`}>
                                {option}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* 운송장 번호 */}
                <div className="grid grid-cols-[100px_1fr] items-center">
                  <span className="body-b0-rg text-[var(--color-gray-50)]">운송장 번호</span>
                  <input 
                    type="text"
                    value={order.trackingNumber || ''}
                    onChange={(e) => setOrder({ ...order, trackingNumber: e.target.value })}
                    className="w-full max-w-[18rem] h-[2rem] border border-[var(--color-line-gray-40)] px-4 py-2 text-[14px] rounded-sm focus:outline-none focus:border-[var(--color-mint-1)]"
                    placeholder="운송장 번호를 입력하세요"
                  />
                </div>
              </div>
            </div>

            {/* 하단 배송정보: 가로 너비를 넓게 사용하여 주소 표시 */}
            <div className="grid grid-cols-[100px_1fr] text-[15px] gap-x-4 border-[var(--color-line-gray-40)] mt-4">
              <span className="body-b0-rg text-[var(--color-gray-50)]">배송정보</span>
              <span className="text-black leading-relaxed body-b0-rg">
                {order.deliveryAddress} {order.deliveryAddressDetail} ({order.deliveryPostalCode})
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default UserOrderDetail;