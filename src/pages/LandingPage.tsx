import { useState } from 'react';
import logo from '../assets/logos/logo.svg';
import rightIcon from '../assets/icons/right.svg';
import scissorIcon from '../assets/logos/scissors.svg';
import scissorIcon2 from '../assets/logos/scissors2.svg';
import blackScissorIcon from '../assets/logos/blackScissors.svg';
import clothes from '../assets/landing/landingClothes.svg';
import chatImg from '../assets/landing/chatImg.svg';
import list from '../assets/landing/list.svg';
import paper from '../assets/landing/paper.svg';
import list2 from '../assets/landing/list2.svg';
import orderRequest from '../assets/landing/request.svg';
import market from '../assets/landing/market.svg';
import findReform from '../assets/landing/reformerFind.svg';
import land01 from '../assets/landing/land01.svg';
import land02 from '../assets/landing/land02.svg';
import land03 from '../assets/landing/land03.svg';
import land04 from '../assets/landing/land04.svg';
import land05 from '../assets/landing/land05.svg';
import land06 from '../assets/landing/land06.svg';
import land11 from '../assets/landing/land11.svg';
import { useNavigate } from 'react-router-dom';



const FIFTH_SECTION_TABS = [
  {
    id: 'tab1',
    label: '주문요청',
    path: '/order',
    title: '리폼 주문요청 하러가기',
    description: (
      <>
        한 번의 요청으로 <span className="body-b0-sb">다양한 견적을 동시에</span> 받아보세요.
        <br />
        가격 비교뿐만 아니라 리폼러의 상품과 리뷰를 꼼꼼히 확인하여 <br /> 소중한 나의 아이템을 믿고 맡길 수 있는{' '}
        <span className="body-b0-sb">최적의 파트너</span>를 찾을 수 있어요.
      </>
    ),
    buttonText: '요청글 쓰러가기',
    image: orderRequest,
  },
  {
    id: 'tab2',
    label: '마켓',
    path: '/market',
    title: '리폼 제품 구경하러 가기',
    description: (
      <>
        리폼러의 손길을 거쳐 <span className="body-b0-sb">새로운 생명력을 얻은 제작물들</span>을 구경해 보세요.
        <br />
        일상의 가치를 더해줄 감각적인 스타일의 제품들을 <br /> 
        <span className="body-b0-sb">내폼리폼 마켓에서</span> 편하게 만나보실 수 있습니다.
      </>
    ),
    buttonText: '마켓 둘러보기',
    image: market,
  },
  {
    id: 'tab3',
    label: '리폼러 찾기',
    path: '/reformer-search',
    title: '리폼러 둘러보기',
    description: (
      <>
        나의 안목과 딱 맞는 감각을 가진 <span className="body-b0-sb">리폼러는 누구일까요?</span>
        <br />
        다양한 스타일을 가진 작가들의 프로필을 둘러보며 <br /> 
        여러분의 아이디어를 실현해 줄 전문가를 찾아 보세요.
      </>
    ),
    buttonText: '리폼러 찾기',
    image: findReform,
  },
] as const;

