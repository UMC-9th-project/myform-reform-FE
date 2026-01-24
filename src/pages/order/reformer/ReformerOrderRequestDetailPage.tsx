import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../../components/common/Breadcrumb/Breadcrumb';
import shareIcon from '../../../assets/icons/share.svg';
import { ImageCarousel } from '../../../components/common/product/Image';
import Button from '../../../components/common/Button/button1';
import LikeButton from '../../../components/common/LikeButton/LikeButton';

interface RequestDetail {
  id: string;
  title: string;
  images: string[];
  nickname: string;
  profileImg: string;
  budget: string;
  deadline: string;
  description: string;
  type: 'myRequest' | 'Request';
}

// 더미 데이터 (실제로는 API에서 가져올 데이터)
const getMockRequestDetail = (id: string): RequestDetail => {
  const mockData: Record<string, RequestDetail> = {
    '1': {
      id: '1',
      title: '짐색 리폼 요청합니다.',
      images: ['/crt1.jpg', '/crt2.jpg', '/crt1.jpg'],
      nickname: '심심한 리본',
      profileImg: '/crt1.jpg',
      budget: '30,000~50,000원',
      deadline: '2026년 5월 22일',
      description: `2026년 5월 22일 마감일로 설정된 테스트 데이터입니다.
      마감되지 않은 상태로 표시되어야 합니다.`,
      type: 'Request',
    },
    '2': {
      id: '2',
      title: '짐색 리폼 요청합니다.',
      images: ['/crt1.jpg', '/crt2.jpg', '/crt1.jpg'],
      nickname: '심심한 리본',
      profileImg: '/crt1.jpg',
      budget: '30,000~50,000원',
      deadline: '2025년 12월 31일',
      description: `상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.`,
      type: 'myRequest',
    },
    '3': {
      id: '3',
      title: '짐색 리폼 요청합니다.',
      images: ['/crt1.jpg', '/crt2.jpg', '/crt1.jpg', '/crt2.jpg'],
      nickname: '심심한 리본',
      profileImg: '/crt1.jpg',
      budget: '30,000~50,000원',
      deadline: '2025년 12월 31일',
      description: `상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.
      상세 요청 내용 텍스트 샘플입니다.`,
      type: 'Request',
    },
  };

  return mockData[id] || mockData['3'];
};

const ReformerOrderRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const requestDetail = id ? getMockRequestDetail(id) : null;

  if (!id || !requestDetail) {
    return <div>요청을 찾을 수 없습니다.</div>;
  }

  const { title, images, nickname, profileImg, budget, deadline, description } = requestDetail;

  // 마감일 확인 (예: "2025년 12월 31일" 형식)
  const isClosed = (() => {
    try {
      // 마감일 문자열 파싱 (예: "2025년 12월 31일")
      const deadlineMatch = deadline.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
      if (!deadlineMatch) return false;

      const [, year, month, day] = deadlineMatch;
      const deadlineDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      deadlineDate.setHours(0, 0, 0, 0);

      // 오늘 날짜가 마감일보다 이후면 마감됨
      return today > deadlineDate;
    } catch {
      return false;
    }
  })();

  const handleShare = () => {
    // 공유 기능 구현
    console.log('공유하기');
  };

  const breadcrumbItems = [
    { label: '홈', path: '/' },
    { label: '주문제작', path: '/reformer/order' },
    { label: '주문제작 요청', path: '/reformer/order/requests' },
    { label: '상세' },
  ];

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-27 pt-6 ">
        {/* 브레드크럼 */}
        <div className="body-b1-rg text-[var(--color-gray-60)] mb-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* 페이지 제목 */}
        <h1 className="heading-h2-bd text-[var(--color-black)] mb-8">리폼 요청</h1>

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[3.125rem]">
          {/* 왼쪽: 이미지 캐러셀 */}
          <div className="flex-1">
            <ImageCarousel images={images} isClosed={isClosed} />
          </div>

          {/* 오른쪽: 요청 상세 정보 */}
          <div className="flex-1 flex flex-col ">
            {/* 요청자 정보 */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--color-gray-60)]">
                  <img
                    src={profileImg}
                    alt={nickname}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="body-b1-rg text-[var(--color-gray-60)]">{nickname}</span>
              </div>
              <button
                onClick={handleShare}
                className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
                aria-label="공유하기"
              >
                <img src={shareIcon} alt="공유" className="w-8 h-8" />
              </button>
            </div>

            {/* 요청 제목 */}
            <h2 className="heading-h5-md text-[var(--color-black)] mb-4">{title}</h2>

            {/* 희망 예산 */}
            <div className="mb-1 flex flex-row items-center  gap-4">
              <p className="body-b1-sb text-[var(--color-gray-60)] ">희망 예산</p>
              <p className="heading-h4-bd text-[var(--color-black)]">{budget}</p>
            </div>

            {/* 마감일 */}
            <div className="mb-6 flex flex-row items-center  gap-4">
              <p className="body-b1-sb text-[var(--color-gray-60)]">마감일</p>
              <p className="body-b1-rg text-[var(--color-gray-60)]">{deadline}</p>
            </div>

            {/* 상세 요청 내용 */}
            <div className="pt-8 border-b border-[var(--color-gray-40)]">
              <div className="pl-10">
                <p className="body-b1-rg text-[var(--color-gray-60)] mb-4 ">상세 요청 내용</p>
                <div className="body-b1-rg text-[var(--color-black)] whitespace-pre-line pb-12">
                  {description}
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className="flex gap-7 mt-7">
              {!isClosed && (
                <Button
                  variant="white"
                  onClick={() => setIsLiked(!isLiked)}
                  className="flex items-center justify-center gap-2 flex-1"
                >
                  <LikeButton initialLiked={isLiked} variant="blackLine" readOnly className="!w-6 !h-6" />
                  <span>찜하기</span>
                </Button>
              )}
              {isClosed ? (
                <Button variant="disabled" className={isClosed ? "flex-[2]" : "flex-[2]"}>
                  제안할 수 없어요
                </Button>
              ) : (
                <Button 
                  variant="outlined-mint" 
                  onClick={() => navigate(`/reformer/order/requests/${id}/estimate`)}
                  className="flex-[2]"
                >
                  견적서 작성하기
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReformerOrderRequestDetailPage;
