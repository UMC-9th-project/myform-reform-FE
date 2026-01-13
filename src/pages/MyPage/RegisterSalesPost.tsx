import React, { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Option5, {type OptionGroup} from '../../components/domain/mypage/Option5';


type ImageType = {
  file: File;
  preview: string;
};

const RegisterSalesPost = () => {
  
  // --- 상태 관리 (Step 1 이미지용) ---
  const [images, setImages] = useState<ImageType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [description, setDescription] = useState<string>(
    () => location.state?.description ?? ''
  );
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const optionGroupsIdRef = useRef(1);
  const subOptionIdRef = useRef(1);
  const [subCategory, setSubCategory] = useState<string>(''); // 소분류
  
    const subCategoryMap: Record<string, string[]> = {
    '의류': ['상의', '하의', '아우터', '기타'],
    '잡화': ['가방', '신발', '모자', '기타'],
    '악세서리': ['귀걸이', '목걸이', '반지', '기타'],
    '홈·리빙': ['가구', '인테리어', '주방', '기타'],
    '기타': ['기타']
  }; 


    // Step 2,4,5, 6 상태 추가
    const [title, setTitle] = useState<string>('');
    const [price, setPrice] = useState<string>(''); // string으로 받음
    const [shippingFee, setShippingFee] = useState<string>(''); 
    
    const areOptionsValid = optionGroups.length > 0 &&
        optionGroups.every(group => group.name.trim() !== '');
    const [category, setCategory] = useState<string>(''); // 선택 안 됐으면 빈 문자열
  
  
    // 버튼 활성화 조건
    const isButtonEnabled = 
      images.length > 0 &&
      title.trim() !== '' &&
      description.trim() !== '' &&
      description.trim() !== '<p></p>' &&
      price.trim() !== '' &&
      shippingFee.trim() !== '' &&
      areOptionsValid &&
      category.trim() !== '';
  
      // 숫자에 콤마 추가
      const formatNumberWithComma = (value: string) => {
        const number = value.replace(/\D/g, ''); // 숫자만 추출
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 천 단위 콤마
      };


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
              value={title}
              onChange={e => setTitle(e.target.value)}
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
        <p className="body-b0-rg mt-1">상세 내용 작성<span className="text-[var(--color-red-1)]">*</span></p>
        </div>
        <div className="w-3/4">
        {/* 1. 부모 박스: relative를 추가하여 버튼의 기준점이 됩니다. */}
        <div
            className={`
            border border-[var(--color-gray-60)]
            h-[350px]
            bg-white mt-6 p-6
            relative 
            ${!description || description.trim() === '<p></p>' || description.trim() === ''
            ? 'flex items-center justify-center'
            : 'block'
            }
            `}
        >
            {description && description.trim() !== '' && description.trim() !== '<p></p>' ? (
            <>
                <div
                className="prose max-w-none body-b1-rg overflow-y-auto h-full"
                dangerouslySetInnerHTML={{ __html: description }}
                />

                {/* 2. 버튼: absolute를 사용하여 우측 하단에 고정합니다. */}
                <button
                onClick={() => navigate('/description', { state: { description } })}
                className="
                    absolute bottom-4 right-4 z-10
                    flex items-center gap-2
                    bg-white border border-[var(--color-line-gray-40)]
                    px-4 py-2
                    rounded-[0.63rem]
                    body-b2-rg
                    hover:bg-gray-50
                    shadow-md
                    transition
                "
                >
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 23.0755H5.7303L23.0755 5.7303L18.3446 1L1 18.3452V23.0755Z" stroke="#646F7C" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M13.6133 5.73047L18.3436 10.4608" stroke="#646F7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10.3398 23.5H23.5002" stroke="#646F7C" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                수정하기
                </button>
            </>
            ) : (
            /* 내용 없을 때 */
            <div className="flex flex-col items-center justify-center">
                <p className="body-b0-rg text-[var(--color-gray-50)] mb-4">등록된 내용이 없습니다.</p>
                <button onClick={() => navigate('/description')} className="cursor-pointer border border-[var(--color-line-gray-40)] px-7 py-2 rounded-[0.625rem] flex flex-row gap-3"><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 23.0755H5.7303L23.0755 5.7303L18.3446 1L1 18.3452V23.0755Z" stroke="#646F7C" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M13.6133 5.73047L18.3436 10.4608" stroke="#646F7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M10.3398 23.5H23.5002" stroke="#646F7C" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                <span className='body-b1-rg text-[var(--color-gray-50)]'>글쓰기</span></button>
            </div>
            )}
        </div>
        ...
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
                    value={price}
                    onChange={e => setPrice(formatNumberWithComma(e.target.value))} 
                    placeholder="판매 가격을 기입해주세요." 
                    className="placeholder:text-[var(--color-gray-50)] flex-1 body-b1-rg text-[var(--color-gray-50)] outline-none bg-transparent" 
                />
                <span className="body-b1-rg text-[var(--color-gray-50)] ml-2">원</span>
              </div>
              <p className="body-b1-rg text-[var(--color-gray-50)] mt-1">* 최소 금액 100원 이상으로 설정해주세요.</p>
            </div>
              <div className="flex items-center border border-[var(--color-gray-50)] p-5">
                <input 
                    type="text"
                    value={shippingFee}
                    onChange={e => setShippingFee(formatNumberWithComma(e.target.value))} 
                    placeholder="배송비를 입력해주세요." 
                    className="placeholder:text-[var(--color-gray-50)] flex-1 body-b1-rg text-[var(--color-gray-50)] outline-none bg-transparent" 
                />
                <span className="body-b1-rg ml-2 text-[var(--color-gray-50)]">원</span>
              </div>
          </div>
        </div>
      </section>

      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 5.</h2>
            <p className="body-b0-rg mt-1">
              옵션 입력 <span className="text-[var(--color-red-1)]">*</span>
            </p>
            <p className="body-b3-rg text-[var(--color-gray-50)] mt-1">
              각 옵션별 수량이 0개가 되면<br />
              품절 처리됩니다.
            </p>
          </div>
          <div className="w-3/4 space-y-6">
            {/* 여기에 Option5 컴포넌트 삽입 */}
            <Option5
              optionGroups={optionGroups}
              setOptionGroups={setOptionGroups}
              optionGroupIdRef={optionGroupsIdRef}
              subOptionIdRef={subOptionIdRef}
            />
          </div>
        </div>
      </section>


    <hr className="my-8 border-[var(--color-line-gray-40)]" />


  {/* Step 6: Category */}
      <section className="mb-16">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 6.</h2>
            <p className="body-b0-rg mt-1">카테고리 선택 <span className="text-[var(--color-red-1)]">*</span></p>
            <p className="body-b3-rg text-[var(--color-gray-50)] mt-1">소분류는 필수로 선택하지 않아도 됩니다.</p>
          </div>

          <div className="w-3/4 flex border border-[var(--color-line-gray-40)]">
            {/* 대분류 */}
            <div className="w-1/3 border-r border-[var(--color-line-gray-40)] overflow-y-auto flex flex-col">
              {Object.keys(subCategoryMap).map((cat) => (
                <div
                  key={cat}
                  className={`flex items-center justify-start body-b1-rg cursor-pointer pl-5 py-4 hover:bg-[var(--color-gray-20)]
                    ${category === cat ? 'bg-[var(--color-gray-20)] font-bold' : ''}`}
                      onClick={() => {
                      setCategory(cat);
                      setSubCategory(''); // 소분류 초기화
                      console.log('대분류 클릭:', cat); // 확인용
                    }}
                >
                  {cat}
                </div>
              ))}
            </div>

            {/* 소분류 */}
            <div className="w-2/3 overflow-y-auto flex flex-col">
              {category ? (
                subCategoryMap[category].map((sub) => (
                  <div
                    key={sub}
                    className={`flex items-center justify-start body-b1-rg cursor-pointer pl-7 py-4 hover:bg-[var(--color-gray-20)]
                      ${subCategory === sub ? 'bg-[var(--color-gray-20)] font-bold' : ''}`}
                    onClick={() => setSubCategory(sub)}
                  >
                    {sub}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-full text-[var(--color-gray-50)]">
                  소분류 선택
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button 
          className={`body-b0-bd rounded-[0.625rem] px-12 py-5 ${
            isButtonEnabled 
              ? 'bg-[var(--color-mint-0)] text-white cursor-pointer'
              : 'bg-[var(--color-gray-30)] text-[var(--color-gray-50)] cursor-not-allowed'
          }`}
            disabled={!isButtonEnabled}
          >
            등록하기
          </button>
      </div>
    </div>
  );
};

export default RegisterSalesPost;