const LandingPage = () => {
    const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>(FIFTH_SECTION_TABS[0].id);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  
  const slides = [land01, land02, land03, land04, land05, land06];
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  return (
    <div className="w-full overflow-x-hidden mb-0">
      {/* 첫 번째 섹션 */}
      <div
        className="w-full h-screen relative overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(5, 212, 205, 1),rgba(177, 252, 234, 1))',
        }}
      >
        <img 
          src={scissorIcon} 
          alt="scissor" 
          className="absolute w-[951px] h-[989px] opacity-60 brightness-0 invert object-contain"         
          style={{
            top: '-35.11px',
            left: '-18.03px',
         
          }}
        />
        <img 
          src={scissorIcon2} 
          alt="scissor right" 
          className="absolute w-[538px] h-[527px] opacity-15 brightness-0 invert"
          style={{
            top: '-11.35px',
            right: '-20px',
            transform: 'rotate(6.91deg)',
          }}
        />
        <div className="flex flex-col items-center justify-center h-screen relative z-10" >
          <p className="heading-h2-bd">리폼하고 싶은데</p>
          <p className="heading-h2-bd">누구에게 맡길지는 모르겠다면?</p>
          <img src={logo} alt="logo" className="mt-10 w-140 h-140 brightness-0 -my-4 object-contain" style={{ maxHeight: '200px' }} />
          <button type="button" onClick={() => navigate('/home')} className="mt-20 heading-h5-sb bg-black text-white px-16 py-4 rounded-full flex items-center gap-2 cursor-pointer">
            자세히 둘러보기

            <img src={rightIcon} alt="right" className="w-10 h-10 brightness-0 invert pb-1" />
          </button>
        </div>
      </div>

      {/* 두 번째 섹션 */}
      <div
        className="w-full min-h-screen relative"
        style={{
          background: 'linear-gradient(to bottom, rgba(176, 251, 233, 1),  rgba(203, 253, 241, 1), rgba(255, 255, 255, 1))',
        }}
      > 
        <div className="heading-h5-sb text-[var(--color-gray-50)]  flex flex-col items-center justify-center">
            <img src={blackScissorIcon} alt="blackScissor" className="w-20 h-20  object-contain mb-13" />
            <p>내폼리폼은 고객과 전문 리폼러를 연결해주는 플랫폼으로</p>
            <p>다양한 스포츠 굿즈부터 나만의 유니폼 리폼까지 내 취향에 맞는 리폼을 만날 수 있어요!</p>
        </div>
       {/* 섹션 중간~하단 반원 배경 */}
        <div
          className="pointer-events-none absolute opacity-50 inset-x-0 bottom-0 w-full h-[424px] z-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(203, 253, 241, 1),  rgba(217, 254, 245, 1))',
            borderBottomLeftRadius: '50% 100%',
            borderBottomRightRadius: '50% 100%',
          }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center pt-20">
          <img src={clothes} alt="clothes" className="w-6xl h-6xl object-contain" />
        </div>
      </div>

      {/* 세 번째 섹션 */}
      <div className="w-full min-h-screen bg-white relative  flex flex-col items-center justify-center gap-30">
        <p className="heading-h2-bd ">내폼리폼은 이런 가치를 제공해요!</p>
        <img src={list2} alt="list2" className="h-full object-contain" />

      </div>    


      {/* 네 번째 섹션 */}
      <div
        className="w-full min-h-screen relative px-40 pt-20 overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(5, 34, 27, 1) 60% , rgba(5, 212, 205, 1))',
        }}
      >
        <img
          src={paper}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[-150px] top-[-80px] w-[520px] opacity-50 z-0"
          style={{ transform: 'scaleY(-1) rotate(120deg)'  }}
        />
        <img
          src={paper}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-[-100px] top-[340px] w-[520px] opacity-50 z-0"
          style={{ transform: 'scaleX(-1)' }}
        />
        <img
          src={paper}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[30px] bottom-[550px] w-[260px] opacity-50 z-0"
          style={{ transform: 'rotate(5deg)' }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center">
            <p className="text-white heading-h2-bd">혹시 이런 고민 해보신 적 있나요?</p>
            <img src={chatImg} alt="chatImg" className="pt-20  w-full h-full object-contain" />

            <p className="text-white heading-h2-bd pt-30">
            내폼리폼에서는 요청 한 번으로{' '}
            <span className="text-[rgba(246,111,111,1)]">여러 리폼러의 제안</span>
            을 받아보고
            </p>
            <p className="text-white heading-h2-bd">
            <span className="text-[rgba(246,111,111,1)]">가격, 스타일을 비교한 뒤</span>{' '}
            선택할 수 있어요!
            </p>
            
        </div>
       

        <p className="text-white heading-h2-bd pt-60 pl-7">내폼리폼을 200% 활용하는 방법</p>
        <img src={list} alt="list" className="w-full h-full pb-20" />


      </div>

      {/* 네 번째와 다섯 번째 사이 섹션 - 서비스 화면 소개 슬라이드 */}
      <div className="w-full min-h-screen bg-white relative py-40 px-40 flex flex-col items-center justify-center">
        <h2 className="heading-h2-bd text-center mb-12">내폼리폼의 서비스 화면을 소개해요!</h2>
        
        {currentSlide === 1 ? (
          <>
            <div className="bg-[var(--color-mint-5)] px-8 py-3 rounded-full mb-12">
              <span className="body-b1-sb">주문제작 (소비자)</span>
            </div>
            
            <p className="body-b0-rg text-[rgba(55,69,83,1)] text-center mb-10 max-w-2xl" style={{ fontSize: '20px', lineHeight: '150%', letterSpacing: '0%' }}>
              소비자는 원하는 리폼 작업(사진·설명)을 등록하여<br />
              리폼러에게 견적을 받을 수 있습니다.
            </p>
          </>
        ) : currentSlide === 2 ? (
          <>
            <div className="bg-[var(--color-mint-5)] px-8 py-3 rounded-full mb-12">
              <span className="body-b1-sb">주문제작 (리폼러)</span>
            </div>
            
            <p className="body-b0-rg text-[rgba(55,69,83,1)] text-center mb-10 max-w-2xl" style={{ fontSize: '20px', lineHeight: '150%', letterSpacing: '0%' }}>
              주문제작 판매글 게시 및 요청글에 맞는 견적서 제안을 할 수 있습니다.<br />
              판매 외 추가수익 창출이 가능한 기회로 활용됩니다.
            </p>
          </>
        ) : currentSlide === 3 ? (
          <>
            <div className="bg-[var(--color-mint-5)] px-8 py-3 rounded-full mb-12">
              <span className="body-b1-sb">리폼러 찾기</span>
            </div>
            
            <p className="body-b0-rg text-[rgba(55,69,83,1)] text-center mb-10 max-w-2xl" style={{ fontSize: '20px', lineHeight: '150%', letterSpacing: '0%' }}>
              리폼러를 직접 검색해서 찾고,<br />
              피드 탐색을 통해 내 취향에 맞는 리폼러를 찾을 수 있어요.
            </p>
          </>
        ) : currentSlide === 4 ? (
          <>
            <div className="bg-[var(--color-mint-5)] px-8 py-3 rounded-full mb-12">
              <span className="body-b1-sb">리폼러 프로필</span>
            </div>
            
            <p className="body-b0-rg text-[rgba(55,69,83,1)] text-center mb-10 max-w-2xl" style={{ fontSize: '20px', lineHeight: '150%', letterSpacing: '0%' }}>
              작업물, 판매 상품, 후기를 아카이빙할 수 있는 공간을 제공합니다.<br />
              소비자는 리폼러의 실력, 후기 확인이 가능합니다.
            </p>
          </>
        ) : currentSlide === 5 ? (
          <>
            <div className="bg-[var(--color-mint-5)] px-8 py-3 rounded-full mb-12">
              <span className="body-b1-sb">실시간 채팅</span>
            </div>
            
            <p className="body-b0-rg text-[rgba(55,69,83,1)] text-center mb-10 max-w-2xl" style={{ fontSize: '20px', lineHeight: '150%', letterSpacing: '0%' }}>
              리폼러-구매자 간 원활한 소통 창구를 제공합니다.<br />
              상담 및 리폼 진행 상황을 확인할 수 있습니다.
            </p>
          </>
        ) : (
          <>
            <div className="bg-[var(--color-mint-5)] px-8 py-3 rounded-full mb-12">
              <span className="body-b1-sb">리폼 마켓</span>
            </div>
            
            <p className="body-b0-rg text-[rgba(55,69,83,1)] text-center mb-10 max-w-2xl" style={{ fontSize: '20px', lineHeight: '150%', letterSpacing: '0%' }}>
              소비자는 원하는 <span className="body-b0-sb">상품을 구매</span>하고,<br />
              리폼러는 본인 작업물을 판매할 수 있어요.
            </p>
          </>
        )}

        {/* 슬라이드 컨테이너 */}
        <div className="relative w-full max-w-[1400px] mb-6 mx-auto" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
          {/* 슬라이드 이미지 */}
          <div className="relative w-full flex items-center justify-center" style={{ overflowX: 'hidden', overflowY: 'visible', minHeight: '600px' }}>
            <div 
              className="flex items-center transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(calc(25% - ${currentSlide * 50}%))`,
                height: '100%'
              }}
            >
              {slides.map((slide, index) => {
                const isActive = index === currentSlide;
                const isPrev = index === currentSlide - 1;
                const isNext = index === currentSlide + 1;
                const isVisible = Math.abs(index - currentSlide) <= 1;
                
                return (
                  <div 
                    key={index} 
                    className="flex-shrink-0 flex items-center justify-center transition-all duration-500"
                    style={{ 
                      width: '50%',
                      padding: '0 1%',
                      height: '100%',
                      opacity: isVisible ? 1 : 0.3,
                      transform: isActive ? 'scale(1.3)' : (isPrev || isNext) ? 'scale(0.85)' : 'scale(0.8)',
                      zIndex: isActive ? 10 : 1
                    }}
                  >
                    <img 
                      src={slide} 
                      alt={`내폼리폼 서비스 화면 ${index + 1}`} 
                      className="h-auto object-contain drop-shadow-lg"
                      style={{ maxHeight: 'none', margin: '0 auto', display: 'block' }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="flex items-center gap-6">
          {/* 왼쪽 화살표 */}
          <button
            type="button"
            onClick={prevSlide}
            className="text-[var(--color-gray-40)] hover:text-[var(--color-gray-50)] transition-colors cursor-pointer"
            aria-label="이전 슬라이드"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* 페이지 인디케이터 */}
          <div className="flex items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={`transition-all ${
                  currentSlide === index
                    ? 'w-8 h-2.5 rounded-full bg-[var(--color-mint-0)]'
                    : 'w-2.5 h-2.5 rounded-full bg-[var(--color-gray-30)] hover:bg-[var(--color-gray-40)]'
                }`}
                aria-label={`슬라이드 ${index + 1}로 이동`}
              />
            ))}
          </div>

          {/* 오른쪽 화살표 */}
          <button
            type="button"
            onClick={nextSlide}
            className="text-[var(--color-gray-40)] hover:text-[var(--color-gray-50)] transition-colors cursor-pointer"
            aria-label="다음 슬라이드"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* 네 번째와 다섯 번째 사이 섹션 - IA/정보 구조도 */}
      <div className="w-full min-h-screen bg-white relative py-40 px-40 flex flex-col items-center justify-center">
        <div className="text-center mb-30">
          <h2 className="body-b0-rg text-[var(--color-gray-60)] mb-4">IA / 정보 구조도</h2>
          <p className="heading-h2-bd">
            내폼리폼의 서비스 구조를 한 눈에 파악해요!
          </p>
        </div>
        
        <div className="w-full max-w-[1400px] flex items-center justify-center">
          <img 
            src={land11} 
            alt="내폼리폼 정보 구조도" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* 다섯 번째 섹션 */}
      <div className="w-full min-h-screen bg-white relative py-10 px-40 pb-50">
        <div className="mx-auto">
          {/* 탭 버튼 */}
          <div className="flex gap-1 mt-20 ">
            {FIFTH_SECTION_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`body-b1-sb pr-6 py-4 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'text-[var(--color-mint-1)] -mb-px'
                    : 'text-[var(--color-gray-40)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* 탭 패널 */}
          <div className="pt-12">
            {FIFTH_SECTION_TABS.map((tab) =>
              activeTab === tab.id ? (
                <div key={tab.id} className="flex gap-16 items-center">
                  <div className="flex-1 flex flex-col gap-13">
                    <h3 className="heading-h2-bd ">{tab.title}</h3>
                    <p className="body-b0-rg text-[var(--color-gray-60)] leading-relaxed">
                      {tab.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(tab.path)}
                      className="body-b0-sb bg-[var(--color-mint-0)] text-white px-9 py-3 rounded-full mt-10 flex items-center gap-2 w-fit hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      {tab.buttonText}
                      <img src={rightIcon} alt="right" className="w-10 h-10 brightness-0 invert pb-1" />
                    </button>
                  </div>
                  <div className="flex-1 relative min-h-[400px] bg-[var(--color-gray-10)] rounded-lg flex items-center justify-center p-8">
                    {tab.image && (
                      <img
                        src={tab.image}
                        alt={tab.label}
                        className="w-full h-full object-contain max-h-[400px]"
                      />
                    )}
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      {/* 여섯 번째 섹션 */}
      <div className="w-full min-h-screen bg-[var(--color-mint-5)] relative overflow-hidden">
        <img
          src={scissorIcon}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute z-0 w-[951px] h-[989px] opacity-100 brightness-0 invert object-contain"
          style={{ top: '-35.11px', left: '-18.03px' }}
        />
        <img
          src={scissorIcon2}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute z-0 w-[538px] h-[527px] opacity-30 brightness-0 invert"
          style={{ top: '-11.35px', right: '-20px', transform: 'rotate(6.91deg)' }}
        />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-10">
            <div className="heading-h4-sb text-[var(--color-gray-70)] text-center">
                <p>다양한 굿즈부터 나만의 유니폼 리폼까지</p>
                <p>내 취향에 맞는 리폼을 만나는 곳</p>
            </div>

            <p className="heading-h1-bd text-center">내 유니폼 리폼, 내폼리폼에서</p>
          <button type="button" onClick={() => navigate('/order')} className="mt-20 heading-h5-sb bg-[var(--color-mint-0)] text-white px-15 py-5 rounded-full flex items-center gap-2 cursor-pointer">
            리폼하러 가기
            <img src={rightIcon} alt="right" className="w-10 h-10 brightness-0 invert pb-1" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
