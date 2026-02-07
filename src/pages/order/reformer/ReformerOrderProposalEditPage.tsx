import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/common/button/Button1';
import Breadcrumb from '../../../components/common/breadcrumb/Breadcrumb';
import pinkXIcon from '../../../assets/icons/pinkX.svg';
import uploadIcon from '../../../assets/icons/upload.svg';
import {
  useReformerOrderProposalEdit,
  useProposalEditForm,
} from '../../../hooks/domain/order/useReformerOrderProposalEdit';
import type { ProposalEditFormProps } from '../../../types/domain/order/proposalEdit';

const ProposalEditForm = ({ id, initialData, onSuccess }: ProposalEditFormProps) => {
  const {
    images,
    quotationAmount,
    setQuotationAmount,
    deliveryFee,
    setDeliveryFee,
    description,
    setDescription,
    workPeriod,
    setWorkPeriod,
    submitError,
    isSubmitting,
    isButtonEnabled,
    handleImageUpload,
    handleRemoveImage,
    handleSubmit,
  } = useProposalEditForm({ id, initialData, onSuccess });

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '주문제작', path: '/reformer/order' },
    { label: '리폼 제안', path: '/reformer/order/proposals' },
    { label: '제안서 수정' },
  ];

  return (
    <div className="w-full px-4 md:px-28 mx-auto py-13 bg-white text-gray-800">
      <div className="body-b1-rg text-[var(--color-gray-60)] mb-4">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <h1 className="heading-h2-bd pb-6 border-b mb-8 border-[black]">
        리폼 제안서 수정하기
      </h1>

      <section className="mb-10">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h2 className="body-b0-md">Step 1.</h2>
            <p className="body-b0-rg mt-4">
              유니폼 이미지 등록 ({images.length}/10){' '}
              <span className="text-[var(--color-red-1)]">*</span>
            </p>
          </div>
          <div className="w-full md:w-3/4">
            <div className="flex flex-wrap gap-4">
              <input
                type="file"
                accept="image/png,image/jpeg"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id={`image-upload-${id}`}
              />
              {images.map((item, index) => (
                <div
                  key={index}
                  className="relative w-36 h-36 rounded-[0.75rem] overflow-hidden border border-[var(--color-gray-40)] group"
                >
                  {item.type === 'url' ? (
                    <img
                      src={item.url}
                      alt={`이미지 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={URL.createObjectURL(item.file)}
                      alt={`업로드 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
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
                  htmlFor={`image-upload-${id}`}
                  className="w-36 h-36 rounded-lg border border-[var(--color-gray-40)] bg-[var(--color-gray-20)] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                >
                  <img src={uploadIcon} alt="업로드" className="w-10 h-10" />
                  <span className="body-b3-rg text-[var(--color-gray-50)] mt-2 text-center">
                    이미지 업로드
                  </span>
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

      <section className="mb-10">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h2 className="body-b0-md">Step 2.</h2>
            <p className="body-b0-rg mt-4">
              견적 금액 및 배송비 <span className="text-[var(--color-red-1)]">*</span>
            </p>
          </div>
          <div className="w-full md:w-3/4 space-y-4 pr-0 md:pr-26">
            <div className="flex items-center border border-[var(--color-gray-60)] relative">
              <input
                type="number"
                value={quotationAmount}
                onChange={(e) => setQuotationAmount(e.target.value)}
                placeholder="견적 금액을 입력해주세요."
                className="placeholder:text-[var(--color-gray-50)] w-full body-b1-rg py-5 pl-5 pr-12 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-5 body-b1-rg text-[var(--color-gray-50)]">
                원
              </span>
            </div>
            <div className="flex items-center border border-[var(--color-gray-60)] relative">
              <input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(e.target.value)}
                placeholder="배송비를 입력해주세요."
                className="placeholder:text-[var(--color-gray-50)] w-full body-b1-rg py-5 pl-5 pr-12 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-5 body-b1-rg text-[var(--color-gray-50)]">
                원
              </span>
            </div>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      <section className="mb-10">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h2 className="body-b0-md">Step 3.</h2>
            <p className="body-b0-rg mt-4">
              상세 내용 작성 <span className="text-[var(--color-red-1)]">*</span>
            </p>
          </div>
          <div className="w-full md:w-3/4 flex flex-col md:flex-row md:items-end gap-2 pr-0 md:pr-7">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
              placeholder="상세 제안 내용을 입력해주세요."
              rows={8}
              className="placeholder:text-[var(--color-gray-50)] flex-1 border border-[var(--color-gray-60)] body-b1-rg py-5 pl-5 pr-3 focus:outline-none resize-none"
            />
            <span className="body-b1-rg text-[var(--color-gray-60)] whitespace-nowrap">
              {description.length}/1000자
            </span>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      <section className="mb-10">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h2 className="body-b0-md">Step 4.</h2>
            <p className="body-b0-rg mt-4">
              예상 작업 기간 <span className="text-[var(--color-red-1)]">*</span>
            </p>
          </div>
          <div className="w-full md:w-3/4 pr-0 md:pr-26">
            <div className="flex items-center border border-[var(--color-gray-60)] relative">
              <input
                type="number"
                value={workPeriod}
                onChange={(e) => setWorkPeriod(e.target.value)}
                placeholder="예상되는 작업 소요 기간을 기재해주세요."
                className="placeholder:text-[var(--color-gray-50)] w-full body-b1-rg py-5 pl-5 pr-16 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="absolute right-5 body-b1-rg text-[var(--color-gray-50)]">
                일 이내
              </span>
            </div>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      <section className="mb-6">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="body-b0-rg text-[var(--color-black)]">유의사항</h3>
          </div>
          <div className="w-full md:w-3/4 body-b0-rg text-[var(--color-gray-50)] pr-0 md:pr-25">
            <p className="mb-4">잠깐! 제안을 보내기 전에 확인해보세요.</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>
                  타인의 저작물 (예시 이미지 등)을 무단으로 캡쳐하여 업로드하는
                  것을 금지합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>보낸 견적서는 채팅방에서 확인할 수 있어요.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>3일 이내 승인/거절 여부를 채팅방을 통해 받을 수 있어요.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>
                  구체적인 설명(제안 스타일, 참고 이미지 등)을 작성할수록 견적
                  수락 확률이 높아집니다.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      {submitError && (
        <p className="body-b1-rg text-[var(--color-red-1)] mb-4">{submitError}</p>
      )}

      <div className="flex justify-end">
        <Button
          variant={isButtonEnabled && !isSubmitting ? 'primary' : 'disabled'}
          size="default"
          onClick={handleSubmit}
          disabled={!isButtonEnabled || isSubmitting}
          className="px-12 min-w-[200px]"
        >
          {isSubmitting ? '수정 중...' : '수정하기'}
        </Button>
      </div>
    </div>
  );
};

const ReformerOrderProposalEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { proposalDetail, isLoading, isError } = useReformerOrderProposalEdit({
    id: id ?? undefined,
  });

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="body-b1-rg text-[var(--color-gray-60)]">제안 정보가 없어요.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="body-b1-rg text-[var(--color-gray-60)]">
          제안서 정보를 불러오는 중...
        </p>
      </div>
    );
  }

  if (isError || !proposalDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white px-4">
        <p className="body-b1-rg text-[var(--color-gray-60)]">
          제안서를 불러오지 못했어요.
        </p>
        <Button
          variant="outlined-mint"
          onClick={() => navigate('/reformer/order/proposals')}
        >
          제안 목록으로
        </Button>
      </div>
    );
  }

  return (
    <ProposalEditForm
      key={id}
      id={id}
      initialData={proposalDetail}
      onSuccess={() => navigate(`/reformer/order/proposals/${id}`)}
    />
  );
};

export default ReformerOrderProposalEditPage;
