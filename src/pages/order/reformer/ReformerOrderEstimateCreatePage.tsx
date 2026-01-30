import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/common/button/button1_tmp';
import pinkXIcon from '../../../assets/icons/pinkX.svg';
import uploadIcon from '../../../assets/icons/upload.svg';
import mailIcon from '../../../assets/icons/mail.svg';

const ReformerOrderEstimateCreatePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [estimateAmount, setEstimateAmount] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('');
  const [description, setDescription] = useState('');
  const [workPeriod, setWorkPeriod] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // TODO: 실제 API에서 받아올 데이터
  const recipientName = '핑크핑크퐁';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 10 - images.length);
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const isButtonEnabled =
    images.length > 0 &&
    estimateAmount.trim() !== '' &&
    deliveryFee.trim() !== '' &&
    description.trim() !== '' &&
    workPeriod.trim() !== '';

  const handleSubmit = () => {
    // TODO: API 호출
    console.log({
      images,
      estimateAmount,
      deliveryFee,
      description,
      workPeriod,
    });
    setIsSubmitted(true);
  };

  const handleCheckEstimate = () => {
    // 보낸 견적서 확인하기
    navigate(`/reformer/order/requests/${id}`);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // 성공 화면
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex justify-center bg-white pt-20">
        <div className="flex flex-col items-center w-full max-w-2xl px-4">
          {/* 편지 아이콘 */}
          <div className="w-60 h-60 mb-8 flex items-center justify-center">
            <img src={mailIcon} alt="편지" className="w-60 h-60" />
          </div>

          {/* 텍스트 */}
          <div className="flex items-center gap-2">
            <p className="heading-h2-bd text-[var(--color-mint-1)]">{recipientName}</p>
            <p className="heading-h2-bd text-[var(--color-black)] ">님께</p>
          </div>
          <p className="heading-h2-bd text-[var(--color-black)] mb-12">견적서를 전송했어요!</p>

          {/* 버튼들 */}
          <div className="flex gap-4 w-full">
            <Button
              variant="primary"
              onClick={handleCheckEstimate}
              className="flex-1"
            >
              보낸 견적서 확인하기
            </Button>
            <Button
              variant="outlined-mint"
              onClick={handleGoHome}
              className="flex-1"
            >
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-28 mx-auto py-13 bg-white text-gray-800">
    

      {/* 페이지 제목 */}
      <h1 className="heading-h2-bd pb-6 border-b mb-8 border-[black]">리폼 견적서 작성하기</h1>

      {/* Step 1: 이미지 등록 */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 1.</h2>
            <p className="body-b0-rg mt-4">
              이미지 등록 ({images.length}/10) <span className="text-[var(--color-red-1)]">*</span>
            </p>
          </div>
          <div className="w-3/4">
            <div className="flex flex-wrap gap-4">
              <input
                type="file"
                accept="image/png,image/jpeg"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              {images.map((image, index) => (
                <div key={index} className="relative w-36 h-36 rounded-[0.75rem] overflow-hidden border border-[var(--color-gray-40)] group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`업로드 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-[var(--color-mint-0)] text-white body-b3-sb px-2 py-0.5 rounded-[6.25rem]">
                      대표
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 hover:opacity-80 transition"
                  >
                    <img src={pinkXIcon} alt="삭제" className="w-10 h-10" />
                  </button>
                </div>
              ))}
              {images.length < 10 && (
                <label
                  htmlFor="image-upload"
                  className="w-36 h-36 rounded-lg border border-[var(--color-gray-40)] bg-[var(--color-gray-20)] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                >
                  <img src={uploadIcon} alt="업로드" className="w-10 h-10" />
                  <span className="body-b3-rg text-[var(--color-gray-50)] mt-2 text-center">이미지 업로드</span>
                </label>
              )}
            </div>
            <p className="body-b1-rg text-[var(--color-gray-50)] mt-3">
              *이미지는 10MB 이하의 PNG 혹은 JPEG만 업로드 가능합니다.
            </p>
          </div>
        </div>
      </section>
      <hr className="mt-8 mb-12 border-[var(--color-line-gray-40)]" />

      {/* Step 2: 견적 금액 및 배송비 */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 2.</h2>
            <p className="body-b0-rg mt-4">견적 금액 및 배송비 <span className="text-[var(--color-red-1)]">*</span></p>
          </div>
          <div className="w-3/4 space-y-4 pr-26">
            <div className="flex items-center border border-[var(--color-gray-60)]  relative">
              <input
                type="number"
                value={estimateAmount}
                onChange={(e) => setEstimateAmount(e.target.value)}
                placeholder="견적 금액을 입력해주세요."
                className="placeholder:text-[var(--color-gray-50)] w-full body-b1-rg py-5 pl-5 pr-12 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-5 body-b1-rg text-[var(--color-gray-50)]">원</span>
            </div>
            <div className="flex items-center border border-[var(--color-gray-60)]  relative">
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                placeholder="배송비를 입력해주세요."
                className="placeholder:text-[var(--color-gray-50)] w-full body-b1-rg py-5 pl-5 pr-12 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-5 body-b1-rg text-[var(--color-gray-50)]">원</span>
            </div>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      {/* Step 3: 상세 내용 작성 */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 3.</h2>
            <p className="body-b0-rg mt-4">
              상세 내용 작성 <span className="text-[var(--color-red-1)]">*</span>
            </p>
          </div>
          <div className="w-3/4 flex items-end gap-2 pr-7">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
              placeholder="본인이 원하는 리폼 스타일, 방식, 희망 예산 등을 구체적으로 설명해주세요."
              rows={8}
              className="placeholder:text-[var(--color-gray-50)] flex-1 border border-[var(--color-gray-60)] body-b1-rg py-5 pl-5 pr-3 focus:outline-none resize-none"
            />
            <span className="body-b1-rg text-[var(--color-gray-60)] whitespace-nowrap">{description.length}/1000자</span>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />

    
      

      {/* Step 4: 예상 작업 기간 */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 4.</h2>
            <p className="body-b0-rg mt-4">예상 작업 기간 <span className="text-[var(--color-red-1)]">*</span></p>
          </div>
          <div className="w-3/4 pr-26">
            <div className="flex items-center border border-[var(--color-gray-60)]  relative">
              <input
                type="number"
                value={workPeriod}
                onChange={(e) => setWorkPeriod(e.target.value)}
                placeholder="예상되는 작업 소요 기간을 기재해주세요."
                className="placeholder:text-[var(--color-gray-50)] w-full body-b1-rg py-5 pl-5 pr-16 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-5 body-b1-rg text-[var(--color-gray-50)]">일 이내</span>
            </div>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      {/* 유의사항 */}
      <section className="mb-6">
        <div className="flex">
          <div className="w-1/4">
            <h3 className="body-b0-rg text-[var(--color-black)]">유의사항</h3>
          </div>
          <div className="w-3/4 body-b0-rg text-[var(--color-gray-50)] pr-25">
            <p className="mb-4">
              잠깐! 제안을 보내기 전에 확인해보세요.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>
                  타인의 저작물 (예시 이미지 등)을 무단으로 캡쳐하여 업로드하는 것을 금지합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>보낸 견적서는 채팅방에서 확인할 수 있어요.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>
                  3일 이내 승인/거절 여부를 채팅방을 통해 받을 수 있어요.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>
                  구체적인 설명(제안 스타일, 참고 이미지 등)을 작성할수록 견적 수락 확률이 높아집니다.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />


      {/* 전송하기 버튼 */}
      <div className="flex justify-end">
        <Button
          variant={isButtonEnabled ? 'primary' : 'disabled'}
          size="default"
          onClick={handleSubmit}
          className="px-12 min-w-[200px]"
        >
          전송하기
        </Button>
      </div>
    </div>
  );
};

export default ReformerOrderEstimateCreatePage;
