import React, { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { uploadImages } from '@/api/upload';
import { createChatRequest } from '@/api/chat/chatRequestApi';

interface RequestImage {
  file: File;
  preview: string;
}

interface ChatRequestFormData {
  images: RequestImage[];
  title: string;
  maxBudget: string;
  minBudget: string;
  content: string;
}

const ChatRequestFormPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const { chatRoomId } = useParams<{ chatRoomId: string }>();

  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const requestData = null; // edit 대비용 (지금은 안 씀)

  const [formData, setFormData] = useState<ChatRequestFormData>({
    images: [],
    title: '',
    maxBudget: '',
    minBudget: '',
    content: '',
  });

  const MAX_IMAGES = 10;

  // 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: RequestImage[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, MAX_IMAGES),
    }));

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (field: keyof ChatRequestFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormComplete =
    formData.images.length > 0 &&
    formData.title.trim() !== '' &&
    formData.maxBudget.trim() !== '' &&
    formData.minBudget.trim() !== '' &&
    formData.content.trim() !== '';

  // 제출
  const handleSubmit = async () => {
    if (!isFormComplete || !chatRoomId) return;

    try {
      // 1. 이미지 업로드
      const files = formData.images.map((img) => img.file);
      const uploadRes = await uploadImages(files);

      if (uploadRes.resultType !== 'SUCCESS') {
        throw new Error('이미지 업로드 실패');
      }

      const imageUrls = uploadRes.success.url;

      // payload는 flat
      const payload = {
        chatRoomId,
        image: imageUrls,
        title: formData.title,
        content: formData.content,
        minBudget: Number(formData.minBudget),
        maxBudget: Number(formData.maxBudget),
      };



      if (mode === 'create') {
        const res = await createChatRequest(payload);

        if (res.data.resultType === 'SUCCESS') {
          alert('요청서가 전송되었습니다!');
          navigate(`/chat/normal/${chatRoomId}`);
        }
      }
      // edit 모드 API 호출은 지금 하지 않음
    } catch (error) {
      console.error(error);
      alert('요청서 전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white text-gray-800">
      <h1 className="heading-h2-bd text-black mb-10 pb-6 border-b border-black">
        {mode === 'edit' ? '리폼 요청서 수정하기' : '리폼 요청서 작성하기'}
      </h1>

      <div className="space-y-12">
        {/* Step 1: 이미지 업로드 */}
        <section className="mb-10">
          <div className="flex gap-8">
            <div className="w-48">
              <h2 className="body-b0-md">Step 1.</h2>
              <p className="body-b0-rg mt-1">
                이미지 등록 ({formData.images.length}/{MAX_IMAGES}) <span className="text-red-500">*</span>
              </p>
            </div>
            <div className="w-3/4">
              <div className="flex flex-wrap gap-4">
                <input
                  title="사진 첨부"
                  type="file"
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
                        <path d="M9 25.5882V28.2941C9 29.0118 9.28973 29.7 9.80546 30.2075C10.3212 30.7149 11.0207 31 11.75 31H28.25C28.9793 31 29.6788 30.7149 30.1945 30.2075C30.7103 29.7 31 29.0118 31 28.2941V25.5882M13.125 14.7647L20 8M20 8L26.875 14.7647M20 8V24.2353" stroke="#646F7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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

        {/* Step 2: 제목 */}
        <section className="flex flex-col md:flex-row pt-10 gap-8 border-t border-[var(--color-line-gray-40)]">
          <div className="w-48 pt-2">
            <h2 className="body-b0-md">Step 2.</h2>
            <p className="body-b0-rg text-black">요청글 제목 <span className="text-red-500">*</span></p>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="요청글 제목을 입력해주세요."
              className="w-[55rem] p-4 body-b1-rg border border-[var(--color-gray-60)]"
            />
          </div>
        </section>

        {/* Step 3: 상세 내용 */}
        <section className="flex flex-col md:flex-row gap-8 pt-10 border-t border-[var(--color-line-gray-40)]">
          <div className="w-48 pt-2">
            <h2 className="body-b0-md">Step 3.</h2>
            <p className="body-b0-rg text-black">상세 내용 작성<span className="text-red-500"> *</span></p>
          </div>
          <div className="flex-1 relative">
            <textarea
              rows={10}
              maxLength={1000}
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="본인이 원하는 리폼 스타일, 방식, 희망 예산 등을 구체적으로 설명해주세요."
              className="w-[55rem] body-b1-rg p-5 border border-black placeholder:text-[var(--color-gray-50)]"
            />
            <span className="absolute bottom-2 right-6 body-b1-rg text-[var(--color-gray-60)]">
              {formData.content.length}/1000자
            </span>
          </div>
        </section>

        {/* Step 4: 희망 예산 */}
        <section className="flex flex-col gap-8 md:flex-row pt-10 border-t border-[var(--color-line-gray-40)]">
          <div className="w-48 pt-2">
            <h2 className="body-b0-md">Step 4.</h2>
            <p className="body-b0-rg text-black">희망 예산<span className="text-red-500"> *</span></p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-[20rem]">
              <input
                type="text"
                value={formData.minBudget}
                onChange={(e) => handleChange('minBudget', e.target.value)}
                placeholder="최소 예산을 기입해주세요."
                className="w-full p-4 body-b1-rg border border-[var(--color-gray-60)] placeholder:text-[var(--color-gray-50)]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 body-b1-rg">원</span>
            </div>

            <span className="body-b1-rg text-gray-500">~</span>

            <div className="relative w-[20rem]">
              <input
                type="text"
                value={formData.maxBudget}
                onChange={(e) => handleChange('maxBudget', e.target.value)}
                placeholder="최대 예산을 기입해주세요."
                className="w-full p-4 body-b1-rg border border-[var(--color-gray-60)] placeholder:text-[var(--color-gray-50)]"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 body-b1-rg">원</span>
            </div>
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
            ${
              isFormComplete
                ? 'bg-[var(--color-mint-1)] text-white cursor-pointer'
                : 'bg-[var(--color-line-gray-30)] text-[var(--color-gray-50)] cursor-not-allowed'
            }
            transition-colors
          `}
        >
          {mode === 'edit' ? '수정하기' : '전송하기'}
        </button>
      </div>
    </div>
  );
};

export default ChatRequestFormPage;
