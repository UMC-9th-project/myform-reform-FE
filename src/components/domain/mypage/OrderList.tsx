import React, { useState, useEffect } from 'react';
import { getOrders } from '../../../api/profile/sale';
import { useNavigate } from 'react-router-dom';

interface OrderListProps {
  mode?: 'reformer' | 'normal';
  onClickDetail?: (id: string) => void;
}

interface ApiOrderItem {
  orderId: string;
  targetId: string;
  type: 'ITEM' | 'REFORM';
  status: string 
  price: number;
  deliveryFee: number;
  userName: string;
  createdAt: string;
  title: string;
  thumbnail: string;
  receiptNumber?: string;
  chatRoomId?: string | null;
}

const OrderList: React.FC<OrderListProps> = ({ mode = 'reformer', onClickDetail }) => {
  const [activeOrderTab, setActiveOrderTab] = useState<'product' | 'reform'>('product');
  const [orders, setOrders] = useState<ApiOrderItem[]>([]);
  const navigate = useNavigate();

  const formatUTC = (iso: string) => {
    const [datePart, timePart] = iso.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.split(':'); 
    const sec = second.split('.')[0];
    return `${year}. ${month}. ${day}. ${hour}:${minute}:${sec}`;
  }

  useEffect(() => {
    const type = activeOrderTab === 'product' ? 'ITEM' : 'REFORM';
    getOrders({ type })
      .then(res => {
        const mapped = res.map(item => ({
          ...item,
          type: type as 'ITEM' | 'REFORM',
          receiptNumber: item.receiptNumber ?? '',
        }));
        setOrders(mapped);
      })
      .catch(err => console.error('주문 조회 실패', err));
  }, [activeOrderTab]);

  const handleButtonClick = (order: ApiOrderItem) => {
    if (activeOrderTab === 'product') {
      if (onClickDetail) onClickDetail(order.orderId);
    } else {
      if (!order.chatRoomId) {
        console.warn('채팅방이 없습니다.');
        return;
      }
      navigate(`/chat/reformer/${order.chatRoomId}`);
    }
  };

  return (
    <div className="w-full mx-auto bg-transparent min-h-screen p-4">
      {/* 상단 탭 */}
      <div className="flex gap-2 mb-6">
        <button 
          onClick={() => setActiveOrderTab('product')}
          className={`px-5 py-2 rounded-full border body-b1-rg transition-all text-black cursor-pointer ${
            activeOrderTab === 'product' 
              ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)]' 
              : 'border-[var(--color-mint-0)] bg-transparent'
          }`}
        >
          마켓 판매
        </button>
        <button 
          onClick={() => setActiveOrderTab('reform')}
          className={`px-5 py-2 rounded-full border body-b1-rg transition-all text-black cursor-pointer ${
            activeOrderTab === 'reform' 
              ? 'border-[var(--color-mint-0)] bg-[var(--color-mint-6)]' 
              : 'border-[var(--color-mint-0)] bg-transparent'
          }`}
        >
          주문 제작
        </button>
      </div>

      {/* 리스트 영역 */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.orderId} className="bg-white border border-[var(--color-line-gray-40)] rounded-[1.25rem] p-5">
              <div className="flex justify-between items-center mb-4 text-[var(--color-gray-50)] body-b1-rg">
                <span>주문번호 {order.receiptNumber}</span>
                <button
                  className="flex items-center gap-3 hover:text-black cursor-pointer"
                  onClick={() => handleButtonClick(order)}
                >
                  {activeOrderTab === 'product' ? '상세보기' : '채팅 바로가기'}
                  <span>❯</span>
                </button>
              </div>

              <div className="flex justify-between items-end gap-4">
                <div className="flex gap-4">
                  <div className="w-40 h-40 bg-gray-100 flex-shrink-0 overflow-hidden">
                    {order.thumbnail && <img src={order.thumbnail} alt="" className="w-full h-full object-cover"/>}
                  </div>
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <h4 className="body-b0-md text-black truncate">{order.title}</h4>
                    <div className="grid grid-cols-[5rem_1fr] text-[14px] mt-1 gap-y-0.5 gap-x-4">
                      <span className="body-b0-rg text-[var(--color-gray-50)]">결제금액</span>
                      <span className="body-b0-rg text-black">{order.price.toLocaleString()}원</span>
                      <span className="body-b0-rg text-[var(--color-gray-50)]">{activeOrderTab === 'product' ? '구매자' : '요청자'}</span>
                      <span className="body-b0-rg text-black">{order.userName}</span>
                      <span className="body-b0-rg text-[var(--color-gray-50)]">결제 일시</span>
                      <span className="body-b0-rg text-[#4B5563]">{formatUTC(order.createdAt)}</span>
                      {activeOrderTab === 'product' && (
                        <>
                          <span className='body-b0-rg text-[var(--color-gray-50)]'>진행 상태</span>
                          <span className='body-b0-rg text-[var(--color-mint-1)]'>{order.status}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {mode === 'normal' && (
                  <button className="px-6 py-3 border border-[var(--color-mint-0)] bg-[var(--color-mint-6)] text-[var(--color-mint-1)] rounded-[0.75rem] body-b1-rg hover:brightness-95 transition-all whitespace-nowrap">
                    후기 작성하기
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-400 body-b1-rg">내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
