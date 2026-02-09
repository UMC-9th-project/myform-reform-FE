// pages/chat/ChatProposalDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChatProposalDetail } from '@/api/chat/chatProposalApi';
import type { ChatProposalDetail } from '@/types/api/chat/chatProposal';
import rightIcon from '@/assets/icons/right.svg';
import profile from '@/assets/icons/profile.svg';
import  useAuthStore  from '@/stores/useAuthStore'

const ChatProposalDetailPage = () => {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();

  const [proposalDetail, setProposalDetail] = useState<ChatProposalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { role: userRole } = useAuthStore();

  // 데이터 불러오기
  useEffect(() => {
    if (!proposalId) return;

    const fetchProposal = async () => {
      try {
        setLoading(true);
        const data = await getChatProposalDetail(proposalId);
        console.log('견적서 상세 데이터:', data);
        setProposalDetail(data);
      } catch (err) {
        console.error('견적서 상세 조회 실패', err);
        alert('견적서 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId]);

  // 로딩 상태
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-gray-500">로딩 중...</span>
      </div>
    );

  // 데이터 없을 때
  if (!proposalDetail)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-gray-500">견적서를 찾을 수 없습니다.</span>
      </div>
    );

  // 구조 분해: 최상위 owner, body 가져오기
  const { owner, body } = proposalDetail;
  const { title, content, price, delivery, expectedWorking, images } = body;

  // 이미지 슬라이드
  const handleNextImage = () => {
    if (!images.length) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  // 수정 버튼 클릭
  const handleEditProposal = () => {
    navigate('/chat/create/quotation', {
      state: {
        mode: 'edit',
        quotationData: {
          images: images.map((url) => ({ file: null, preview: url })),
          price: price.toString(),
          delivery: delivery.toString(),
          estimatedDays: expectedWorking.toString(),
          content: content,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-white mb-10">
      <div className="max-w-[80rem] mx-auto px-6 py-4">
        {/* 브레드크럼 */}
        <nav className="body-b1-rg text-[var(--color-gray-60)] mb-3 flex gap-1">
          <span>홈</span> &gt;
          <span>채팅하기</span> &gt;
          <span>견적서 상세</span>
        </nav>

        {/* 타이틀 */}
        <h1 className="heading-h2-bd text-black mb-7">1:1 리폼 견적서</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
          {/* 이미지 섹션 */}
          <div className="w-full">
            <div className="relative aspect-square w-full overflow-hidden">
              <img
                src={images[currentIndex]}
                alt="견적 이미지"
                className="w-full h-full object-cover transition-all"
              />
              {images.length > 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/50"
                >
                  <img
                    src={rightIcon}
                    alt="오른쪽 화살표"
                    className="w-10 h-10 pb-1"
                    style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }}
                  />
                </button>
              )}
            </div>

            {/* 도트 인디케이터 */}
            <div className="flex justify-center mt-6 gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  title="도트 페이지네이션"
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-[var(--color-mint-1)]' : 'bg-[var(--color-gray-30)]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 상세 정보 섹션 */}
          <div className="flex flex-col h-full">
            <div className="border-b border-[var(--color-gray-40)]">
              {/* 프로필 */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#646F7C33] overflow-hidden">
                    <img
                      src={owner.profileImage ?? profile}
                      alt="작성자"
                      className={`w-full h-full object-cover transition-all ${
                        !owner.profileImage ? 'scale-140' : ''
                      }`}
                    />
                  </div>
                  <span className="text-[15px] font-medium text-gray-600">{owner.nickname}</span>
                </div>
              </div>

              {/* 제목 */}
              <h2 className="heading-h5-md text-black mb-8">{`[제안] ${title}`}</h2>

              {/* 요약 */}
              <div className="space-y-3 mb-10 pb-2">
                {price != null && (
                  <div className="flex items-center gap-4">
                    <span className="body-b1-rg text-[var(--color-gray-60)]">제안 금액</span>
                    <span className="heading-h4-bd text-black">{price.toLocaleString()}원</span>
                  </div>
                )}
                {expectedWorking != null && (
                  <div className="flex items-center gap-4">
                    <span className="body-b1-rg text-[var(--color-gray-60)]">예상 배송일</span>
                    <span className="body-b1-rg text-black">{expectedWorking}일 이내</span>
                  </div>
                )}
                {delivery != null && (
                  <div className="flex items-center gap-4">
                    <span className="body-b1-rg text-[var(--color-gray-60)]">배송비</span>
                    <span className="body-b1-rg text-black">{delivery.toLocaleString()}원</span>
                  </div>
                )}
              </div>

              {/* 상세 설명 */}
              <div className="body-b1-rg text-black leading-7 space-y-4 flex-grow pl-10 pr-5 pb-10">
                <p>{content}</p>
              </div>
            </div>

            {/* 수정 버튼: REFORMER일 때만 */}
            {userRole === 'reformer' && (
            <div className="mt-12">
                <button
                onClick={handleEditProposal}
                className="w-full py-4 border-1 border-[var(--color-mint-1)] body-b0-bd text-[var(--color-mint-1)] rounded-[0.625rem]"
                >
                견적서 수정하기
                </button>
            </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatProposalDetailPage;
