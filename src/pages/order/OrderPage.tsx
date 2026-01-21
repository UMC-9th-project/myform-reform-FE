import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb/Breadcrumb';
import RequestCard from '../../components/domain/order/Request';
import SuggestionCard from '../../components/domain/order/Suggestion';
import Button from '../../components/common/Button/button1';
import pencilIcon from '../../assets/icons/pencilLine.svg';

const OrderPage = () => {
  const navigate = useNavigate();
  const handleRequestReform = () => {
    navigate('/order/임시경로');
  };
  // 새로 등록된 요청 데이터
  const newRequests = [
    {
      id: 1,
      img: '/crt1.jpg',
      name: '제 소중한 기아 쿠로미 유니폼 짐색으로 만들어 주실 리폼 장인을 찾아요',
      price: '30,000원~50,000원',
    },
    {
      id: 2,
      img: '/crt2.jpg',
      name: '제 소중한 기아 쿠로미 유니폼 짐색으로 만들어 주실 리폼 장인을 찾아요',
      price: '30,000원~50,000원',
    },
    {
      id: 3,
      img: '/crt1.jpg',
      name: '제 소중한 기아 쿠로미 유니폼 짐색으로 만들어 주실 리폼 장인을 찾아요',
      price: '30,000원~50,000원',
    },
  ];

  // 리폼러가 받고 있는 주문제작 데이터
  const reformerOrders = [
    {
      id: 1,
      img: '/wsh1.jpg',
      name: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
      price: '75,000원',
      review: 4.9,
      reviewCount: 271,
      nickname: '침착한 대머리독수리',
    },
    {
      id: 2,
      img: '/wsh2.jpg',
      name: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
      price: '75,000원',
      review: 4.9,
      reviewCount: 271,
      nickname: '침착한 대머리독수리',
    },
    {
      id: 3,
      img: '/wsh3.jpg',
      name: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
      price: '75,000원',
      review: 4.9,
      reviewCount: 271,
      nickname: '침착한 대머리독수리',
    },
  ];

  

  return (
    <div className="bg-white pb-[7.4375rem]">
      <div className="px-4 md:px-[3.125rem] pt-8 md:pt-[3.125rem]">
        {/* 브레드크럼 */}
        <div className="body-b1-rg text-[var(--color-gray-60)] mb-6 md:mb-8 pl-0 md:pl-[110px]">
          <Breadcrumb
            items={[
              { label: '홈', path: '/' },
              { label: '주문제작' },
            ]}
          />
        </div>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 md:mb-12 pl-0 md:pl-[110px] md:pr-[110px]">
          <div>
            <h1 className="heading-h2-bd mb-[2.625rem]">주문제작</h1>
            <p className="heading-h5-rg mb-[2.625rem] text-[var(--color-gray-50)]">
            내가 원하는 리폼 방식을 설명하고 나만의 아이템을 제작해보세요.
            </p>

          </div>
          <Button
            variant="primary"
            size="default"
            onClick={handleRequestReform}
            className=" justify-between px-[1.5rem] py-[1.75rem] rounded-[0.75rem]"
          >
            <span>리폼 요청하기</span>
            <img src={pencilIcon} alt="리폼 요청" className="w-8 h-8 invert " />
          </Button>
        </div>

        {/* Section 1: 새로 등록된 요청 */}
        <section className="px-0 md:px-[110px] mb-[5rem]">
          <div className="flex items-center justify-between mb-[1.5rem]">
            <h2 className="heading-h4-bd">지금 새로 등록된 요청 🌟</h2>
            <button 
              onClick={() => navigate('/order/requests')}
              className="cursor-pointer body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] transition-colors"
            >
              더보기 &gt;
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
            {newRequests.map((item) => (
              <RequestCard
                key={item.id}
                imgSrc={item.img}
                title={item.name}
                priceRange={item.price}
              />
            ))}
          </div>
        </section>

        {/* Section 2: 리폼러가 주문제작을 받고 있어요 */}
        <section className="pt-[7rem] px-0 md:px-[110px]">
          <div className="flex items-center justify-between mb-[1.5rem]">
            <h2 className="heading-h4-bd">리폼러가 주문제작을 받고 있어요 🔥</h2>
            <button className="cursor-pointer body-b1-rg text-[var(--color-gray-60)] hover:text-[var(--color-black)] transition-colors">
              더보기 &gt;
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-[1.875rem]">
            {reformerOrders.map((item) => (
              <SuggestionCard
                key={item.id}
                imgSrc={item.img}
                title={item.name}
                price={item.price}
                rating={item.review}
                reviewCountText={`(${item.reviewCount})`}
                nickname={item.nickname}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrderPage;
