import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import WishlistItemCard from '../../components/domain/wishlist/WishlistItemCard';
import ReformerSearchCard from '../../components/domain/reformer-search/ReformerProfileCard';
import HomeServiceCard from '../../components/domain/home/HomeServiceCard';
import crownIcon from '../../assets/home/crown.svg';
import leftIcon from '../../assets/icons/left.svg';
import rightIcon from '../../assets/icons/right.svg';

import service1 from '../../assets/home/service1.jpg';
import service2 from '../../assets/home/service2.jpg';
import service3 from '../../assets/home/service3.jpg';
import service4 from '../../assets/home/service4.jpg';


import 'swiper/css';
import 'swiper/css/navigation';


const productData = [
  {
    id: 1,
    image: '/Home/images/p1.jpg',
    title: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    price: 75000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 2,
    image: '/Home/images/p1.jpg',
    title: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    price: 75000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
  {
    id: 3,
    image: '/Home/images/p1.jpg',
    title: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    price: 75000,
    rating: 4.9,
    reviewCount: 271,
    seller: '침착한 대머리독수리',
  },
];

const Home = () => {
  return (
    <div>
      <div className="w-full h-[457px] mt-[3.25rem] home-swiper-container">
        <style>{`
          .home-swiper-container .swiper-button-prev::before {
            background-image: url(${leftIcon}) !important;
          }
          .home-swiper-container .swiper-button-next::before {
            background-image: url(${rightIcon}) !important;
          }
        `}</style>
        <Swiper
          loop={true}
          modules={[Navigation, Autoplay]}
          navigation  
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          loopPreventsSliding={false}
          spaceBetween={-125}
          slidesPerView={1.3}
          centeredSlides={true}
          className="w-full h-full"
        >
          <SwiperSlide>
            <img
              src="/Home/images/home1.jpg"
              alt="image1"
              className="h-full"
            />
          </SwiperSlide>
          <SwiperSlide> 
            <img
              src="/Home/images/home2.jpg"
              alt="image2"
              className="h-full "
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/Home/images/home3.jpg"
              alt="image3"
              className="w-[1019px] h-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/Home/images/home1.jpg"
              alt="image1"
              className="h-full"
            />
          </SwiperSlide>
          <SwiperSlide> 
            <img
              src="/Home/images/home2.jpg"
              alt="image2"
              className="h-full "
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className='mt-[7.8rem] mx-[9.375rem]'>
      <div className='heading-h1-bd  flex flex-col'>
        <p>내 폼을 나답게!</p>
        <p>나에게 딱 맞는 <span className='text-[var(--color-mint-1)]'>리폼 스타일</span>을 찾아보세요</p>
      </div>

      <div className='mt-[3.4375rem]'>
        <div className='heading-h4-bd'>요즘 뜨는 리폼 스타일 👕</div>
        <div className='flex mt-[1.875rem] gap-[1.875rem] items-center'>
          {productData.map((item) => (
            <WishlistItemCard key={item.id} item={item} onRemove={() => {}} />
          ))}
        </div>

        <div className='heading-h4-bd mt-[5rem]'>주문제작으로 나만의 스타일 완성! ✨</div>
        <div className='flex mt-[1.875rem] gap-[1.875rem] items-center'>
          {productData.map((item) => (
            <WishlistItemCard key={item.id} item={item} onRemove={() => {}} />
          ))}
        </div>
      </div>

      <div className='mt-[4.75rem]'>
          <div className='heading-h4-bd flex pl-[1.3125rem] gap-[0.75rem] w-[260px] rounded-[1.875rem] bg-[var(--color-black)] text-[var(--color-white)] py-[0.5rem] '>
            <img src={crownIcon} alt="crown"/> 베스트 리폼러</div>
            
          <div className='mt-[0.75rem] py-[1.375rem]'>
            <style>{`
              .best-reformer-swiper .swiper-button-prev::before {
                background-image: url(${leftIcon}) !important;
              }
              .best-reformer-swiper .swiper-button-next::before {
                background-image: url(${rightIcon}) !important;
              }
            `}</style>
            <Swiper
              loop={true}
              loopPreventsSliding={false}
              modules={[Navigation]}
              navigation
              spaceBetween={15}
              slidesPerView={3}
              className="w-full h-full"
            >
              <SwiperSlide>
                <ReformerSearchCard
                  name="침착한 대머리독수리"
                  rating={4.9}
                  reviewCount={271}
                  transactionCount={415}
                  description="- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움..."
                  tags={['#빠른', '#친절한']}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ReformerSearchCard
                  name="침착한 대머리독수리"
                  rating={4.9}
                  reviewCount={271}
                  transactionCount={415}
                  description="- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움..."
                  tags={['#빠른', '#친절한']}
                />
              </SwiperSlide>
              <SwiperSlide>
                <ReformerSearchCard
                  name="침착한 대머리독수리"
                  rating={4.9}
                  reviewCount={271}
                  transactionCount={415}
                  description="- 2019년부터 리폼 공방 운영 시작 ✨ / - 6년차 스포츠 의류 리폼 전문 공방 / 고객님들의 요청과 아쉬움..."
                  tags={['#빠른', '#친절한']}
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
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
