import product from '../market/images/produect.jpg';
import star from '../market/icons/star.svg';
import heart from '../../../assets/icons/heart.svg';

export default function ProductCard() {
  const productData = {
    img: product,
    name: '이제는 유니폼도 색다르게! 한화·롯데 등 야구단 유니폼 리폼해드립니다.',
    price: '75,000원',
    review: 4.9,
    count: '(271)',
    nickname: '침착한 대머리독수리',
  };

  return (
    <div className="w-[361px] h-[624px] flex flex-col py-[3.125rem]">
      <div className="relative h-[307px] rounded-[1.25rem] overflow-hidden mb-[0.875rem]">
        <img src={productData.img} alt={productData.name} />
        <button className="absolute bottom-[0.875rem] right-[0.875rem] flex items-center justify-center cursor-pointer">
          <img src={heart} alt="좋아요" />
        </button>
      </div>

      <div className="body-b0-sb  line-clamp-2 mb-[0.5625rem]">
        <p>{productData.name}</p>
      </div>
      <div className="heading-h4-bd">
        <p>{productData.price}</p>
      </div>

      <div className="flex body-b5-rg gap-[0.3125rem] mb-[1.0625rem]">
        <img src={star} alt="star" />
        <p className="bod-b3-rg">
          {productData.review} {''}
          <span className="text-[var(--color-gray-50)]">
            {productData.count}
          </span>
        </p>
      </div>
      <div className="w-[120px] body-b5-sb text-[var(--color-gray-50)] bg-[var(--color-gray-30)] rounded-[0.375rem] px-[0.3125rem] py-[0.125rem]">
        <p>{productData.nickname}</p>
      </div>
    </div>
  );
}
