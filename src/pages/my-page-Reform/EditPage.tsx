import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import upload from '@/assets/icons/upload.svg';
import Option5 from '../../components/domain/mypage/Option5';
import { type OptionGroup } from '../../components/domain/mypage/Option5';
import DescriptionEditor from '../../components/domain/mypage/DescriptionEditor';
import Button from '../../components/common/button/Button1';
import { uploadImage, uploadImages } from '../../api/upload';
import { useNavigate, useParams } from 'react-router-dom';
import { editReformProposal, getReformProposal } from '@/api/mypage/editProposal';
import type { EditReformProposalRequest } from '@/types/domain/mypage/editProposal';
import { editSaleItem, type EditSaleItemRequest } from '@/types/domain/mypage/editSaleItem';
import { getSaleItem } from '@/api/mypage/sale';
import type { SaleOption } from '@/types/domain/mypage/sale';

type ImageType = {
  file: File | null;
  preview: string;
};

type CreatePageProps = {
  type: 'order' | 'sale';
};

const EditPage: React.FC<CreatePageProps> = ({ type }) => {
  const navigate = useNavigate();
  // --- 상태 관리 (Step 1 이미지용) ---
  const [images, setImages] = useState<ImageType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams<{ id: string }>();
  console.log('현재 id:', id);
  // Step 2,4,5, 6 상태 추가
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<string>(''); // string으로 받음
  const [shippingFee, setShippingFee] = useState<string>(''); 
  const [duration, setDuration] = useState<string>('');
  const [category, setCategory] = useState<string>(''); // 선택 안 됐으면 빈 문자열
  const [subCategory, setSubCategory] = useState<string>(''); // 소분류
  const [description, setDescription] = useState('');
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const optionGroupsIdRef = useRef(1);
  const subOptionIdRef = useRef(1);
  const [showEditor, setShowEditor] = useState(false);

  const subCategoryMap: Record<string, string[]> = {
  '의류': ['상의', '하의', '아우터', '기타'],
  '잡화': ['가방·짐색', '지갑·파우치', '모자·캡·비니'],
  '악세서리': ['헤어 악세서리', '폰케이스', '키링'],
  '홈·리빙': ['패브릭 소품', '쿠션·방석'],
  '기타': []
  };

    useEffect(() => {
      if (!id) return;

      const fetchData = async () => {
        try {
          if (type === 'sale') {
            // --- 판매글 조회 ---
            const res = await getSaleItem(id);

            // 이미지 세팅
            setImages(res.images.map(url => ({ file: null, preview: url })));

            // 텍스트 세팅
            setTitle(res.title);
            setDescription(''); // 판매글 content 없으면 빈 문자열
            setPrice(res.price.toString());
            setShippingFee(res.delivery.toString());

            // 옵션 그룹 변환
            if (res.option_groups && res.option_groups.length > 0) {
              setOptionGroups(
                res.option_groups.map((group, groupIndex) => ({
                  id: optionGroupsIdRef.current++,
                  apiId: group.option_group_id,
                  name: group.name,
                  sortOrder: groupIndex, // 그룹 순서 저장
                  subOptions: group.option_items.map((item, subIndex) => ({
                    id: subOptionIdRef.current++,
                    apiId: item.option_item_id,
                    name: item.name,
                    price: item.extra_price.toString(),
                    quantity: item.quantity.toString(),
                    sortOrder: subIndex, // 세부 옵션 순서 저장
                  })),
                }))
              );
            }

          } else if (type === 'order') {
            // --- 주문제작 글 조회 ---
            const res = await getReformProposal(id);
            const data = res.success;

            // 이미지 세팅
            setImages(
              data.images?.map(img => ({ file: null, preview: img.photo })) || []
            );

            // 텍스트 세팅
            setTitle(data.title || '');
            setDescription(data.content || '');
            setPrice(data.price?.toString() || '');
            setShippingFee(data.delivery?.toString() || '');
            setDuration(data.expectedWorking?.toString() || '');

            // 카테고리 세팅
            setCategory(data.category?.major || '');
            setSubCategory(data.category?.sub || '');

            // 주문제작은 옵션 없음
            setOptionGroups([]);
          }
        } catch (error) {
          console.error('데이터 불러오기 실패', error);
          alert(`${type === 'sale' ? '판매글' : '주문제작 글'} 불러오기에 실패했습니다.`);
        }
      };

      fetchData();
    }, [id, type]);



  const isButtonEnabled = 
    images.length > 0 &&
    title.trim() !== '' &&
    description.trim() !== '' &&
    description.trim() !== '<p></p>' &&
    price.trim() !== '' &&
    shippingFee.trim() !== '' &&
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

    const handleSubmit = async () => {
  try {
    // 1. 이미지 업로드
    const files = images.map(img => img.file).filter((f): f is File => f !== null);
    let imageUrls: string[] = [];
    if (files.length === 1) {
      const res = await uploadImage(files[0]);
      imageUrls = [res.success.url];
    } else if (files.length > 1) {
      const res = await uploadImages(files);
      imageUrls = res.success.url;
    }

    if (type === 'sale') {
      const saleOptions: SaleOption[] = optionGroups.map((group, groupIndex) => ({
        title: group.name,
        sortOrder: groupIndex,
        content: group.subOptions.map((sub, subIndex) => ({
          comment: sub.name,
          price: Number(sub.price.replace(/,/g, '')),
          quantity: Number(sub.quantity),
          sortOrder: subIndex,
        })),
      }));

      const payload: EditSaleItemRequest = {
        title,
        content: description,
        price: Number(price.replace(/,/g, '')),
        delivery: Number(shippingFee.replace(/,/g, '')),
        option: saleOptions,
        category: {
          major: category,
          sub: subCategory,
        },
        imageUrls,
      };

      await editSaleItem(id!, payload);
    } else {
      const payload: EditReformProposalRequest = {
        title,
        contents: description,
        price: Number(price.replace(/,/g, '')),
        delivery: Number(shippingFee.replace(/,/g, '')),
        expectedWorking: Number(duration),
        category: { major: category, sub: subCategory },
        images: imageUrls,
      };

      await editReformProposal(id!, payload);
    }

    alert(`${type === 'sale' ? '판매글' : '주문제작 글'} 수정 완료!`);
    navigate('/reformer-mypage');
  } catch (error) {
    console.error(error);
    alert(`${type === 'sale' ? '판매글' : '주문제작 글'} 수정 실패`);
  }
};


  return (
    <div className="max-w-7xl mx-auto p-8 bg-white text-gray-800">
      <h1 className="heading-h2-bd pb-6 border-b mb-8 border-[black]"> {type === 'order' ? '주문제작 글 수정하기' : '판매글 수정하기'}</h1>

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
                  <img src={upload} alt="업로드 아이콘" className="text-gray-400" />
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
            <p className="body-b0-rg mt-1">글 제목 <span className="text-[var(--color-red-1)]">*</span></p>
          </div>
          <div className="w-3/4 relative">
            <input 
              type="text" 
              placeholder="요청글 제목을 입력해주세요."
              value = {title}
              onChange={e => setTitle(e.target.value)} 
              className="placeholder:text-[var(--color-gray-50)] w-full border border-[var(--color-gray-60)] body-b1-rg p-5 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-10 text-sm text-gray-400">0/40자</span>
          </div>
        </div>
      </section>

      <hr className="my-8 border-[var(--color-line-gray-40)]" />

      {/* Step3: Description */}
        <section className="mb-10">
        <div className="flex">
            <div className="w-1/4">
            <h2 className="body-b0-md">Step 3.</h2>
            <p className="body-b0-rg mt-1">
                상세 내용 작성<span className="text-[var(--color-red-1)]">*</span>
            </p>
            </div>
            <div className="w-3/4">
            {/* 내용 영역 */}
            <div
                className={`border border-[var(--color-gray-60)] h-[350px] bg-white mt-6 p-6 relative ${
                !description || description.trim() === '<p></p>' || description.trim() === ''
                    ? 'flex items-center justify-center'
                    : 'block'
                }`}
            >
                {description && description.trim() !== '' && description.trim() !== '<p></p>' ? (
                <>
                    <div
                    className="prose max-w-none body-b1-rg overflow-y-auto h-full"
                    dangerouslySetInnerHTML={{ __html: description }}
                    />
                    <button
                    onClick={() => setShowEditor(true)}
                    className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-white border border-[var(--color-line-gray-40)] px-4 py-2 rounded-[0.63rem] body-b2-rg shadow-md transition"
                    >
                    <svg width="25" height="25" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 31.0755H13.7303L31.0755 13.7303L26.3446 9L9 26.3452V31.0755Z" stroke="#646F7C" stroke-width="2" stroke-linejoin="round"/>
                        <path d="M21.6133 13.7305L26.3436 18.4608" stroke="#646F7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M18.3398 31.5H31.5002" stroke="#646F7C" stroke-width="2" stroke-linecap="round"/>
                    </svg>

                    수정하기
                    </button>
                </>
                ) : (
                <div className="flex flex-col items-center justify-center">
                    <p className="body-b1-rg text-[var(--color-gray-50)] mb-4">등록된 내용이 없습니다.</p>
                    <button
                    onClick={() => setShowEditor(true)}
                    className="cursor-pointer border border-[var(--color-line-gray-40)] px-7 py-2 rounded-[0.625rem] flex flex-row gap-3"
                    >
                        <svg width="25" height="25" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 31.0755H13.7303L31.0755 13.7303L26.3446 9L9 26.3452V31.0755Z" stroke="#646F7C" stroke-width="2" stroke-linejoin="round"/>
                            <path d="M21.6133 13.7305L26.3436 18.4608" stroke="#646F7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.3398 31.5H31.5002" stroke="#646F7C" stroke-width="2" stroke-linecap="round"/>
                        </svg>

                    글쓰기
                    </button>
                </div>
                )}
            </div>

            {/* 모달처럼 뜨는 에디터 */}
            {showEditor && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-5xl h-[80vh] p-6 rounded-lg overflow-auto">
                    <DescriptionEditor
                      onSubmit={(html) => {
                        setDescription(html);
                        setShowEditor(false);
                      }}
                      initialContent={description}
                      onClose={() => setShowEditor(false)}
                    />
                </div>
                </div>
            )}
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

    {/* step 5: duration */}
    <section className="mb-10">
        <div className="flex">
          <div className="w-1/4">
            <h2 className="body-b0-md">Step 5.</h2>
            {type === 'sale' ? (
                <>
                <p className="body-b0-rg mt-1">
                    옵션 입력 <span className="text-[var(--color-red-1)]">*</span>
                </p>
                <p className="body-b3-rg text-[var(--color-gray-50)] mt-1">
                    각 옵션별 수량이 0개가 되면<br />
                    품절 처리됩니다.
                </p>
                </>
            ) : <p className="body-b0-rg mt-1">예상 작업 기간 <span className="text-[var(--color-red-1)]">*</span></p>}           
        </div>
        <div className="w-3/4 space-y-4">
        { type === 'sale' ? (
            <Option5
                optionGroups={optionGroups}
                setOptionGroups={setOptionGroups}
                optionGroupIdRef={optionGroupsIdRef}
                subOptionIdRef={subOptionIdRef}
            />
        ) : (
          <div>
            <div className="flex items-center border border-[var(--color-gray-50)] p-5">
              <input 
                type="text"
                value ={duration}
                onChange={e => setDuration(e.target.value)} 
                placeholder="예상되는 작업 소요 기간을 기재해주세요" 
                className="placeholder:text-[var(--color-gray-50)] flex-1 body-b1-rg text-[var(--color-gray-50)] outline-none bg-transparent" 
              />
              <span className="body-b1-rg text-[v요r(--color-gray-50)] ml-2">일 이내</span>
            </div>
          </div>
        )}
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
        <Button
            variant={isButtonEnabled ? 'primary' : 'disabled'}
            onClick={handleSubmit}
            >
            수정하기
        </Button>
      </div>
    </div>
  );
};

export default EditPage;