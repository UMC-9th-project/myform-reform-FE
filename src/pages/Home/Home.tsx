import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import ProductCard from '../../components/domain/market/ProductCard';
import 'swiper/css';
import 'swiper/css/navigation';

const product = {
  img: '/Home/images/p1.jpg',
  name: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
  price: '75,000원',
  review: 4.9,
  count: 271,
  nickname: '침착한 대머리독수리',
};

const Home = () => {
  return (
    <div className="">
      <div className="w-full h-[457px] mt-[3.25rem] ">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={-125}
          slidesPerView={1.3}
          centeredSlides={true}
          className="w-full h-full"
        >
          <SwiperSlide className="flex ">
            <img
              src="/Home/images/home1.jpg"
              alt="image1"
              className="h-full"
            />
           
          </SwiperSlide>
          <SwiperSlide className="flex items-center justify-center">
            <img
              src="/Home/images/home1.jpg"
              alt="image2"
              className="h-full "
            />
          </SwiperSlide>
          <SwiperSlide className="flex items-center justify-center">
            <img
              src="/Home/images/home1.jpg"
              alt="image3"
              className="w-[1019px] h-full object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className='mt-[7.8rem] mx-[9.375rem]'>
      <div className='heading-h1-bd  flex flex-col '>
        <p>내 폼을 나답게!</p>
        <p>나에게 딱 맞는 <span className='text-[var(--color-mint-1)]'>리폼 스타일</span>을 찾아보세요</p>
      </div>

      <div className='mt-[3.4375rem]'>
        <div className='heading-h4-bd'>요즘 뜨는 리폼 스타일</div>
        <div className='flex mt-[1.875rem]  items-center '>
          <ProductCard img={product.img} name={product.name} price={product.price} review={product.review} count={product.count} nickname={product.nickname} />
          <ProductCard img={product.img} name={product.name} price={product.price} review={product.review} count={product.count} nickname={product.nickname} />
          <ProductCard img={product.img} name={product.name} price={product.price} review={product.review} count={product.count} nickname={product.nickname} />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
