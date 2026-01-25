import { useState, useRef } from 'react';
import logo2 from '../../../assets/logos/logo2.svg';
import Button from '../../../components/common/Button/button1';
import ProgressIndicator from '../../../components/common/ProgressIndicator/ProgressIndicator';

type ImageType = {
  file: File;
  preview: string;
};

const ReformerRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<ImageType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index);
      // URL 해제
      URL.revokeObjectURL(prev[index].preview);
      return newImages;
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleNextStep = () => {
    if (currentStep === 1 && images.length === 0) {
      alert('리폼 작업물 사진을 업로드해주세요.');
      return;
    }
    // TODO: 다음 단계로 이동하는 로직 구현
    setCurrentStep(currentStep + 1);
  };

  const isNextButtonEnabled = currentStep === 1 ? images.length > 0 : true;

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-[3.1875rem] pb-[7.5rem]">
      {/* 로고 및 제목 */}
      <div className="flex flex-col items-center mb-[2.19rem]">
        <div className="mb-[2.1875rem]">
          <img src={logo2} alt="내폼리폼 로고" className="h-[5.46875rem]" />
        </div>
        <h1 className="heading-h4-bd text-center text-[var(--color-black)]">
          <p className="mb-0">간단한 리폼러 신청으로</p>
          <p>활동 등록이 가능해요!</p>
        </h1>
      </div>

      {/* 진행 단계 표시 */}
      <ProgressIndicator
        totalSteps={3}
        currentStep={currentStep}
        className="mb-[2.625rem]"
      />

      {/* Step 1: 이미지 업로드 */}
      {currentStep === 1 && (
        <div className=" flex flex-col items-center">
          <div className="flex flex-col items-center gap-[0.8125rem] mb-[3.375rem]">
            <h2 className="heading-h5-sb text-[var(--color-black)]">Step 1</h2>
            <p className="body-b1-md text-[var(--color-black)] text-center">
              [필수] 리폼러 본인이 제작한 리폼 작업물 사진을 업로드 해주세요!
            </p>
          </div>

          {/* 이미지 업로드 영역 */}
          <div className="w-full mb-[3.75rem]">
            {/* 업로드된 이미지가 있을 때 */}
            {images.length > 0 ? (
              <div className="flex flex-col gap-[1.25rem]">
                <div className="flex flex-wrap gap-[0.625rem]">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-[8.75rem] h-[8.75rem] rounded-[1.25rem] overflow-hidden border border-[var(--color-gray-30)]"
                    >
                      <img
                        src={img.preview}
                        alt={`업로드된 이미지 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-[0.3125rem] right-[0.3125rem] w-[1.875rem] h-[1.875rem] bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                      >
                        <span className="text-white text-[0.875rem]">×</span>
                      </button>
                    </div>
                  ))}
                </div>
                {images.length < 10 && (
                  <button
                    onClick={handleUploadClick}
                    className="w-full h-[18.05625rem] bg-[var(--color-gray-30)] rounded-[1.25rem] flex flex-col items-center justify-center gap-[0.3125rem] hover:bg-[var(--color-gray-40)] transition-colors border-2 border-dashed border-[var(--color-gray-40)]"
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 5V19M5 12H19"
                        stroke="#646F7C"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="body-b5-rg text-[var(--color-gray-50)]">
                      이미지 추가
                    </p>
                  </button>
                )}
              </div>
            ) : (
              /* 업로드된 이미지가 없을 때 */
              <button
                onClick={handleUploadClick}
                className="w-full h-[18.05625rem] bg-[var(--color-gray-30)] rounded-[1.25rem] flex flex-col items-center justify-center gap-[0.3125rem] hover:bg-[var(--color-gray-40)] transition-colors border-2 border-dashed border-[var(--color-gray-40)]"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15"
                    stroke="#646F7C"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="body-b5-rg text-[var(--color-gray-50)]">
                  이미지 업로드
                </p>
              </button>
            )}

            {/* 숨겨진 파일 입력 */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>

          {/* 다음 단계 버튼 */}
          <Button
            variant={isNextButtonEnabled ? 'primary' : 'disabled'}
            size="big"
            onClick={handleNextStep}
            disabled={!isNextButtonEnabled}
            className="w-full"
          >
            다음 단계로 넘어가기
          </Button>
        </div>
      )}

      {/* Step 2: 자기소개 */}
      {currentStep === 2 && (
        <div className="w-[28.125rem] flex flex-col items-center">
          <div className="flex flex-col items-center gap-[0.8125rem] mb-[3.375rem]">
            <h2 className="heading-h5-sb text-[var(--color-black)]">Step 2</h2>
            <p className="body-b1-md text-[var(--color-black)] text-center">
              [필수] 간단한 자기소개와 본인 작업물에 대해 설명해주세요!
            </p>
          </div>

          <textarea
            className="w-full h-[18.75rem] p-[1.25rem] border border-[var(--color-gray-30)] rounded-[0.625rem] body-b1-rg text-[var(--color-black)] resize-none focus:outline-none focus:border-[var(--color-mint-0)]"
            placeholder="자기소개와 작업물에 대해 설명해주세요..."
          />

          <div className="mt-[3.75rem] w-full">
            <Button
              variant="primary"
              size="big"
              onClick={handleNextStep}
              className="w-full"
            >
              다음 단계로 넘어가기
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: 사업자 등록번호 */}
      {currentStep === 3 && (
        <div className="w-[28.125rem] flex flex-col items-center">
          <div className="flex flex-col items-center gap-[0.8125rem] mb-[3.375rem]">
            <h2 className="heading-h5-sb text-[var(--color-black)]">Step 3</h2>
            <p className="body-b1-md text-[var(--color-black)] text-center">
              [선택] 사업자인 경우, 사업자 등록번호를 입력해주세요.
            </p>
          </div>

          <div className="w-full flex flex-col gap-[1.25rem] mb-[3.75rem]">
            <input
              type="text"
              placeholder="사업자 등록번호를 입력해주세요."
              className="w-full h-[3.75rem] px-[1.25rem] border border-[var(--color-gray-30)] rounded-[0.625rem] body-b1-rg text-[var(--color-black)] focus:outline-none focus:border-[var(--color-mint-0)]"
            />

            <div className="flex items-center gap-[0.625rem]">
              <input
                type="checkbox"
                id="agreement"
                className="w-[1.25rem] h-[1.25rem] accent-[var(--color-mint-0)]"
              />
              <label
                htmlFor="agreement"
                className="body-b1-rg text-[var(--color-black)]"
              >
                [필수] 내폼리폼 이용약관에 동의합니다.{' '}
                <span className="text-[var(--color-mint-0)] underline cursor-pointer">
                  약관보기
                </span>
              </label>
            </div>
          </div>

          <Button variant="primary" size="big" className="w-full">
            제출하기
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReformerRegistration;
