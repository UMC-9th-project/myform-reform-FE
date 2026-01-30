import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo2 from '../../../assets/logos/logo2.svg';
import plus from '../../../assets/icons/plus.svg';
import share from '../../../assets/icons/share.svg';
import Button from '../../../components/common/button/button1';
import ProgressIndicator from '../../../components/common/ProgressIndicator/ProgressIndicator';
import Checkbox from '../../../components/common/Checkbox/Checkbox';

type ImageType = {
  file: File;
  preview: string;
};

const ReformerRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<ImageType[]>([]);
  const [introduction, setIntroduction] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);
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
    if (currentStep === 2 && !introduction.trim()) {
      alert('자기소개와 본인 작업물에 대해 설명해주세요.');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = () => {
    if (!agreementChecked) {
      alert('이용약관에 동의해주세요.');
      return;
    }
    navigate('/signup/reformer-complete');
  };

  const isNextButtonEnabled = currentStep === 1 ? images.length > 0 : currentStep === 2 ? introduction.trim().length > 0 : true;

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-[3.1875rem] pb-[7.5rem]">
      
      <div className="flex flex-col items-center mb-[2.19rem]">
        <div className="mb-[2.1875rem]">
          <img src={logo2} alt="내폼리폼 로고" className="h-[5.46875rem]" />
        </div>
        <h1 className="heading-h4-bd text-center text-[var(--color-black)]">
          <p className="mb-0">간단한 리폼러 신청으로</p>
          <p>활동 등록이 가능해요!</p>
        </h1>
      </div>

    
      <ProgressIndicator
        totalSteps={3}
        currentStep={currentStep}
        barWidth="w-[9.21875rem]"
        leftBarWidth="w-[3.21875rem]"
        rightBarWidth="w-[3.21875rem]"
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

         
          <div className="w-[54.5rem] mb-[3.75rem]  ">
            {images.length === 0 ? (
             
              <button
                onClick={handleUploadClick}
                className="w-[27.6875rem] h-[18.05625rem] mx-auto bg-[var(--color-gray-30)] rounded-[1.25rem] flex flex-col items-center justify-center gap-[0.3125rem] hover:bg-[var(--color-gray-40)] transition-colors"
              >
               <img src={share} alt="shape"  />
                <p className="body-b2-rg text-[var(--color-gray-50)]">
                  이미지 업로드
                </p>
              </button>
            ) : (
              
              <div className="flex flex-wrap gap-y-[1.6875rem] gap-x-[1.5rem]">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-[12.5rem] h-[12.5rem] rounded-[0.9375rem] overflow-hidden"
                  >
                    <img
                      src={img.preview}
                      alt={`업로드된 이미지 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-[0.3125rem] right-[0.3125rem] w-[1.875rem] h-[1.875rem] bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <span className="text-white text-[0.875rem]">×</span>
                    </button>
                  </div>
                ))}
              
                {images.length < 8 && (
                  <button
                    onClick={handleUploadClick}
                    className="w-[12.5rem] h-[12.5rem] bg-[var(--color-gray-30)] rounded-[0.9375rem] flex flex-col items-center justify-center gap-[0.125rem] hover:bg-[var(--color-gray-40)] transition-colors border-2 border-dashed border-[var(--color-gray-40)]"
                  >
                    <img src={plus} alt="plus" />
                    <p className="body-b2-rg text-[var(--color-gray-50)]">
                      추가
                    </p>
                  </button>
                )}
              </div>
            )}

        
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>

         
          <Button
            variant={isNextButtonEnabled ? 'primary' : 'disabled'}
            size="big"
            onClick={handleNextStep}
            disabled={!isNextButtonEnabled}
            className="w-[33.9375rem] h-[4.625rem]"
          >
            다음 단계로 넘어가기
          </Button>
        </div>
      )}

      {/* Step 2: 자기소개 */}
      {currentStep === 2 && (
        <div className="w-[33.9375rem] flex flex-col items-center">
          <div className="flex flex-col items-center gap-[0.8125rem] mb-[3.375rem]">
            <h2 className="heading-h5-sb text-[var(--color-black)]">Step 2</h2>
            <p className="body-b1-md text-[var(--color-black)] text-center">
              [필수] 간단한 자기소개와 본인 작업물에 대해 설명해주세요!
            </p>
          </div>

          <div className="w-full mb-[3.75rem]">
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              className="w-full h-[16.9375rem] bg-[var(--color-gray-30)] rounded-[0.625rem] p-[1.375rem] body-b2-rg text-[var(--color-gray-50)] resize-none focus:outline-none focus:border focus:border-[var(--color-mint-0)]"
              placeholder="자기소개와 본인작업물에 대해 설명해주세요.(최대 500자)"
              maxLength={500}
            />
          </div>

          <Button
            variant={isNextButtonEnabled ? 'primary' : 'disabled'}
            size="big"
            onClick={handleNextStep}
            disabled={!isNextButtonEnabled}
            className="w-[33.9375rem] h-[4.625rem]"
          >
            다음 단계로 넘어가기
          </Button>
        </div>
      )}

      {/* Step 3: 사업자 등록번호 */}
      {currentStep === 3 && (
        <div className="w-[33.9375rem] flex flex-col items-center">
          <div className="flex flex-col items-center gap-[0.8125rem] mb-[3.375rem]">
            <h2 className="heading-h5-sb text-[var(--color-black)]">Step 3</h2>
            <p className="body-b1-md text-[var(--color-black)] text-center w-[24.25rem]">
              [선택] 사업자인 경우, 사업자 등록번호를 입력해주세요!
            </p>
          </div>

          <div className="w-[24.25rem] flex flex-col gap-[0.6875rem] mb-[1.5625rem]">
            <p className="body-b1-rg text-[var(--color-black)]">사업자 등록번호</p>
            <input
              type="text"
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value)}
              placeholder="사업자 등록번호를 입력해주세요."
              className="w-full h-[4.625rem] px-[1.4375rem] py-[1.375rem] bg-white border border-[var(--color-gray-40)] rounded-[0.9375rem] body-b1-rg text-[var(--color-black)] focus:outline-none focus:border-[var(--color-mint-0)]"
            />
          </div>

          <div className="w-full flex flex-col gap-[0.9375rem] mb-[3.75rem]">
            <p className="body-b0-bd text-[var(--color-black)]">리폼러 이용약관 동의</p>
            <div className="border-t border-[var(--color-gray-40)] pt-[1.25rem]">
              <div className="flex items-start gap-[1.25rem] px-[1.25rem] py-[0.9375rem]">
                <Checkbox
                  checked={agreementChecked}
                  onChange={setAgreementChecked}
                  variant="circle"
                  size="large"
                />
                <div className="flex items-center gap-[2.0625rem] body-b1-rg text-[var(--color-black)]">
                  <span>
                    [필수] 내폼리폼 리폼러 이용약관에 동의합니다.
                  </span>
                  <span className="text-[var(--color-mint-1)] underline cursor-pointer">
                    약관보기
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="big"
            onClick={handleSubmit}
            className="w-[33.9375rem] h-[4.625rem]"
          >
            제출하기
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReformerRegistration;
