import React, { useState, useRef } from 'react';
import { X, Plus, GripVertical } from 'lucide-react';

type ImageType = {
  file: File;
  preview: string;
};

const RegisterSalesPost = () => {
  // --- 상태 관리 (Step 1 이미지용) ---
  const [images, setImages] = useState<ImageType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert("이미지는 최대 5장까지 등록 가능합니다.");
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages(prev => [...prev, ...newImages]);
    e.target.value = ''; // 같은 파일 재업로드 가능하도록 초기화
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white text-gray-800">
      <h1 className="heading-h2-bd pb-6 border-b mb-8 border-[black]">판매글 등록하기</h1>

      {/* Step 1: Image Upload */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 1.</h2>
            <p className="body-b0-rg mt-1">
              이미지 등록 ({images.length}/5) <span className="text-[var(--color-red-1)]">*</span>
            </p>
          </div>
          <div className="w-3/4">
            <div className="flex flex-wrap gap-4">
              {/* 숨김 파일 입력 */}
              <input 
                type="file" 
                title="파일 추가"
                accept="image/*" 
                multiple 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImageUpload}
              />

              {/* 업로드된 이미지 미리보기 */}
              {images.map((img, index) => (
                <div key={index} className="relative w-36 h-36 rounded-[0.75rem] overflow-hidden border border-[var(--color-gray-40)] group">
                  <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                  
                  {/* 대표 이미지 표시 */}
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-[var(--color-mint-0)] text-white body-b3-sb px-2 py-0.5 rounded-[6.25rem]">
                      대표
                    </span>
                  )}

                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => removeImage(index)}
                    title="삭제 버튼"
                    className="absolute top-1 right-1 bg-black/40 text-white rounded-full p-0.5 hover:bg-black/60 transition"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* 이미지 업로드 버튼 */}
              {images.length < 5 && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-36 h-36 rounded-lg border border-[var(--color-gray-40)] bg-[var(--color-gray-20)] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                >
                  <Plus size={28} className="text-gray-400" />
                  <span className="body-b3-rg text-[var(--color-gray-50)] mt-2 text-center">이미지 업로드</span>
                </div>
              )}
            </div>
            <p className="body-b1-rg text-[var(--color-gray-50)] mt-3">
              *이미지는 10MB 이하의 PNG 혹은 JPEG만 업로드 가능합니다.
            </p>
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
                    <path d="M1 23.0755H5.7303L23.0755 5.7303L18.3446 1L1 18.3452V23.0755Z" stroke="#646F7C" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M13.6133 5.73047L18.3436 10.4608" stroke="#646F7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.3398 23.5H23.5002" stroke="#646F7C" strokeWidth="2" strokeLinecap="round"/>
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
            <div className="relative flex items-center">
              <GripVertical className="absolute -left-8 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="옵션 이름을 입력해주세요." 
                className="placeholder:text-[var(--color-gray-50)] w-full border border-[var(--color-gray-50)] p-5 body-b1-rg outline-none" 
              />
              <X className="absolute -right-8 text-gray-400 cursor-pointer" size={20} />
            </div>
            
            <div className="relative flex items-center gap-3 ml-6">
              <GripVertical className="text-gray-400 shrink-0" size={20} />
              <input type="text" title="옵션명" defaultValue="선택 안 함" className="flex-1 border-b border-[var(--color-line-gray-40)] p-2 body-b1-rg focus:outline-none ml-auto" />
              <div className="flex items-center gap-2 shrink-0">
                <input type="text" title="가격" defaultValue="0" className="w-20 border-b border-[var(--color-line-gray-40)] p-2 text-right body-b1-rg focus:outline-none" /> <span className='body-b1-rg'>원</span>
                <input type="text" title="개수" defaultValue="0" className="w-20 border-b border-[var(--color-line-gray-40)] p-2 text-right body-b1-rg focus:outline-none" /> <span className='body-b1-rg'>개</span>
              </div>
              <X className=" absolute -right-8 text-gray-400 cursor-pointer shrink-0 ml-2 ml-8" size={20} />
            </div>

            <button className="flex items-center gap-1 body-b1-rg text-[var(--color-mint-1)] ml-6 mt-2 cursor-pointer">
              <Plus size={16} /> 세부 옵션 추가하기
            </button>
            <button className="flex items-center gap-1 body-b1-rg text-[var(--color-mint-1)] mt-4 font-medium cursor-pointer">
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
            <div className="w-1/3 border-r border-[var(--color-line-gray-40)] overflow-y-auto flex flex-col">
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
        <button className="body-b0-bd bg-[var(--color-gray-30)] text-[var(--color-gray-50)] rounded-[0.625rem] px-12 py-5 cursor-not-allowed">
          등록하기
        </button>
      </div>
    </div>
  );
};

export default RegisterSalesPost;