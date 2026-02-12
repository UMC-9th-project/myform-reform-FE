import { useState } from 'react';
import Breadcrumb from '../../components/common/breadcrumb/Breadcrumb';
import ReformFeedCard from '../../components/domain/reformer-search/ReformFeedCard';
import ImageViewerModal from '../../components/domain/mypage/ImageViewModal';
import { getReformerFeedPhotos } from '../../api/reformer';
import { useReformerFeedListView } from '../../hooks/domain/reformer-search/useReformerFeedListView';

const FeedListView = () => {
  const {
    feeds,
    isLoading,
    isError,
    isFetchingNextPage,
    observerTargetRef,
  } = useReformerFeedListView();

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFeedClick = async (item: { feed_id: string; photo_url: string; is_multi_photo: boolean }) => {
    if (!item.photo_url) return;

    if (item.is_multi_photo) {
      try {
        const res = await getReformerFeedPhotos({ feed_id: item.feed_id });
        const photos = (res as { photos?: { photo_order: number; url: string }[] })?.photos
          ?? (res as { success?: { photos?: { photo_order: number; url: string }[] } })?.success?.photos;
        const urls =
          photos
            ?.sort((a, b) => a.photo_order - b.photo_order)
            ?.map((p) => p.url) ?? [];
        if (urls.length > 0) {
          setSelectedImages(urls);
          setCurrentIndex(0);
          setIsViewerOpen(true);
        } else {
          setSelectedImages([item.photo_url]);
          setCurrentIndex(0);
          setIsViewerOpen(true);
        }
      } catch {
        setSelectedImages([item.photo_url]);
        setCurrentIndex(0);
        setIsViewerOpen(true);
      }
    } else {
      setSelectedImages([item.photo_url]);
      setCurrentIndex(0);
      setIsViewerOpen(true);
    }
  };

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '리폼러 찾기', path: '/reformer-search' },
    { label: '피드 보기' },
  ];

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-4 md:px-[3.125rem] pt-8 md:pt-[3.125rem]">
        {/* 브레드크럼 */}
        <div className="body-b1-rg text-[var(--color-gray-60)] mb-6 md:mb-8 pl-0 md:pl-[110px]">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* 헤더 */}
        <div className="mb-8 md:mb-12 pl-0 md:pl-[110px]">
          <h1 className="heading-h4-bd text-[var(--color-black)] mb-2">
            피드 탐색하기
          </h1>
          <p className="heading-h5-rg text-[var(--color-gray-50)]">
            다양한 리폼 스타일을 탐색해보세요.
            <br />
            내 취향에 맞는 리폼러를 만날 수 있어요.
          </p>
        </div>

        {/* 피드 그리드 */}
        <div className="px-0 md:px-[110px]">
          {isError ? (
            <div className="py-16 text-center body-b2-rg text-[var(--color-gray-60)]">
              피드를 불러오지 못했습니다.
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-[0.875rem]">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-full bg-[var(--color-gray-30)] animate-pulse"
                  style={{ aspectRatio: '1/1.3' }}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-[0.875rem]">
              {feeds.map((item) => (
                <ReformFeedCard
                  key={item.feed_id}
                  feed={item}
                  onClick={() => handleFeedClick(item)}
                />
              ))}
            </div>
          )}

          {isViewerOpen && selectedImages.length > 0 && (
            <ImageViewerModal
              images={selectedImages}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              onClose={() => setIsViewerOpen(false)}
            />
          )}

          {/* 무한 스크롤 감지 영역 */}
          <div ref={observerTargetRef} className="h-20 flex items-center justify-center">
            {isFetchingNextPage && (
              <div className="text-[var(--color-gray-50)] body-b2-rg">
                로딩 중...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedListView;
