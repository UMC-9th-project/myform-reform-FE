import React, { useEffect, useRef, useState } from 'react';
import starYellow from '../../../assets/icons/star.svg';
import starGray from '../../../assets/icons/emptyStar.svg';
import MoreVertical from '../../../assets/icons/morevertical.svg';
import trash from '../../../assets/icons/trash.svg';
import profile from '@/assets/icons/profile.svg';
import { formatDateToKorean } from '@/utils/domain/formatDate';
import ImageViewerModal from './ImageViewModal';
import { useNavigate } from 'react-router-dom';


export interface ReviewItem {
  id: string;
  author: string;
  profileImg?: string;
  rating: number;
  date: string;
  content: string;
  img?: string[];
  productImg: string;
  productName: string;
  productPrice: number;
  productId?: string;
  productType: string;
}

interface MyReviewGridProps {
  reviews: ReviewItem[];
  isEditable?: boolean;
  maxWidth?: '4xl' | '6xl';
  onDelete?: (reviewId: string) => void;
}

const MyReviewGrid: React.FC<MyReviewGridProps> = ({
  reviews,
  isEditable = false,
  maxWidth = '4xl',
  onDelete,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const navigate = useNavigate();

  

  // 클릭 외부 영역 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className="bg-transparent">
      <div className={`mx-auto ${maxWidth === '4xl' ? 'max-w-4xl' : 'max-w-6xl'}`}>
        <div className="columns-2 gap-4 space-y-4">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid bg-white rounded-[0.625rem] p-5
                         border border-[var(--color-line-gray-40)]
                         shadow-sm hover:shadow-md transition-all"
            >
              {/* 유저 정보 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden">
                    <img
                      src={item.profileImg || profile}
                      alt={`${item.author} 프로필`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="body-b1-sb text-black truncate">{item.author}</div>
                    <div className="flex items-center gap-1.5 text-[0.68rem] text-[var(--color-gray-40)]">
                      <span className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <img
                            key={index}
                            src={index < item.rating ? starYellow : starGray}
                            alt="별"
                            className="w-4 h-4"
                          />
                        ))}
                      </span>
                      <span className="body-b3-rg text-[var(--color-gray-50)]">{formatDateToKorean(item.date)}</span>
                    </div>
                  </div>
                </div>

                {/* 삭제 버튼 */}
                {isEditable && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === item.id ? null : item.id)
                      }
                      className="p-1"
                    >
                      <img src={MoreVertical} alt="더보기" className="w-7 h-7" />
                    </button>

                    {openMenuId === item.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 mt-2 p-1 w-40 rounded-[1.385rem]
                                   bg-white shadow-[0px_4px_10.7px_0px_#00000038] overflow-hidden z-10
                                   space-y-1"
                      >
                        <button
                          className="w-full px-4 py-2 text-left body-b1-rg flex gap-2 items-center"
                          onClick={() => {
                            if (!confirm('정말 삭제하시겠습니까?')) return;
                            onDelete?.(item.id);
                            setOpenMenuId(null);
                          }}
                        >
                          <img src={trash} alt="삭제하기" className="w-8" />
                          <span>삭제하기</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 리뷰 내용 */}
              <p className="body-b1-rg text-black leading-relaxed mb-4">{item.content}</p>

              {/* 리뷰 이미지 */}
              {item.img && item.img.length > 0 && (
                <div className={`mb-4 grid gap-2 ${item.img.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {item.img.map((src, index) => (
                    <div key={index} className="overflow-hidden aspect-square">
                      <img
                        src={src}
                        alt={`리뷰 이미지 ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => {
                          setViewerImages(item.img!);  // 클릭한 리뷰 이미지 배열 전달
                          setCurrentIndex(index);      // 클릭한 이미지부터 보여주기
                          setViewerOpen(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}


              {/* 상품 정보 */}
              <div
                className="bg-[var(--color-gray-20)] p-3 flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    if (item.productType === 'ITEM') {
                      navigate(`/market/product/${item.productId}`);
                    }
                    if (item.productType === 'REQUEST') {
                      navigate(`/reformer/order/requests/${item.productId}`) 
                    }
                    if (item.productType === 'PROPOSAL') {
                      navigate(`/reformer/order/proposals/${item.productId}`)
                    } 
                  }}
              >
                <div className="w-12 h-12 bg-white overflow-hidden flex-shrink-0">
                  <img src={item.productImg} alt="상품 이미지" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-[0.69rem] body-b3-rg line-clamp-2">{item.productName}</div>
                  <div className="body-b1-sb text-black">{(item.productPrice ?? 0).toLocaleString()}원</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {viewerOpen && (
        <ImageViewerModal
          images={viewerImages}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}

      </div>
    </div>
  );
};

export default MyReviewGrid;
