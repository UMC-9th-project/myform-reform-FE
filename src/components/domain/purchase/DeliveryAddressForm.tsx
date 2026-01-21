import { useState } from 'react';
import Input from './Input';
import Button2 from '../../common/Button/button2';

const DeliveryAddressForm = () => {
  const [activeTab, setActiveTab] = useState<'existing' | 'new'>('existing');

  return (
    <div className="border-b border-[var(--color-line-gray-40)] pb-14 w-[47.25rem]">
      {/* 탭 */}
      <div className="flex mb-8 border-b border-[var(--color-line-gray-40)]">
        <button
          type="button"
          onClick={() => setActiveTab('existing')}
          className={`px-6 py-3 body-b0-sb w-[16.0625rem] cursor-pointer ${
            activeTab === 'existing'
              ? 'bg-[var(--color-black)] text-[var(--color-white)]'
              : 'bg-[var(--color-white)] text-[var(--color-gray-60)] border border-[var(--color-line-gray-40)] border-b-0'
          }`}
        >
          기존 배송지
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('new')}
          className={`px-6 py-3 body-b0-sb w-[16.0625rem] cursor-pointer ${
            activeTab === 'new'
              ? 'bg-[var(--color-black)] text-[var(--color-white)]'
              : 'bg-[var(--color-white)] text-[var(--color-gray-60)] border border-[var(--color-line-gray-40)] border-b-0'
          }`}
        >
          신규 배송지
        </button>
      </div>

      {/* 폼 */}
      <div className="grid grid-cols-[6.5rem_1fr] gap-y-7">
        <label className="body-b1-sb self-center">배송지명</label>
        <div className="max-w-[calc(100%-10.5rem-1rem)]">
          <Input />
        </div>

        <label className="body-b1-sb self-center">
          수령인 <span className="text-[var(--color-red-1)]">*</span>
        </label>
        <div className="max-w-[calc(100%-10.5rem-1rem)]">
          <Input />
        </div>

        {/* 배송지 */}
        <label className="body-b1-sb pt-4">
          배송지 <span className="text-[var(--color-red-1)]">*</span>
        </label>

        <div className="relative">
          {/* 우편번호 + 버튼 */}
          <div className="flex items-start gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Input placeholder="우편번호" />
              <Input placeholder="주소" />
              <Input placeholder="상세주소" />
            </div>

            <Button2 className="w-[10.5rem] h-[3.375rem] mt-[0.125rem]">
              우편번호 검색
            </Button2>
          </div>
        </div>

        {/* 연락처 */}
        <label className="body-b1-sb self-center">
          연락처 <span className="text-[var(--color-red-1)]">*</span>
        </label>
        <div className="max-w-[calc(100%-10.5rem-1rem)]">
          <div className="flex items-center gap-2">
            <Input className="flex-1" />
            <span className="body-b1-rg text-[var(--color-gray-50)]">-</span>
            <Input className="flex-1" />
            <span className="body-b1-rg text-[var(--color-gray-50)]">-</span>
            <Input className="flex-1" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddressForm;
