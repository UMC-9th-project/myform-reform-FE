import React, { useState } from 'react';
import MyPageTabs from '../../components/domain/mypage/MyPageTab';
import OrderList from '../../components/domain/mypage/OrderList';

type TabType = '프로필 관리' | '판매 관리' | '수익 관리';

const SalesManagement = () => {
  const [activeTab, setActiveTab] = useState<TabType>('판매 관리');

  return (
    <div className="flex max-w-8xl mx-auto p-0 bg-white min-h-screen">
      {/* 사이드탭 */}
      <div className="w-fit px-5">
        <MyPageTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="w-5/6 px-5">
      <div className='heading-h4-bd pb-3.5 border-b border-[black] mt-1 mb-8'>판매 관리</div>
        <OrderList />
      </div>
    </div>
  );
};

export default SalesManagement;
