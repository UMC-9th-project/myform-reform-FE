import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';

interface QuotationImage {
  file: File;
  preview: string;
}

interface ChatQuotationFormData {
  images: QuotationImage[];
  price: string; // 견적 금액
  delivery: string; // 배송비
  content: string; // 상세 내용
  estimatedDays: string; // 예상 작업 기간
}

const ChatQuotationFormPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<ChatQuotationFormData>({
    images: [],
    price: '',
    delivery: '',
    content: '',
    estimatedDays: '',
  });

  const MAX_IMAGES = 10;

  // 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: QuotationImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, MAX_IMAGES),
    }));

    e.target.value = ''; // 재업로드 가능
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // input/textarea 변경
  const handleChange = (field: keyof ChatQuotationFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 필수 값이 모두 채워졌는지 판단
const isFormComplete =
  formData.images.length > 0 &&
  formData.price.trim() !== '' &&
  formData.delivery.trim() !== '' &&
  formData.content.trim() !== '' &&
  formData.estimatedDays.trim() !== '';


  const handleSubmit = () => {
    // validation 체크
    if (!formData.images.length) return alert('이미지를 최소 1장 업로드해주세요.');
    if (!formData.price.trim()) return alert('견적 금액을 입력해주세요.');
    if (!formData.delivery.trim()) return alert('배송비를 입력해주세요.');
    if (!formData.content.trim()) return alert('상세 내용을 입력해주세요.');
    if (!formData.estimatedDays.trim()) return alert('예상 작업 기간을 입력해주세요.');

    console.log('전송 데이터:', formData);

    // TODO: 서버 API 전송 또는 채팅 메시지 전송
    alert('견적서가 전송되었습니다.');
  };



  return (
    <div className="max-w-7xl mx-auto p-8 bg-white text-gray-800">
      <>
        <h1 className="heading-h2-bd text-black mb-10 pb-6 border-b border-black">
          리폼 견적서 작성하기
        </h1>

        <div className="space-y-12">
          {/* Step 1: Image Upload */}
          <section className="mb-10">
            <div className="flex">
              <div className="w-1/4">
                <h2 className="body-b0-md">Step 1.</h2>
                <p className="body-b0-rg mt-1">
                  이미지 등록 ({formData.images.length}/{MAX_IMAGES}) <span className="text-red-500">*</span>
                </p>
              </div>
              <div className="w-3/4">
                <div className="flex flex-wrap gap-4">
                  <input 
                    type="file"
                    title="파일 추가"
                    accept="image/*"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />

                  {formData.images.map((img, index) => (
                    <div key={index} className="relative w-36 h-36 rounded-[0.75rem] overflow-hidden border border-gray-300 group">
                      <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                      {index === 0 && (
                        <span className="absolute top-2 left-2 bg-teal-500 text-white px-2 py-0.5 rounded-full text-xs">
                          대표
                        </span>
                      )}
                      <button
                        onClick={() => removeImage(index)}
                        title="삭제 버튼"
                        className="absolute top-1 right-1 bg-black/40 text-white rounded-full p-0.5 hover:bg-black/60 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}

                  {formData.images.length < MAX_IMAGES && (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-36 h-36 rounded-lg border border-gray-300 bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition"
                    >
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 25.5882V28.2941C9 29.0118 9.28973 29.7 9.80546 30.2075C10.3212 30.7149 11.0207 31 11.75 31H28.25C28.9793 31 29.6788 30.7149 30.1945 30.2075C30.7103 29.7 31 29.0118 31 28.2941V25.5882M13.125 14.7647L20 8M20 8L26.875 14.7647M20 8V24.2353" stroke="#646F7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>

                      <span className="text-gray-500 mt-2 text-center text-sm">이미지 업로드</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 mt-3 text-sm">
                  *이미지는 10MB 이하의 PNG 혹은 JPEG만 업로드 가능합니다.
                </p>
              </div>
            </div>
          </section>

          {/* Step 2: 금액 및 배송비 */}
          <section className="flex flex-col md:flex-row gap-8 pt-10 border-t border-[var(--color-line-gray-40)]">
            <div className="w-48 pt-2">
              <h2 className="body-b0-md">Step 2.</h2>
              <p className="body-b0-rg text-black">견적 금액 및 배송비 <span className="text-[var(--color-red-1)]">*</span></p>
            </div>
            <div className="flex-1 space-y-4">
              <div className="relative">
                <input 
                  type="text"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="견적 금액을 입력해주세요." 
                  className="w-[55rem] p-4 body-b1-rg border border-[var(--color-gray-60)]"
                />
                <span className="absolute right-33 top-1/2 -translate-y-1/2 body-b1-rg">원</span>
              </div>
              <div className="relative">
                <input 
                  type="text"
                  value={formData.delivery}
                  onChange={(e) => handleChange('delivery', e.target.value)}
                  placeholder="배송비를 입력해주세요." 
                  className="w-[55rem] p-4 body-b1-rg border border-[var(--color-gray-60)]"
                />
                <span className="absolute right-33 top-1/2 -translate-y-1/2 body-b1-rg">원</span>
              </div>
            </div>
          </section>

          {/* Step 3: 상세 내용 */}
          <section className="flex flex-col md:flex-row gap-8 pt-10 border-t border-[var(--color-line-gray-40)]">
            <div className="w-48 pt-2">
              <h2 className="body-b0-md">Step 3.</h2>
              <p className="body-b0-rg text-black">상세 내용 작성<span className="text-[var(--color-red-1)]">*</span></p>
            </div>
            <div className="flex-1 relative">
              <textarea 
                rows={10}
                maxLength={1000}
                value={formData.content}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="제안하는 리폼에 대한 설명을 자세히 작성해 주세요."
                className="w-[55rem] body-b1-rg p-5 border border-black placeholder:text-[var(--color-gray-50)]"
              />
              <span className="absolute bottom-2 right-6 body-b1-rg text-[var(--color-gray-60)]">
                {formData.content.length}/1000자
              </span>
            </div>
          </section>

          {/* Step 4: 예상 작업 기간 */}
          <section className="flex flex-col md:flex-row gap-8 pt-12 border-t border-[var(--color-line-gray-40)]">
            <div className="w-48 pt-2">
              <h2 className="body-b0-md">Step 4.</h2>
              <p className="body-b0-rg text-black">예상 작업 기간<span className="text-[var(--color-red-1)]">*</span></p>
            </div>
            <div className="flex-1 relative">
              <div className="relative">
                <input 
                  type="text"
                  value={formData.estimatedDays}
                  onChange={(e) => handleChange('estimatedDays', e.target.value)}
                  placeholder="예상되는 작업 소요 기간을 기재해주세요." 
                  className="w-[55rem] p-4 body-b1-rg border border-[var(--color-gray-60)]"
                />
                <span className="absolute right-33 top-1/2 -translate-y-1/2 body-b1-rg">일 이내</span>
              </div>
            </div>
          </section>

          {/* 유의사항 */}
          <section className="flex flex-col md:flex-row gap-8 pt-12 border-t border-[var(--color-line-gray-40)]">
            <div className="w-48 pt-2">
              <h2 className="body-b0-rg text-[black]">유의사항</h2>
            </div>
            <div className="flex-1">
              <p className="body-b0-rg text-[var(--color-gray-50)] mb-4">잠깐! 제안을 보내기 전에 확인해보세요.</p>
              <ul className="body-b0-rg text-[var(--color-gray-50)] space-y-2 leading-relaxed">
                <li>- 타인의 저작물 (예시 이미지 등)을 무단으로 캡처하여 업로드하는 것을 금지합니다.</li>
                <li>- 보낸 견적은 채팅방에서 확인할 수 있어요.</li>
                <li>- 3일 내에 견적 수락/거절 여부를 채팅방을 통해 받을 수 있어요.</li>
                <li>- 구체적인 설명(제안 스타일, 참고 이미지 등)을 작성할수록 견적 수락 확률이 올라갑니다.</li>
              </ul>
            </div>
          </section>
        </div>

        {/* 전송 버튼 */}
        <div className="mt-16 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!isFormComplete}
            className={`
              px-10 py-5 rounded-lg body-b0-bd
              ${isFormComplete ? 'bg-[var(--color-mint-1)] text-white' : 'bg-[var(--color-line-gray-30)] text-[var(--color-gray-50)] cursor-not-allowed'}
              transition-colors
            `}
          >
            전송하기
          </button>

        </div>
      </>
    </div>
  );
};

export default ChatQuotationFormPage;
