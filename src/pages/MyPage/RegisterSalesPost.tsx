import React from 'react';
import { Plus, X, GripVertical } from 'lucide-react';

const RegisterSalesPost = () => {
  return (
    <div className="max-w-7xl mx-auto p-8 bg-white text-gray-800">
      <h1 className="heading-h2-bd pb-6 border-b mb-8 border-[black]">판매글 등록하기</h1>

      {/* Step 1: Image Upload */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 1.</h2>
            <p className="body-b0-rg mt-1">이미지 등록 (0/5) <span className="text-[var(--color-red-1)]">*</span></p>
          </div>
          <div className="w-3/4">
            <div className="w-36 h-36 bg-[var(--color-gray-20)] border border-[var(--color-gray-40)] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 25.5882V28.2941C9 29.0118 9.28973 29.7 9.80546 30.2075C10.3212 30.7149 11.0207 31 11.75 31H28.25C28.9793 31 29.6788 30.7149 30.1945 30.2075C30.7103 29.7 31 29.0118 31 28.2941V25.5882M13.125 14.7647L20 8M20 8L26.875 14.7647M20 8V24.2353" stroke="#646F7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>

              <span className="body-b3-rg text-[var(--color-gray-50)] text-center">이미지 업로드</span>
            </div>
            <p className="body-b1-rg text-[var(--color-gray-50)] mt-3">*이미지는 10MB 이하의 PNG 혹은 JPEG만 업로드 가능합니다.</p>
          </div>
        </div>
      </section>

      <hr className="mt-8 mb-12 border-[var(--color-line-gray-40)]" />

      {/* Step 2: Title */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 2.</h2>
            <p className="body-b0-rg mt-1">판매글 제목 <span className="text-[var(--color-red-1)]">*</span></p>
          </div>
          <div className="w-3/4 relative">
            <input 
              type="text" 
              placeholder="요청글 제목을 입력해주세요." 
              className="placeholder:text-[var(--color-gray-50)] w-full border border-[var(--color-gray-60)] body-b1-rg p-5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-3 text-sm text-gray-400">0/40자</span>
          </div>
        </div>
      </section>

      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      {/* Step 3: Description */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 3.</h2>
            <p className="body-b0-rg mt-1">상품 설명 <span className="text-[var(--color-red-1)]">*</span></p>
          </div>
          <div className="w-3/4">
            <div className="border border-[var(--color-gray-60)] min-h-[250px] flex flex-col items-center justify-center bg-white mt-6">
              <p className="body-b0-rg text-[var(--color-gray-50)] mb-4">등록된 내용이 없습니다.</p>
              <button className="flex items-center gap-2 border border-[var(--color-line-gray-40)] px-6 py-3 rounded-[0.63rem] body-b1-rg cursor-pointer">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 23.0755H5.7303L23.0755 5.7303L18.3446 1L1 18.3452V23.0755Z" stroke="#646F7C" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M13.6133 5.73047L18.3436 10.4608" stroke="#646F7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.3398 23.5H23.5002" stroke="#646F7C" stroke-width="2" stroke-linecap="round"/>
                </svg> 글쓰기
              </button>
            </div>
            <p className="body-b1-rg mt-2 text-[var(--color-gray-50)]">*이미지는 100MB 이하의 PNG 혹은 JPEG만 업로드 가능합니다.</p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      {/* Step 4: Price & Shipping */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 4.</h2>
            <p className="body-b0-rg mt-1">가격 · 배송비 입력 <span className="text-[var(--color-red-1)]">*</span></p>
          </div>
          <div className="w-3/4 space-y-4">
            <div>
              <div className="flex items-center border border-[var(--color-gray-50)] p-5">
                <input 
                    type="text" 
                    placeholder="판매 가격을 기입해주세요." 
                    className="placeholder:text-[var(--color-gray-50)] flex-1 body-b1-rg text-[var(--color-gray-50)] outline-none bg-transparent" 
                />
                <span className="body-b1-rg text-[var(--color-gray-50)] ml-2">원</span>
              </div>
              <p className="body-b1-rg text-[var(--color-gray-50)] mt-1">*최소 금액 100원 이상으로 설정해주세요.</p>
            </div>
              <div className="flex items-center border border-[var(--color-gray-50)] p-5">
                <input 
                    type="text" 
                    placeholder="배송비를 입력해주세요." 
                    className="placeholder:text-[var(--color-gray-50)] flex-1 body-b1-rg text-[var(--color-gray-50)] outline-none bg-transparent" 
                />
                <span className="body-b1-rg ml-2 text-[var(--color-gray-50)]">원</span>
              </div>
          </div>
        </div>
      </section>

      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      {/* Step 5: Options */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 5.</h2>
            <p className="body-b0-rg mt-1">옵션 입력 <span className="text-[var(--color-red-1)]">*</span></p>
            <p className="body-b3-rg text-[var(--color-gray-50)] mt-1">각 옵션별 수량이 0개가 되면<br/>품절 처리됩니다.</p>
          </div>
          <div className="w-3/4 space-y-3">
            <div className="flex items-center gap-2">
              <GripVertical className="text-gray-400" size={20} />
              <div className="flex-1 relative">
                <input type="text" placeholder="옵션 이름을 입력해주세요." className="placeholder:text-[var(--color-gray-50)] w-full border border-[var(--color-gray-50)] p-5 body-b1-rg" />
              </div>
              <X className="text-gray-400 cursor-pointer" size={20} />
            </div>
            
            <div className="block flex items-center gap-3 ml-6">
              <GripVertical className="text-gray-400" size={20} />
              <input type="text" title="옵션명" value="선택 안 함" className="flex-1 border-b border-[var(--color-line-gray-40)] p-2 body-b1-rg focus:outline-none" />
              <div className="flex items-center gap-2 ">
                <input type="text" title="가격" value="0" className="w-20 border-b border-[var(--color-line-gray-40)] p-2 text-left body-b1-rg focus:outline-none" /> <span className='body-b1-rg'>원</span>
                <input type="text" title="개수" value="0" className="w-20 border-b border-b border-[var(--color-line-gray-40)] p-2 text-left body-b1-rg focus:outline-none" /> <span className='body-b1-rg'>개</span>
              </div>
              <X className="text-gray-400 cursor-pointer" size={20} />
            </div>

            <button className="flex items-center gap-1 body-b1-rg text-[var(--color-mint-1)] ml-6 mt-2">
              <Plus size={16} /> 세부 옵션 추가하기
            </button>
            <button className="flex items-center gap-1 body-b1-rg text-[var(--color-mint-1)] mt-4 font-medium">
              <Plus size={18} /> 옵션 추가하기
            </button>
          </div>
        </div>
      </section>

      <hr className="my-8 border-gray-100" />

      {/* Step 6: Category */}
      <section className="mb-16">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 6.</h2>
            <p className="body-b0-rg mt-1">카테고리 선택 <span className="text-[var(--color-red-1)]">*</span></p>
            <p className="body-b3-rg text-[var(--color-gray-50)] mt-1">소분류는 필수로 선택하지<br/>않아도 됩니다.</p>
          </div>
          <div className="w-3/4 flex border border-[var(--color-line-gray-40)] h-80">
            <div className="w-1/3 border-r border-[var(--color-line-gray-40)] overflow-y-auto flex flex-col body-b1-rg">
              {['의류', '잡화', '악세서리', '홈·리빙', '기타'].map((cat, index, array) => (
                <div 
                    key={cat} 
                    className={`
                        flex-1 flex items-center justify-start body-b1-rg cursor-pointer pl-5 hover:bg-[var(--color-gray-30)]
                        ${index !== array.length - 1 ? '' : ''}
                    `}
                >
                    {cat}
                </div>
            ))}
            </div>
            <div className="w-2/3 flex items-center justify-center body-b1-rg text-[var(--color-gray-50)]">
              소분류 선택
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button className="body-b0-bd bg-[var(--color-gray-30)] rounded-[0.625rem] px-12 py-5 cursor-not-allowed">
          등록하기
        </button>
      </div>
    </div>
  );
};

export default RegisterSalesPost;