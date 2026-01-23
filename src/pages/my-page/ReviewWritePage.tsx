import React, { useState, useRef } from 'react';
import { useUserTabStore } from '../../stores/tabStore';
import Button from '../../components/common/Button/button1';

const ReviewWritePage: React.FC = () => {
  const { selectedOrderId, setSelectedOrderId, setActiveTab } = useUserTabStore();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  
  // 사진 관련 상태
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedOrderId) return <div className="p-10">주문 정보가 없습니다.</div>;

  // 파일 선택 핸들러
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      
      // 최대 4장 제한 체크
      if (selectedFiles.length + newFiles.length > 4) {
        alert("최대 4장까지만 업로드 가능합니다.");
        return;
      }
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    // API 제출 로직 (content, rating, selectedFiles)
    
    setSelectedOrderId(null);
    setActiveTab('나의 후기');
  };

  return (
    <div className="max-w-7xl mx-auto p-10 bg-white min-h-screen">
      <h2 className="text-[24px] font-bold mb-10 pb-4 border-b border-black">후기 작성하기</h2>
      
      {/* 1. 별점 섹션 */}
      <div className='mx-auto pr-15 max-w-[50rem]'>
      <div className="mb-10 text-center">
        <p className="mb-2 body-b1-md text-left">제품에 대해서 만족하셨나요?<span className='text-[var(--color-red-1)]'> *</span></p>
        <div className="flex justify-start gap-1 mb-6">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className={`text-4xl transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-200'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* 2. 후기 작성 섹션 */}
      <div className="mb-10">
        <div className='body-b1-md mb-3'>후기 작성</div>
        <div className="relative">
          <textarea
            className="w-full h-80 p-5 border border-gray-300 rounded-sm focus:outline-none focus:border-black resize-none body-b1-rg"
            placeholder="후기를 작성해주세요."
            value={content}
            maxLength={1000}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="absolute bottom-1 -right-20 text-gray-400 body-b2-rg">
            {content.length}/1000자
          </div>
        </div>
      </div>

      {/* 3. 사진 등록 섹션 (이미지 디자인 반영) */}
      <div className="mb-16">
        <div className='body-b1-md mb-3'>사진 등록</div>
        <div className="flex gap-3 items-center">
          {/* 가짜 입력창 */}
          <div className="flex-1 h-14 bg-[#F8F9FA] border border-gray-200 rounded-sm flex items-center px-4 text-gray-400 body-b1-rg overflow-hidden">
            {selectedFiles.length > 0 
              ? `${selectedFiles[0].name} ${selectedFiles.length > 1 ? `외 ${selectedFiles.length - 1}개` : ''}`
              : "선택된 파일 없음"
            }
          </div>
          
          {/* 실제 파일 버튼 */}
          <input
            title="파일 입력" 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/png, image/jpeg"
            className="hidden" 
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-14 px-8 border border-[var(--color-mint-0)] bg-[var(--color-mint-6)] text-[var(--color-mint-1)] rounded-sm body-b1-rg hover:brightness-95 transition-all"
          >
            파일 선택
          </button>
        </div>
        <p className="mt-2 text-[var(--color-gray-50)] body-b1-rg">
          * 이미지는 10MB 이하의 PNG 혹은 JPEG만 업로드 가능합니다. (최대 4장)
        </p>

        {/* 선택된 이미지 미리보기 */}
        {selectedFiles.length > 0 && (
          <div className="flex gap-3 mt-4">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="relative w-25 h-25 rounded-[1rem] border border-[var(--color-line-gray-40)] overflow-hidden flex items-center justify-center"
              >
                {/* 미리보기 이미지 */}
                <img 
                  src={URL.createObjectURL(file)} 
                  alt={`선택 이미지 ${idx + 1}`} 
                  className="w-full h-full object-cover rounded-[1rem]"
                />

                {/* 삭제 버튼 */}
                <button
                  type="button"
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-[#FF00BF] text-[1rem] rounded-full flex items-center justify-center hover:bg-gray-700 transition-all"
                  onClick={() => {
                    setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}


      </div>

      {/* 4. 하단 버튼 */}
      <div className="flex justify-center">
        <div className="flex justify-center">
          <Button
            size="big"
            variant={content.length > 0 && rating > 0 ? 'primary' : 'disabled'}
            onClick={handleSubmit}
            className='!px-8 !py-5'
          >
            후기 등록하기
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ReviewWritePage;