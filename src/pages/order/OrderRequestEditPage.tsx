import Button from '../../components/common/button/Button1';
import Calendar from '../../components/common/editor/Calendar';
import CategorySelect from '../../components/common/editor/CategorySelect';
import calendarIcon from '../../assets/icons/calendar.svg';
import pinkXIcon from '../../assets/icons/pinkX.svg';
import uploadIcon from '../../assets/icons/upload.svg';
import { useOrderRequestEdit } from '../../hooks/domain/order/useOrderRequestEdit';

const OrderRequestEditPage = () => {
  const {
    id,
    detail,
    isLoading,
    isError,
    isOwner,
    isFormReady,
    existingImageUrls,
    newImageFiles,
    totalImageCount,
    canAddMoreImages,
    title,
    setTitle,
    description,
    setDescription,
    minBudget,
    setMinBudget,
    maxBudget,
    setMaxBudget,
    deadline,
    setDeadline,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    showCalendar,
    setShowCalendar,
    isSubmitting,
    submitError,
    isButtonEnabled,
    handleAddNewImages,
    handleRemoveExistingImage,
    handleRemoveNewImage,
    handleSubmit,
    formatDate,
  } = useOrderRequestEdit();

  if (!id) {
    return (
      <div className="w-full px-28 mx-auto py-13">
        <p className="body-b1-rg text-[var(--color-gray-60)]">요청 ID가 없습니다.</p>
      </div>
    );
  }

  if (isLoading || !isFormReady) {
    return (
      <div className="w-full px-28 mx-auto py-13">
        <p className="body-b1-rg text-[var(--color-gray-60)]">불러오는 중...</p>
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="w-full px-28 mx-auto py-13">
        <p className="body-b1-rg text-[var(--color-gray-60)]">
          요청서를 불러오지 못했어요.
        </p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="w-full px-28 mx-auto py-13">
        <p className="body-b1-rg text-[var(--color-gray-60)]">
          본인이 작성한 요청만 수정할 수 있어요.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-28 mx-auto py-13 bg-white text-gray-800">
      <h1 className="heading-h2-bd pb-6 border-b mb-8 border-[black]">
        리폼 요청글 수정하기
      </h1>

      {/* Step 1: 이미지 등록 */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 1.</h2>
            <p className="body-b0-rg mt-4">
              이미지 등록 ({totalImageCount}/10) <span className="text-[var(--color-red-1)]">*</span>
            </p>
          </div>
          <div className="w-3/4">
            <div className="flex flex-wrap gap-4">
              <input
                type="file"
                accept="image/png,image/jpeg"
                multiple
                onChange={handleAddNewImages}
                className="hidden"
                id="image-upload-edit"
              />
              {existingImageUrls.map((url, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative w-36 h-36 rounded-[0.75rem] overflow-hidden border border-[var(--color-gray-40)] group"
                >
                  <img src={url} alt={`이미지 ${index + 1}`} className="w-full h-full object-cover" />
                  {index === 0 && (
                    <span className="absolute top-2 left-2 bg-[var(--color-mint-0)] text-white body-b3-sb px-2 py-0.5 rounded-[6.25rem]">
                      대표
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-1 right-1 hover:opacity-80 transition"
                  >
                    <img src={pinkXIcon} alt="삭제" className="w-10 h-10" />
                  </button>
                </div>
              ))}
              {newImageFiles.map((file, index) => (
                <div
                  key={`new-${index}`}
                  className="relative w-36 h-36 rounded-[0.75rem] overflow-hidden border border-[var(--color-gray-40)] group"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`새 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-1 right-1 hover:opacity-80 transition"
                  >
                    <img src={pinkXIcon} alt="삭제" className="w-10 h-10" />
                  </button>
                </div>
              ))}
              {canAddMoreImages && (
                <label
                  htmlFor="image-upload-edit"
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

      {/* Step 2: 요청글 제목 */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 2.</h2>
            <p className="body-b0-rg mt-4">
              요청글 제목 <span className="text-[var(--color-red-1)]">*</span>
            </p>
          </div>
          <div className="w-3/4 flex items-end gap-2 pr-12">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 40))}
              placeholder="요청글 제목을 입력해주세요."
              className="placeholder:text-[var(--color-gray-50)] flex-1 border border-[var(--color-gray-60)] body-b1-rg py-5 pl-5 pr-3 focus:outline-none"
            />
            <span className="body-b1-rg text-[var(--color-gray-60)] whitespace-nowrap">
              {title.length}/40자
            </span>
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
            <span className="body-b1-rg text-[var(--color-gray-60)] whitespace-nowrap">
              {description.length}/1000자
            </span>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      {/* Step 4: 희망 예산 */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 4.</h2>
            <p className="body-b0-rg mt-4">
              희망 예산 <span className="text-[var(--color-red-1)]">*</span>
            </p>
          </div>
          <div className="w-3/4 space-y-4">
            <div className="flex items-center gap-4 pr-16">
              <div className="flex items-center border border-[var(--color-gray-60)] max-w-xs relative">
                <input
                  type="number"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  placeholder="최소 예산을 기입해주세요."
                  className="placeholder:text-[var(--color-gray-50)] w-full body-b1-rg py-5 pl-5 pr-12 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-5 body-b1-rg text-[var(--color-gray-50)]">원</span>
              </div>
              <span className="body-b1-rg text-[var(--color-gray-60)]">~</span>
              <div className="flex items-center border border-[var(--color-gray-60)] max-w-xs relative">
                <input
                  type="number"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  placeholder="최대 예산을 기입해주세요."
                  className="placeholder:text-[var(--color-gray-50)] w-full body-b1-rg py-5 pl-5 pr-12 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-5 body-b1-rg text-[var(--color-gray-50)]">원</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      {/* Step 5: 요청 마감일 선택 */}
      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 5.</h2>
            <p className="body-b0-rg mt-4">
              요청 마감일 선택 <span className="text-[var(--color-red-1)]">*</span>
            </p>
          </div>
          <div className="w-2/3">
            <div className="relative">
              <input
                type="text"
                value={formatDate(deadline)}
                placeholder="날짜를 선택해주세요."
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
                className="placeholder:text-[var(--color-gray-50)] w-full border border-[var(--color-gray-60)] body-b1-rg p-5 focus:outline-none cursor-pointer"
              />
              <img
                src={calendarIcon}
                alt="달력"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 cursor-pointer"
                onClick={() => setShowCalendar(!showCalendar)}
              />
              {showCalendar && (
                <div className="absolute z-10 mt-2">
                  <Calendar
                    selected={deadline}
                    onSelect={(date) => {
                      setDeadline(date);
                      setShowCalendar(false);
                    }}
                    onClose={() => setShowCalendar(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      {/* Step 6: 카테고리 선택 */}
      <section className="mb-6">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 6.</h2>
            <p className="body-b0-rg mt-4">
              카테고리 선택 <span className="text-[var(--color-red-1)]">*</span>
            </p>
            <p className="body-b3-rg text-[var(--color-gray-50)] mt-1">
              소분류는 필수로 선택하지 않아도 됩니다.
            </p>
          </div>
          <div className="w-3/4 pr-25">
            <CategorySelect
              key={`edit-${selectedCategory ?? ''}-${selectedSubcategory ?? ''}`}
              onCategoryChange={(category) => setSelectedCategory(category)}
              onSubCategoryChange={(subCategory) => setSelectedSubcategory(subCategory)}
              initialCategory={selectedCategory}
              initialSubCategory={selectedSubcategory}
            />
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
            <p className="mb-4">잠깐! 글을 올리기 전에 확인해보세요.</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>
                  타인의 저작물 (예시 이미지 등)을 무단으로 캡쳐하여 업로드하는 것을 금지합니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>리폼 제안이 들어올 경우 알람을 보내드려요.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>
                  구체적인 설명(원하는 스타일, 색상, 참고 이미지 등)을 작성할수록 더 정확한 제안을
                  받을 수 있습니다.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>-</span>
                <span>
                  부적절한 내용(비속어, 광고성 문구, 반복 게시물 등)은 사전 통보 없이 숨김 또는
                  삭제될 수 있습니다.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      {submitError && (
        <p className="body-b1-rg text-[var(--color-red-1)] mb-4 text-right pr-0">{submitError}</p>
      )}

      <div className="flex justify-end">
        <Button
          variant={isButtonEnabled ? 'primary' : 'disabled'}
          size="default"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="px-12 min-w-[200px]"
        >
          {isSubmitting ? '수정 중...' : '수정하기'}
        </Button>
      </div>
    </div>
  );
};

export default OrderRequestEditPage;
