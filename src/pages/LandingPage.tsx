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
          <button type="button" onClick={() => navigate('/')} className="mt-20 heading-h5-sb bg-black text-white px-16 py-4 rounded-full flex items-center gap-2 cursor-pointer">
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
