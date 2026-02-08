import { useState, useEffect } from 'react';
import rightIcon from '../../assets/icons/right.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getChatRequestDetail } from '@/api/chat/chatRequestApi';
import { type ChatRequestDetail } from '@/types/api/chat/chatDetail';
import profile from '@/assets/icons/profile.svg';

const ChatQuotationDetailPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const myRole = location.state?.myRole as 'REFORMER' | 'USER' | undefined;
  const isQuotation = location.state?.isQuotation ?? false;


  const [requestDetail , setRequestDetail] = useState<ChatRequestDetail | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
  if (!requestId) {
    console.warn('requestId 없음');
    return;
  }
  

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const data = await getChatRequestDetail(requestId);
      console.log('requestDetail', data); 
      if (data) setRequestDetail(data);
    } catch (err) {
      console.error('요청서 상세 조회 실패', err);
      alert('요청서 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  fetchDetail();
}, [requestId]);


  const handleNext = () => {
  if (!requestDetail?.body?.images?.length) return; // 안전하게 체크
    setCurrentIndex((prev) => (prev + 1) % requestDetail.body.images.length);
  };
  if (!myRole) return <div>권한 정보가 없습니다.</div>
  const images = requestDetail?.body.images ?? [];
  const handleEditQuotation = () => {
    navigate('/chat/create/quotation', {
      state: {
        mode: 'edit',
        quotationData: {
          images: images?.map((url) => ({
            file: null, 
            preview: url,
          })),
          price: '46500',
          delivery: '3500',
          estimatedDays: '5',
          content: '기존에 작성했던 상세 제안 내용입니다.',
        },
      },
    });
  };

  const handleEditRequest = () => {
    if (!requestDetail) return;

    navigate(`/chat/create/request/edit/${requestId}`, {
      state: {
        mode: 'edit',
        requestData: {
          images: requestDetail.body.images.map(url => ({ file: null, preview: url })),
          title: requestDetail.body.title,
          content: requestDetail.body.content,
          minBudget: requestDetail.body.minBudget.toString(),
          maxBudget: requestDetail.body.maxBudget.toString(),
        },
      },
    });
  };



  if (!myRole) return <div>권한 정보가 없습니다.</div>;
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-gray-500">로딩 중...</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-white mb-10">
      <div className="max-w-[80rem] mx-auto px-6 py-4">

        {/* 브레드크럼 */}
        <nav className="body-b1-rg text-[var(--color-gray-60)] mb-3 flex gap-1">
          <span>홈</span> &gt;
          <span>채팅하기</span> &gt;
          <span>견적서 상세</span> &gt;
        </nav>

        {/* 타이틀 */}
        <h1 className="heading-h2-bd text-black mb-7">
          {isQuotation ? '1:1 리폼 견적서' : '1:1 리폼 요청서'}
        </h1>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">

          {/* 이미지 섹션 */}
          <div className="w-full">
            <div className="relative aspect-square w-full overflow-hidden">

              <img
                src={images?.[currentIndex]}
                alt="견적 이미지"
                className="w-full h-full object-cover transition-all"
              />

              {/* 오른쪽 화살표 */}
              {images.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/50"
                >
                  <img
                    src={rightIcon}
                    alt="오른쪽 화살표"
                    className="w-10 h-10 pb-1"
                    style={{
                      filter: 'brightness(0) saturate(100%) invert(100%)',
                    }}
                  />
                </button>
              )}
            </div>

            {/* 도트 인디케이터 */}
            <div className="flex justify-center mt-6 gap-2">
              {images?.map((_, idx) => (
                <button
                  title="도트 페이지네이션"
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-[var(--color-mint-1)]'
                      : 'bg-[var(--color-gray-30)]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 견적 정보 */}
          <div className="flex flex-col h-full">
            <div className='border-b border-[var(--color-gray-40)]'>
            {/* 프로필 */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#646F7C33] overflow-hidden">
                  <img
                    src={requestDetail?.requester.profileImage ?? profile}
                    alt="판매자"
                    className={`w-full h-full object-cover transition-all ${
                      !requestDetail?.requester.profileImage ? 'scale-140' : ''
                    }`}
                  />
                </div>
                <span className="text-[15px] font-medium text-gray-600">
                  {requestDetail?.requester.nickname ?? '작성자'}
                </span>
              </div>
              <button className="text-gray-400" title="공유 이모지">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M25.75 16H28.375C29.0712 16 29.7389 16.2634 30.2312 16.7322C30.7234 17.2011 31 17.837 31 18.5V30.5C31 31.163 30.7234 31.7989 30.2312 32.2678C29.7389 32.7366 29.0712 33 28.375 33H12.625C11.9288 33 11.2611 32.7366 10.7688 32.2678C10.2766 31.7989 10 31.163 10 30.5V18.5C10 17.837 10.2766 17.2011 10.7688 16.7322C11.2611 16.2634 11.9288 16 12.625 16H15.25M25.75 12L20.5 7M20.5 7L15.25 12M20.5 7V24.0625" stroke="#374553" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </button>
            </div>

            {/* 제목 */}
            <h2 className="heading-h5-md text-black mb-8">
              {isQuotation ? `[제안] ${requestDetail?.body.title}` : `[요청] ${requestDetail?.body.title}`}
            </h2>

            {/* 요약 */}
            <div className="space-y-5 mb-10 pb-2">
              <div className="flex items-center gap-4">
                <span className="body-b1-rg text-[var(--color-gray-60)]">견적 금액</span>
                <span className="heading-h4-bd text-black">
                  {requestDetail?.body.minBudget?.toLocaleString() ?? '0'} ~ {requestDetail?.body.maxBudget?.toLocaleString() ?? '0'}원
                </span>
              </div>
              <div className="flex gap-4">
              </div>
              <div className="flex gap-4">
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="body-b1-rg text-black leading-7 space-y-4 flex-grow pl-10 pr-5 pb-10">
              <p>{requestDetail?.body.content}</p>
            </div>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-12">
              {myRole === 'REFORMER' && isQuotation && (
                <button
                  onClick={handleEditQuotation} 
                  className="w-full py-4 border-1 border-[var(--color-mint-1)] body-b0-bd text-[var(--color-mint-1)] rounded-[0.625rem]">
                  견적서 수정하기
                </button>
              )}

              {myRole === 'USER' && !isQuotation && (
                <button
                  onClick={handleEditRequest} 
                  className="w-full py-4 border-1 border-[var(--color-mint-1)] body-b0-bd text-[var(--color-mint-1)] rounded-[0.625rem]">
                  요청서 수정하기
                </button> 
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatQuotationDetailPage;
