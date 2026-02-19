import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';


import ReformerSearchCard from '../../components/domain/reformer-search/ReformerProfileCard';
import MarketCard from '../../components/common/card/MarketCard';
import HomeServiceCard from '../../components/domain/home/HomeServiceCard';
import crownIcon from '../../assets/home/crown.svg';
import swiperLeftIcon from '../../assets/home/swiperprev.svg';
import swiperRightIcon from '../../assets/home/swipernext.svg';

import { useHome } from '../../hooks/domain/home/useHome';
import useAuthStore from '../../stores/useAuthStore';

import service1 from '../../assets/home/service1.jpg';
import service2 from '../../assets/home/service2.jpg';
import service3 from '../../assets/home/service3.jpg';
import service4 from '../../assets/home/service4.jpg';


import 'swiper/css';
import 'swiper/css/navigation';


const Home = () => {
  const { data: homeData } = useHome();
  const userRole = useAuthStore((state) => state.role);
  const isReformer = userRole === 'reformer';

  const banners = homeData?.success?.home_data?.banners ?? [];
  const bestReformers = homeData?.success?.home_data?.best_reformers ?? [];
  const trendingItems = homeData?.success?.home_data?.trending_items ?? [];
  const customOrders = homeData?.success?.home_data?.custom_orders ?? [];
  

  
  return (
    <div>
      <div className="w-full h-[457px] mt-[3.25rem] home-swiper-container relative">
        <button className="home-swiper-prev absolute left-[1.25rem] top-1/2 -translate-y-1/2 z-10">
          <img src={swiperLeftIcon} alt="이전"/>
        </button>
        <button className="home-swiper-next absolute right-[1.25rem] top-1/2 -translate-y-1/2 z-10 ">
          <img src={swiperRightIcon} alt="다음" />
        </button>
        
        <Swiper
          loop={true}
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: '.home-swiper-prev',
            nextEl: '.home-swiper-next',
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loopPreventsSliding={false}
          spaceBetween={50}
          slidesPerView={1.4}
          centeredSlides={true}
          className="w-full h-full"
        >
          {banners?.map((banner) => (
            <SwiperSlide key={banner.id} >
              <img
                src={banner.image_url}
                alt={`배너 ${banner.id}`}
                className="w-full h-full object-cover rounded-[1.25rem] transition-transform duration-300"         
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className='mt-[7.8rem] mx-[9.375rem]'>
      <div className='heading-h2-bd  flex flex-col'>
        <p>내 폼을 나답게!</p>
        <p>나에게 딱 맞는 <span className='text-[var(--color-mint-1)]'>리폼 스타일</span>을 찾아보세요</p>
      </div>

      <div className='mt-[3.4375rem]'>
        <div className='heading-h4-bd'>요즘 뜨는 리폼 스타일 👕</div>
        <div className='grid grid-cols-3 mt-[1.875rem] gap-[1.875rem] items-center'>
          {trendingItems.map((item) => (
            <MarketCard key={item.item_id} item={item} hideLikeButton={isReformer} />
          ))}
        </div>

        <div className='heading-h4-bd mt-[5rem]'>주문제작으로 나만의 스타일 완성! ✨</div>
        <div className='grid grid-cols-3 mt-[1.875rem] gap-[1.875rem] items-center'>
      
        {customOrders.map((order) => (
          <MarketCard key={order.proposal_id} item={order}  />
        ))}
        </div>
      </div>

      <div className='mt-[4.75rem]'>
          <div className='heading-h4-bd flex pl-[1.3125rem] gap-[0.75rem] w-[260px] rounded-[1.875rem] bg-[var(--color-black)] text-[var(--color-white)] py-[0.5rem] '>
            <img src={crownIcon} alt="crown"/> 베스트 리폼러</div>    
        </div>
      </div>

      <div className='mt-[0.75rem] py-[1.375rem]  relative'>
            <button className="product-image-prev absolute left-[68px] top-1/2 -translate-y-1/2 w-[3.125rem] h-[3.125rem] cursor-pointer z-10">
              <img src={swiperLeftIcon} alt="이전"  />
            </button>
            <button className="product-image-next absolute right-[68px] top-1/2 -translate-y-1/2 w-[3.125rem] h-[3.125rem] cursor-pointer z-10">
              <img src={swiperRightIcon} alt="다음" />
            </button>

            <Swiper
              loop={true}
              loopPreventsSliding={false}
              modules={[Navigation]}
              navigation={{
                prevEl: '.product-image-prev',
                nextEl: '.product-image-next',
              }}
              spaceBetween={15}
              slidesPerView={3}
              className="w-300 h-full rounded-[0.625rem]"
            >
              
              {bestReformers?.map((reformer) => (
                <SwiperSlide key={reformer.owner_id} className='px-2 py-2'>
                  <ReformerSearchCard
                    reformer={{
                      owner_id: reformer.owner_id,
                      nickname: reformer.nickname,
                      profile_photo: reformer.profile_image || '',
                      bio: reformer.bio || '',
                      keywords: reformer.keywords || [],
                      avg_star: reformer.avg_star,
                      review_count: reformer.review_count,
                      trade_count: reformer.trade_count,
                    }}
                  />
                </SwiperSlide>
              ))}       
            </Swiper>
          </div>

       
       <div className="w-full mt-[3.3125rem] pt-[4.4375rem] px-[9.375rem] h-[581px] bg-gradient-to-b from-white to-[#06dbd3] ">
        <h2 className="heading-h2-bd text-[2.5rem] mb-[2.875rem]">
          내폼리폼을 <span className="text-[var(--color-mint-1)]">200%</span> 활용하는 방법
        </h2>
        <div className="flex items-center justify-between">
          <HomeServiceCard
            title="리폼 요청"
            description1="발품 팔기 번거로우셨죠?"
            description2="게시글 하나로 여러 견적을 받을 수 있어요."
            image={service1}
            imageAlt="리폼 요청"
          />
          <HomeServiceCard
            title="견적 제안"
            description1="초보 리폼러도 부담없이 거래해요!"
            description2="견적을 선제안해보세요."
            image={service2}
            imageAlt="견적 제안"
           
          />
          <HomeServiceCard
            title="실시간 채팅"
            description1="리폼러와 직접 소통할 수 있어요."
            description2="문의, 진행 상황을 관리해요."
            image={service3}
            imageAlt="실시간 채팅"
           
          />
          <HomeServiceCard
            title="리폼러 피드"
            description1="나의 스타일을 소개해주세요!"
            description2="개인 리폼 아카이브를 제공해요."
            image={service4}
            imageAlt="리폼러 피드"
           
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
